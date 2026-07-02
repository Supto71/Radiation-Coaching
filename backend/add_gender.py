import sqlite3
import os

db_path = 'sql_app.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    try:
        conn.execute("ALTER TABLE students ADD COLUMN gender VARCHAR DEFAULT 'ছেলে'")
        conn.commit()
        print('Database updated successfully')
    except Exception as e:
        print('Error:', e)
    finally:
        conn.close()
