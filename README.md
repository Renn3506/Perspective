# Perspective: A global news aggregation and synthesis system

## Overview

This project is a system that ingests news articles from multiple publishers covering the same or related events. Each article is normalised into a shared schema, parsed, and analysed to extract factual claims, contextual details, and metadata.

The system separates:
- verifiable facts
- interpretations or analytical statements
- opinionated or value-laden language

Extracted facts are aligned and compared across sources to identify:
- consensus facts (widely shared)
- selectively included facts
- omitted facts
- framing differences
- linguistic bias
- structural bias (headline choice, ordering, emphasis, sourcing)

The system then enters a synthesis phase. This phase uses an AI model or other LLM as a controlled generation component, not as a source of truth. The primary goal is to improve media literacy and critical reading skills by helping users understand how narratives are shaped, how bias appears through omission, emphasis, and language, and how different outlets construct meaning from the same underlying events.

---

## Repo Structure
```
.
├── .env.example
├── .gitignore
├── README.md
├── backend
│   ├── config.py
│   ├── db
│   │   ├── migrations
│   │   │   └── 0001_add_url_to_article.py
│   │   └── run_migrations.py
│   ├── ingestion
│   │   ├── base.py
│   │   ├── newsapi.py
│   │   ├── run.py
│   │   └── sources.py
│   ├── processing
│   ├── requirements.in
│   ├── requirements.txt
│   └── synthesis
├── docker
│   └── docker-compose.yml
├── docs
│   ├── architecture.md
│   └── ethics.md
└── frontend
```

---

## Getting Started

### Prerequisites

- Python 3.10 or later
- Docker Desktop
- News API key (e.g., from [NewsAPI.org](https://newsapi.org))

### 1. Start PostgreSQL in Docker

From the `docker/` folder:
```bash
docker-compose up -d
```

### 2. Set up the Environment

1.  **Create a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Configure environment variables:**
    Create a `.env` file in the project root by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, edit the `.env` file to add your `NEWS_API_KEY` and any other custom settings.

### 3. Run Database Migrations

From the project root, run the migration script to set up the database schema:
```bash
python backend/db/run_migrations.py
```

### 4. Run the Ingestion Pipeline

To fetch and store news articles, run the ingestion script:
```bash
python backend/ingestion/run.py
```

### 5. Verify in Database

You can connect to the database to verify that the articles have been inserted:
```bash
docker exec -it perspective-db-1 psql -U perspective_user -d perspective_db
```
Then, inside PostgreSQL:
```sql
SELECT * FROM article;
```
*Note: The container name `perspective-db-1` might vary. Use `docker ps` to find the correct name of your PostgreSQL container.*

---

## Project State and Roadmap

The project is currently in the early stages of development. Here is a summary of the current state and the objectives for the next phase.

### Current State (Week 2 Complete)
- Multi-source article ingestion is implemented.
- Content is normalised into a unified data model.
- Basic fact extraction is functional.
- Source metadata (publisher, date, region, political leaning where available) is attached.
- Initial tone and framing analysis exists but is incomplete.

### Next Phase Objectives (Week 3+)
The next phase focuses on depth, reliability, and rigor:

1. **Fact alignment and clustering**: Deduplicate equivalent facts and group facts referring to the same real-world event.
2. **Omission detection**: Identify facts present in some sources but absent in others.
3. **Fact vs interpretation separation**: Classify sentences into factual, interpretive, or opinionated categories.
4. **Transparent article generation**: Produce a neutral, composite article using only verified facts.
5. **Bias and framing analysis**: Provide a separate explanatory section detailing framing differences, language choices, and omission patterns.
6. **Evaluation and critique**: Identify weaknesses or ambiguity in the system’s own outputs.