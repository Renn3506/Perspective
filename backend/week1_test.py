import requests
import psycopg2
from config import(
    NEWS_API_KEY,
    DB_HOST,
    DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
)

# Article fetch 
url = "https://newsapi.org/v2/top-headlines?language=en&pageSize=1"
response = requests.get(url, headers={"Authorization": NEWS_API_KEY})
data = response.json()["articles"][0]

title = data['title']
body = data['content']
published_at = data['publishedAt']
#author = data['author']
#source = data['source']['name']

# Database Connection
conn = psycopg2.connect(
    host=DB_HOST,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    port=DB_PORT
)

cur = conn.cursor() 

# Table Creation 
cur.execute(""" 
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title TEXT,
    body TEXT,
    published_at TIMESTAMP
)
""")

# Insert Article
cur.execute("""
    INSERT INTO articles (title, body, published_at)
    VALUES (%s, %s, %s) 
""", (title, body, published_at))

conn.commit()
cur.close()
conn.close()

print("Article inserted successfully.")