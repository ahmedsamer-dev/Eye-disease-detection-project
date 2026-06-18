import paramiko

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'

transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

files_to_upload = [
    ('Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/web.config', '/wwwroot/web.config'),
    ('Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish/appsettings.json', '/wwwroot/appsettings.json'),
]

for local, remote in files_to_upload:
    sftp.put(local, remote)
    print(f"  [OK] {remote}")

# Ensure logs directory exists
try:
    sftp.mkdir('/wwwroot/logs')
    print("  [OK] Created /wwwroot/logs dir")
except:
    print("  [OK] /wwwroot/logs already exists")

sftp.close()
transport.close()
print("Done.")
