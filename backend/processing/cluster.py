import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import hdbscan
import numpy as np
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from backend.common.db.models import Fact, Alignment
from sqlalchemy.orm import subqueryload

def cluster_facts():
    """
    Fetches facts from the database that have not been clustered yet,
    generates sentence embeddings, clusters them using HDBSCAN,
    and stores the cluster assignments in the Alignment table.
    """
    load_dotenv()  # Load environment variables from .env file

    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_HOST = os.getenv("DB_HOST", "db") # Default to 'db' for docker-compose
    DB_NAME = os.getenv("DB_NAME")

    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:5432/{DB_NAME}"

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 1. Fetch facts that haven't been aligned yet.
        facts_to_cluster = session.query(Fact).outerjoin(Alignment).filter(Alignment.id == None).all()

        if not facts_to_cluster:
            print("No new facts to cluster.")
            return

        fact_texts = [fact.text for fact in facts_to_cluster]

        # 2. Generate sentence embeddings.
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = model.encode(fact_texts, convert_to_numpy=True)

        # 3. Cluster the embeddings using HDBSCAN.
        clusterer = hdbscan.HDBSCAN(min_cluster_size=2, gen_min_span_tree=True)
        cluster_labels = clusterer.fit_predict(embeddings)

        # 4. Create new Alignment records.
        for fact, cluster_id in zip(facts_to_cluster, cluster_labels):
            # -1 is considered noise by HDBSCAN. We can handle this as a special case.
            # For now, we'll create an alignment record for all facts.
            alignment = Alignment(fact_id=fact.id, cluster_id=str(cluster_id))
            session.add(alignment)

        session.commit()
        print(f"Successfully clustered {len(facts_to_cluster)} facts into {len(set(cluster_labels))} clusters.")

    except Exception as e:
        print(f"An error occurred during clustering: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    # This allows running the clustering process directly for testing.
    cluster_facts()
