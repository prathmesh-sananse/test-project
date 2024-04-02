from flask import Flask, render_template, request
from collections import defaultdict
from neo4j import GraphDatabase, basic_auth

app = Flask(__name__)

# Establish connection to Neo4j database
driver = GraphDatabase.driver(uri='neo4j+s://8cf36790.databases.neo4j.io', auth=basic_auth("neo4j", "F5r1MYLjlnJJu0Jcthk9FO9PE4agbEMjMDhbDxQ7DBY"))
session = driver.session()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        search_term = request.form.get('search_term')
        # Constructing dynamic Cypher query based on user input
        query = """
        MATCH (b:Blog)-[:BELONGS_TO]->(category:Category)
        MATCH (b)-[:BELONGS_TO_REGION]->(region:Region)
        MATCH (b)-[:HAS_RELEVANCE]->(relevance:Relevance)
        MATCH (b)-[:TARGETS]->(target:TargetAudience)
        WHERE b.name CONTAINS $search_term OR category.name CONTAINS $search_term OR region.name CONTAINS $search_term OR relevance.name CONTAINS $search_term OR target.name CONTAINS $search_term
        RETURN b.name AS name, b.url AS url, category.name AS category, 
               b.publish_date AS publish_date, b.expire_date AS expire_date, 
               region.name AS region, relevance.name AS relevance, 
               collect(target.name) AS target_audience
        """
        data = session.run(query, search_term=search_term)

        # Convert Neo4j result to a list of dictionaries
        blogs = []
        for record in data:
            blog = {
                "name": record["name"],
                "url": record["url"],
                "publish_date": record["publish_date"],
                "expire_date": record["expire_date"],
                "category": record["category"],
                "region": record["region"],
                "relevance": record["relevance"],
                "target_audience": record["target_audience"]
            }

            # If target audience has multiple values, join them into a comma-separated string
            if isinstance(blog["target_audience"], list) and len(blog["target_audience"]) > 1:
                blog["target_audience"] = ", ".join(blog["target_audience"])

            blogs.append(blog)

        return render_template('index.html', blogs=blogs)
    else:
        # If no search term is provided, display all blogs
        query = """
        MATCH (b:Blog)-[:BELONGS_TO]->(category:Category)
        MATCH (b)-[:BELONGS_TO_REGION]->(region:Region)
        MATCH (b)-[:HAS_RELEVANCE]->(relevance:Relevance)
        MATCH (b)-[:TARGETS]->(target:TargetAudience)
        RETURN b.name AS name, b.url AS url, category.name AS category, b.publish_date AS publish_date,
                b.expire_date AS expire_date, region.name AS region, relevance.name AS relevance,
                collect(target.name) AS target_audience
        """
        data = session.run(query)

        # Convert Neo4j result to a list of dictionaries
        blogs = []
        for record in data:
            blog = {
                "name": record["name"],
                "url": record["url"],
                "publish_date": record["publish_date"],
                "expire_date": record["expire_date"],
                "category": record["category"],
                "region": record["region"],
                "relevance": record["relevance"],
                "target_audience": record["target_audience"]
            }

            # If target audience has multiple values, join them into a comma-separated string
            if isinstance(blog["target_audience"], list) and len(blog["target_audience"]) > 1:
                blog["target_audience"] = ", ".join(blog["target_audience"])

            blogs.append(blog)

        return render_template('index.html', blogs=blogs)

if __name__ == '__main__':
  app.run(debug=True)