import sqlite3

def add_columns():
    db_paths = ["sql_app.db", "coaching.db", "radiation.db", "database.db"]
    for db_path in db_paths:
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if fee_records table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='fee_records'")
            if cursor.fetchone():
                try:
                    cursor.execute("ALTER TABLE fee_records ADD COLUMN due_amount FLOAT DEFAULT 0.0")
                    print(f"Added due_amount to {db_path}")
                except sqlite3.OperationalError as e:
                    print(f"due_amount may already exist in {db_path}: {e}")
                    
                try:
                    cursor.execute("ALTER TABLE fee_records ADD COLUMN paid_amount FLOAT DEFAULT 0.0")
                    print(f"Added paid_amount to {db_path}")
                except sqlite3.OperationalError as e:
                    print(f"paid_amount may already exist in {db_path}: {e}")
            
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error processing {db_path}: {e}")

if __name__ == "__main__":
    add_columns()
