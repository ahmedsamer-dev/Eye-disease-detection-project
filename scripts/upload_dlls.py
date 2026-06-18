import paramiko
import os

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'
PUBLISH_DIR = 'Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish'

# Only upload the changed files - DLLs + config
CRITICAL_FILES = [
    'EyeDiseaseAI.API.dll',
    'EyeDiseaseAI.API.pdb',
    'EyeDiseaseAI.API.runtimeconfig.json',
    'EyeDiseaseAI.API.deps.json',
    'EyeDiseaseAI.Infrastructure.dll',
    'EyeDiseaseAI.Infrastructure.pdb',
    'EyeDiseaseAI.Application.dll',
    'EyeDiseaseAI.Application.pdb',
    'EyeDiseaseAI.Domain.dll',
    'EyeDiseaseAI.Domain.pdb',
    'web.config',
    'appsettings.json',
    'appsettings.Development.json',
]

print(f"Connecting via SFTP to {SFTP_HOST}:{SFTP_PORT} ...")
transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

uploaded = 0
for filename in CRITICAL_FILES:
    local = os.path.join(PUBLISH_DIR, filename)
    remote = f'/wwwroot/{filename}'
    if os.path.exists(local):
        try:
            sftp.put(local, remote)
            print(f"  [OK] {filename}")
            uploaded += 1
        except Exception as e:
            print(f"  [FAIL] {filename}: {e}")
    else:
        print(f"  [SKIP] {filename} (not found locally)")

sftp.close()
transport.close()
print(f"\nDone. {uploaded} files uploaded.")
print("IIS will auto-recycle the app pool due to DLL change.")
