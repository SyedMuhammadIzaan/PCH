"""
Pakistan Cloth House - Flask Database Configuration
Connects to Cloud SQL PostgreSQL or fallback SQLite
"""

import os

def get_database_uri():
    # If explicitly provided via DATABASE_URL
    if os.getenv("DATABASE_URL"):
        url = os.getenv("DATABASE_URL")
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    # If Cloud SQL environment variables are set
    sql_user = os.getenv("SQL_USER")
    sql_pass = os.getenv("SQL_PASSWORD", "")
    sql_host = os.getenv("SQL_HOST")
    sql_name = os.getenv("SQL_DB_NAME")

    if sql_user and sql_host and sql_name:
        if sql_pass:
            return f"postgresql://{sql_user}:{sql_pass}@{sql_host}:5432/{sql_name}"
        return f"postgresql://{sql_user}@{sql_host}:5432/{sql_name}"

    # Fallback to local SQLite file
    basedir = os.path.abspath(os.path.dirname(__file__))
    return "sqlite:///" + os.path.join(basedir, "pch_store.db")
