from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Article(Base):
    __tablename__ = "article"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    body = Column(Text)
    url = Column(String, nullable=False, unique=True)
    published_at = Column(DateTime, nullable=False)
    source_id = Column(Integer, ForeignKey("source.id"), nullable=False)
    summary = Column(Text)
    tone = Column(String)
    tone_confidence = Column(Float)
    flesch_kincaid_grade = Column(Float)

    source = relationship("Source", back_populates="articles")
    facts = relationship("Fact", back_populates="article")


class Source(Base):
    __tablename__ = "source"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    url = Column(String, nullable=False)

    articles = relationship("Article", back_populates="source")


class Fact(Base):
    __tablename__ = "fact"

    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey("article.id"), nullable=False)
    text = Column(Text, nullable=False)
    source_text = Column(Text)
    confidence = Column(Integer, default=0)
    entities = Column(JSONB)
    relationships = Column(JSONB)
    metadata_ = Column(JSONB)

    article = relationship("Article", back_populates="facts")
    alignments = relationship("Alignment", back_populates="fact")


class Alignment(Base):
    __tablename__ = "alignment"

    id = Column(Integer, primary_key=True)
    fact_id = Column(Integer, ForeignKey("fact.id"), nullable=False)
    cluster_id = Column(String, nullable=False)

    fact = relationship("Fact", back_populates="alignments")
