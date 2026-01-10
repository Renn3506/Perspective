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
├── alembic.ini
├── backend
│   ├── __init__.py
│   ├── alembic                         # Alembic migration environment
│   │   ├── versions                    # Migration scripts
│   │   │   └── <migration_id>_initial_migration.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── common                          # Shared code (DB models, queue utilities)
│   │   ├── __init__.py
│   │   ├── db
│   │   │   ├── __init__.py
│   │   │   └── models.py
│   │   ├── json_encoder.py
│   │   └── queue.py
│   ├── ingestion_service               # Service for fetching and queuing articles
│   │   ├── Dockerfile
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── newsapi.py
│   │   ├── run.py
│   │   └── sources.py
│   ├── processing                      # Service for background processing tasks
│   │   ├── Dockerfile                  # Dockerfile for the processing service
│   │   ├── __init__.py
│   │   ├── cluster.py                  # Logic for fact clustering
│   │   └── run.py                      # Entrypoint for the processing service
│   ├── requirements.txt                # Pinned Python dependencies
│   ├── synthesis                       # Placeholder for future synthesis logic
│   └── synthesis_service               # Service for consuming articles and initial DB storage
│       ├── Dockerfile
│       ├── __init__.py
│       └── run.py
├── docker
│   └── docker-compose.yml              # Docker Compose setup
├── docs
│   ├── architecture.md
│   └── ethics.md
└── frontend                            # Placeholder for future frontend
```

---

## Getting Started

### Prerequisites

- Python 3.12 or later
- Docker Desktop
- News API key (e.g., from [NewsAPI.org](https://newsapi.org))

### 1. Start Docker Services

From the project root:
```bash
docker-compose -f docker/docker-compose.yml up --build -d
```
This will build and start the PostgreSQL database, Redis, the ingestion service, the synthesis service, and the processing service.

### 2. Set up the Environment (for local development/Alembic)

1.  **Create and activate a virtual environment:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    ```
2.  **Install Python dependencies:**
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

From the project root, apply the Alembic migrations to set up the database schema:
```bash
source .venv/bin/activate # Activate virtual environment if not already active
python -m alembic -c alembic.ini upgrade head
```
This will create tables for articles, sources, facts, and alignments in your PostgreSQL database.

### 4. Monitor the Ingestion and Synthesis

The `ingestion_service` automatically fetches articles and publishes them to Redis, and the `synthesis_service` consumes these articles and stores them in the database. You can view the logs of all services:
```bash
docker-compose -f docker/docker-compose.yml logs -f
```

### 5. Verify Data Ingestion (Optional)

You can connect to the PostgreSQL database container and inspect the tables:
```bash
docker exec -it perspective_postgres psql -U perspective_user -d perspective_db
```
Then, inside the `psql` prompt:
```sql
SELECT id, title, url, published_at, source_id FROM article LIMIT 5;
SELECT id, name, url FROM source LIMIT 5;
```

---

## Project State and Roadmap

The project is currently in the early stages of development. Here is a summary of the current state and the objectives for the next phase.

### Current State (Week 3 Complete)
- Multi-source article ingestion is implemented and processes articles through a Redis queue.
- Content is normalised into a unified data model and stored in PostgreSQL.
- Basic fact extraction is functional.
- Source metadata (publisher, date, region, political leaning where available) is attached.
- **Fact alignment and clustering**: A `processing_service` has been implemented to perform fact clustering. It uses `sentence-transformers` to generate semantic embeddings for facts and `HDBSCAN` to group similar facts together. The cluster assignments are stored in the `alignment` table.

### Next Phase Objectives (Week 4+)
The next phase focuses on depth, reliability, and rigor:

1. **Omission detection**: Identify facts present in some sources but absent in others.
2. **Fact vs interpretation separation**: Classify sentences into factual, interpretive, or opinionated categories.
3. **Transparent article generation**: Produce a neutral, composite article using only verified facts.
4. **Bias and framing analysis**: Provide a separate explanatory section detailing framing differences, language choices, and omission patterns.
5. **Evaluation and critique**: Identify weaknesses or ambiguity in the system’s own outputs.
