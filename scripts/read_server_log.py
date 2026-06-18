import paramiko

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'

transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

# List log files
try:
    logs = sftp.listdir('/wwwroot/logs')
    print("Log files:", logs)
    for log in logs:
        path = f'/wwwroot/logs/{log}'
        try:
            with sftp.file(path, 'r') as f:
                content = f.read(10000).decode('utf-8', errors='replace')
                print(f"\n=== {log} ===")
                print(content[-5000:] if len(content) > 5000 else content)
        except Exception as e:
            print(f"  Could not read {log}: {e}")
except Exception as e:
    print(f"Could not list logs: {e}")

sftp.close()
transport.close()
