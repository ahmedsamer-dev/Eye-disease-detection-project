import paramiko
import os
import time

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'
PUBLISH_DIR = 'Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish'

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

# Step 1: Create app_offline.htm to stop the IIS app pool
print("\nStep 1: Bringing app offline (app_offline.htm)...")
offline_content = b"<html><body><h1>Site is being updated. Please wait...</h1></body></html>"
with sftp.file('/wwwroot/app_offline.htm', 'wb') as f:
    f.write(offline_content)
print("  app_offline.htm created. Waiting 5s for IIS to shut down app pool...")
time.sleep(5)

# Step 2: Upload the DLLs
print("\nStep 2: Uploading DLLs...")
uploaded = 0
failed = 0
for filename in CRITICAL_FILES:
    if filename == 'web.config':
        continue  # upload web.config last
    local = os.path.join(PUBLISH_DIR, filename)
    remote = f'/wwwroot/{filename}'
    if os.path.exists(local):
        try:
            sftp.put(local, remote)
            print(f"  [OK] {filename}")
            uploaded += 1
        except Exception as e:
            print(f"  [FAIL] {filename}: {e}")
            failed += 1
    else:
        print(f"  [SKIP] {filename}")

# Upload web.config last
local_wc = os.path.join(PUBLISH_DIR, 'web.config')
try:
    sftp.put(local_wc, '/wwwroot/web.config')
    print(f"  [OK] web.config")
    uploaded += 1
except Exception as e:
    print(f"  [FAIL] web.config: {e}")

# Step 3: Remove app_offline.htm to bring the app back online
print("\nStep 3: Bringing app back online (removing app_offline.htm)...")
try:
    sftp.remove('/wwwroot/app_offline.htm')
    print("  app_offline.htm removed. App will restart on next request.")
except Exception as e:
    print(f"  Error removing app_offline.htm: {e}")

sftp.close()
transport.close()

print(f"\n{'='*50}")
print(f"Deployment complete: {uploaded} uploaded, {failed} failed.")
print(f"{'='*50}")
