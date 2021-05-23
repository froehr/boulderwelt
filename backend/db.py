import os

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker

database_uri = os.getenv("DATABASE_URL")
if database_uri.startswith("postgres://"):
    database_uri = database_uri.replace("postgres://", "postgresql://", 1)

engine = create_engine(database_uri)

Session = scoped_session(sessionmaker(bind=engine))
