import pymssql

server = 'db56530.public.databaseasp.net'
port = 1433
user = 'db56530'
password = 'zT+6!3Jj9Ec%'
database = 'db56530'

print(f"Connecting to {server}...")
try:
    conn = pymssql.connect(
        server=server,
        port=port,
        user=user,
        password=password,
        database=database,
        timeout=30,
        login_timeout=30
    )
    cursor = conn.cursor()

    print("Connected. Fetching existing tables...")
    cursor.execute("SELECT name FROM sys.tables ORDER BY name")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"Found {len(tables)} tables: {tables}")

    if tables:
        print("Dropping all foreign key constraints...")
        cursor.execute("""
            DECLARE @sql NVARCHAR(MAX) = ''
            SELECT @sql += 'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
            FROM sys.foreign_keys
            EXEC sp_executesql @sql
        """)
        conn.commit()

        print("Dropping all tables...")
        for table in tables:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS [{table}]")
                conn.commit()
                print(f"  Dropped: {table}")
            except Exception as e:
                print(f"  Failed to drop {table}: {e}")

    print("Database cleared successfully.")
    conn.close()
except Exception as e:
    print(f"ERROR: {e}")
