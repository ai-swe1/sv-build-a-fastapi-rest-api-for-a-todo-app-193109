from models import Todo
from sqlalchemy import create_engine, Index
engine = create_engine('sqlite:///database.db')
Index('ix_todos_title', Todo.__table__.c.title).create(engine)