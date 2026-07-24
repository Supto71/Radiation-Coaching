import sqlite3

conn = sqlite3.connect('sql_app.db')
print(conn.execute('SELECT student_uid FROM students WHERE student_uid = "10000"').fetchall())
