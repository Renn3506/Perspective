import os
from typing import List, cast
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import hdbscan
import numpy as np
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, exists
from backend.common.db.models import Fact, Alignment


def cluster_facts():
    load_dotenv()

    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_HOST = os.getenv("DB_HOST", "db")
    DB_NAME = os.getenv("DB_NAME")

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        facts_to_cluster = (
            session.query(Fact)
            .filter(
                ~session.query(Alignment)
                .filter(Alignment.fact_id == Fact.id)
                .exists()
            )
            .all()
        )   
        
        if not facts_to_cluster:
            print("No new facts to cluster.")
            return

        if len(facts_to_cluster) == 1:
            alignment = Alignment(
                fact_id=facts_to_cluster[0].id,
                cluster_id=-1
            )
            session.add(alignment)
            session.commit()
            return
        
        fact_texts: List[str] = [
            cast(str, fact.text) for fact in facts_to_cluster
        ]

        model = SentenceTransformer("all-MiniLM-L6-v2")

        embeddings: np.ndarray = model.encode(
            fact_texts,
            convert_to_numpy=True
        )

        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=2,
            gen_min_span_tree=True
        )
        cluster_labels = clusterer.fit_predict(embeddings)

        for fact, cluster_id in zip(facts_to_cluster, cluster_labels):
            session.add(
                Alignment(
                    fact_id=fact.id,
                    cluster_id=int(cluster_id)
                )
            )

        session.commit()

    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


if __name__ == "__main__":
    cluster_facts()
