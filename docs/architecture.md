# Architecture

The Perspective backend is designed as a service-oriented architecture (SOA) composed of several independent services that communicate via a message queue (Redis) and a shared database (PostgreSQL). This design allows for scalability, modularity, and resilience.

## Services

### 1. Ingestion Service (`ingestion_service`)

- **Purpose**: Fetches news articles from various external sources (e.g., NewsAPI).
- **Process**:
    1.  Periodically queries configured news APIs for new articles.
    2.  Normalizes the fetched articles into a common format.
    3.  Publishes the normalized articles as messages to a Redis queue (`article_queue`).

### 2. Synthesis Service (`synthesis_service`)

- **Purpose**: Consumes articles from the queue, performs initial processing, and stores them in the database.
- **Process**:
    1.  Listens for new article messages on the `article_queue`.
    2.  Performs initial analysis, such as basic fact extraction.
    3.  Saves the article, its source, and the extracted facts into the PostgreSQL database.

### 3. Processing Service (`processing_service`)

- **Purpose**: Performs computationally intensive background processing tasks on the data stored in the database. The primary task is fact alignment and clustering.
- **Process**:
    1.  Runs as a batch job, triggered manually or on a schedule.
    2.  Fetches facts from the database that have not yet been clustered.
    3.  **Embedding Generation**: For each fact, it generates a vector embedding using a pre-trained `sentence-transformers` model (`all-MiniLM-L6-v2`). These embeddings represent the semantic meaning of the facts.
    4.  **Clustering**: It uses the `HDBSCAN` algorithm to cluster the embeddings. HDBSCAN groups facts with similar semantic meaning into clusters.
    5.  **Storing Alignments**: The service stores the results in the `alignment` table, linking each fact to a cluster ID. Facts that do not belong to any cluster are marked as noise.

## Data Flow

1.  The **Ingestion Service** fetches articles and places them in the **Redis** queue.
2.  The **Synthesis Service** picks up articles from the queue, processes them, and stores them in the **PostgreSQL** database.
3.  The **Processing Service** runs independently, querying the **PostgreSQL** database for unclustered facts, performing the clustering, and writing the results back to the database.

---

This modular architecture allows each service to be developed, deployed, and scaled independently. For example, we can add more instances of the `ingestion_service` to handle more news sources, or we can add new processing services for different types of analysis without affecting the rest of the system.
