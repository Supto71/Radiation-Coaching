import sqlite3
import json
import os

DB_PATH = "sql_app.db"

def migrate():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} does not exist.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='fee_records'")
    if not cursor.fetchone():
        print("Table fee_records does not exist. Migration skipped.")
        return

    # Check if we already migrated (check if status column exists)
    cursor.execute("PRAGMA table_info(fee_records)")
    columns = [info[1] for info in cursor.fetchall()]
    if 'status' in columns:
        print("Migration already applied.")
        return

    print("Migrating fee_records...")
    
    # 1. Rename existing table
    cursor.execute("ALTER TABLE fee_records RENAME TO fee_records_old")
    
    # 2. Create new table
    cursor.execute("""
    CREATE TABLE fee_records (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount FLOAT,
        month VARCHAR,
        status VARCHAR DEFAULT 'Due',
        paid_amount FLOAT DEFAULT 0.0,
        payment_history VARCHAR DEFAULT '[]',
        FOREIGN KEY(student_id) REFERENCES students (id)
    )
    """)
    
    # 3. Copy data
    cursor.execute("SELECT id, student_id, amount, month, is_paid, payment_date FROM fee_records_old")
    rows = cursor.fetchall()
    
    for row in rows:
        r_id, student_id, amount, month, is_paid, payment_date = row
        status = "Paid" if is_paid else "Due"
        paid_amount = amount if is_paid else 0.0
        
        history = []
        if is_paid and payment_date:
            history.append({"date": payment_date, "amount": amount})
            
        history_str = json.dumps(history)
        
        cursor.execute("""
            INSERT INTO fee_records (id, student_id, amount, month, status, paid_amount, payment_history)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (r_id, student_id, amount, month, status, paid_amount, history_str))
        
    # 4. Drop old table
    cursor.execute("DROP TABLE fee_records_old")
    
    # Create indexes if necessary
    cursor.execute("CREATE INDEX ix_fee_records_id ON fee_records (id)")
    
    # Commit changes
    conn.commit()
    conn.close()
    print("Migration completed successfully.")

if __name__ == "__main__":
    migrate()
