import pymssql

conn = pymssql.connect(
    server='db56530.public.databaseasp.net',
    port=1433,
    user='db56530',
    password='zT+6!3Jj9Ec%',
    database='db56530',
    timeout=60,
    login_timeout=30
)
cursor = conn.cursor()

with open('/tmp/migration.sql', 'r', encoding='utf-8') as f:
    sql = f.read()

# Split by GO statements (T-SQL batch separator)
batches = [b.strip() for b in sql.split('\nGO\n') if b.strip()]

print(f"Applying {len(batches)} SQL batches...")
for i, batch in enumerate(batches):
    try:
        cursor.execute(batch)
        conn.commit()
        # Show first line of each batch
        first_line = batch.split('\n')[0][:80]
        print(f"  [{i+1}/{len(batches)}] OK: {first_line}")
    except Exception as e:
        conn.rollback()
        print(f"  [{i+1}/{len(batches)}] SKIP/ERROR: {str(e)[:120]}")

# Verify
cursor.execute("SELECT name FROM sys.tables ORDER BY name")
tables = [r[0] for r in cursor.fetchall()]
print(f"\nTables in DB ({len(tables)}): {tables}")

cursor.execute("SELECT MigrationId FROM [__EFMigrationsHistory]")
history = [r[0] for r in cursor.fetchall()]
print(f"Migrations applied: {history}")

conn.close()
print("\nDone.")
