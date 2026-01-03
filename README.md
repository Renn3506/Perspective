# News Aggregator & Synthesis Project

## Overview

This project is currently a prototype system that gathers news from multiple sources around the world, organizes articles by topics, and eventually uses AI to generate objective, easy-to-read summaries.  

The goal of **Week 1** is to set up a working pipeline that:

1. Runs a PostgreSQL database in Docker
2. Fetches a single article from a news API
3. Stores the article in the database

Future weeks will expand this to:

- Ingest multiple sources (RSS and APIs)
- Detect duplicate stories and cluster them
- Group clusters into high-level topics
- Generate AI-based summaries
- Provide a frontend to view summaries and source transparency

---

## Repo Structure

news-synthesis/
├── backend/
│ ├── week1_test.py # Week 1: fetch and insert article
│ ├── requirements.txt
│ ├── config.py # DB/API configurations
│ ├── utils/ # helper functions
│ │ └── init.py
│ ├── ingestion/ # news ingestion scripts
│ │ └── init.py
│ ├── processing/ # clustering / embeddings (future)
│ │ └── init.py
│ ├── synthesis/ # AI summarization (future)
│ │ └── init.py
│ └── db/ # database scripts / migrations
│ └── migrations/
├── frontend/ # Next.js app
├── docker/
│ └── docker-compose.yml # PostgreSQL container
├── docs/
│ ├── architecture.md
│ └── ethics.md
├── .gitignore
├── README.md
└── LICENSE

---

## Getting Started

### Prerequisites (Will change as project grows)

- Python 3.10 or later
- Docker Desktop
- VS Code (recommended)
- News API key (e.g., from [NewsAPI.org](https://newsapi.org))

---

### Step 1: Start PostgreSQL in Docker

From the `docker/` folder:

docker compose up -d

#### Check it’s running:

docker ps

#### Step 2: Install Python Dependencies

From the backend/ folder:

pip install -r requirements.txt

#### Step 3: Configure API Key

Edit backend/config.py:

NEWS_API_KEY = "your_api_key_here"
DB_HOST = "localhost"
DB_NAME = "news_db"
DB_USER = "news_user"
DB_PASS = "news_pass"
DB_PORT = 5432


#### Step 4: Run Week 1 Script

python week1_test.py

You should see:

Connected and table created.
Article inserted.

#### Step 5: Verify in Database

docker exec -it news_postgres psql -U news_user -d news_db
Then inside PostgreSQL:

SELECT * FROM articles;
You should see your inserted article.

### Weekly Roadmap

Week	Goal / Deliverable
1	Database + single news API fetch working
2	Ingestion repeatable, multiple articles inserted automatically
3-4	Add more sources (RSS, APIs), implement simple de-duplication
5-6	Story clustering logic, first topic groups
7-8	AI synthesis pipeline for one topic
9-10	FastAPI backend + simple frontend (Next.js)
11-12	Code polish, bias indicators, documentation, ethical transparency

Each week builds on the previous, gradually increasing complexity while keeping systems clean and reproducible.