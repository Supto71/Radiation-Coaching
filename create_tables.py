import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from app.db.database import engine, Base
from app.models.dashboard import Exam, Question

print("Creating new tables...")
Exam.__table__.create(engine, checkfirst=True)
Question.__table__.create(engine, checkfirst=True)
print("Tables created successfully.")
