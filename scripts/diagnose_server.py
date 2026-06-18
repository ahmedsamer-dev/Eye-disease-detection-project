import paramiko
import time

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'

transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

print("=== FILES IN /wwwroot/ ===")
for attr in sftp.listdir_attr('/wwwroot'):
    import stat
    ftype = 'd' if stat.S_ISDIR(attr.st_mode) else 'f'
    print(f"  [{ftype}] {attr.filename}  ({attr.st_size} bytes)")

print("\n=== CURRENT web.config ===")
with sftp.file('/wwwroot/web.config', 'r') as f:
    print(f.read().decode('utf-8'))

print("\n=== LOG FILES ===")
try:
    logs = sftp.listdir('/wwwroot/logs')
    for log in sorted(logs):
        attr = sftp.stat(f'/wwwroot/logs/{log}')
        print(f"  {log}  ({attr.st_size} bytes)")
        # Print last 20 lines of each log
        with sftp.file(f'/wwwroot/logs/{log}', 'r') as f:
            content = f.read().decode('utf-8', errors='replace')
            lines = content.strip().split('\n')
            for line in lines[-20:]:
                print(f"    {line}")
        print()
except Exception as e:
    print(f"  Error reading logs: {e}")

sftp.close()
transport.close()
