import paramiko
import pymssql

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'

print("=== SFTP: Server file state ===")
transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

# Check web.config
try:
    with sftp.file('/wwwroot/web.config', 'r') as f:
        print("web.config content:\n" + f.read().decode('utf-8', errors='replace'))
except Exception as e:
    print(f"web.config error: {e}")

# List newest logs
try:
    logs = sorted(sftp.listdir('/wwwroot/logs'))
    print(f"\nAll log files ({len(logs)} total):")
    for log in logs[-5:]:  # show last 5
        print(f"  {log}")
        try:
            with sftp.file(f'/wwwroot/logs/{log}', 'r') as f:
                content = f.read(5000).decode('utf-8', errors='replace').strip()
                if content:
                    print(f"  >>> {content[:2000]}")
                else:
                    print(f"  >>> (empty)")
        except Exception as e:
            print(f"  >>> error: {e}")
except Exception as e:
    print(f"Logs error: {e}")

sftp.close()
transport.close()

print("\n=== MSSQL: Tables ===")
try:
    conn = pymssql.connect(
        server='db56530.public.databaseasp.net',
        port=1433,
        user='db56530',
        password='zT+6!3Jj9Ec%',
        database='db56530',
        timeout=20,
        login_timeout=20
    )
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sys.tables ORDER BY name")
    rows = cursor.fetchall()
    print(f"Tables: {[r[0] for r in rows]}")
    conn.close()
except Exception as e:
    print(f"DB error: {e}")
