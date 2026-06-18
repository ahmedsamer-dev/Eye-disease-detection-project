import paramiko
import os
import sys

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'
LOCAL_DIR = 'Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish'
REMOTE_DIR = '/wwwroot'

uploaded = 0
failed = 0

def ensure_remote_dir(sftp, remote_path):
    parts = remote_path.split('/')
    current = ''
    for part in parts:
        if not part:
            current = '/'
            continue
        current = current.rstrip('/') + '/' + part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            try:
                sftp.mkdir(current)
            except Exception:
                pass

def upload_dir(sftp, local_path, remote_path):
    global uploaded, failed
    ensure_remote_dir(sftp, remote_path)

    for item in sorted(os.listdir(local_path)):
        local_item = os.path.join(local_path, item)
        remote_item = remote_path.rstrip('/') + '/' + item

        if os.path.isdir(local_item):
            upload_dir(sftp, local_item, remote_item)
        else:
            try:
                sftp.put(local_item, remote_item)
                uploaded += 1
                print(f"  [OK] {remote_item}")
            except Exception as e:
                failed += 1
                print(f"  [FAIL] {remote_item}: {e}")

print(f"Connecting via SFTP to {SFTP_HOST}:{SFTP_PORT} ...")
transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

print(f"Connected. Remote root contents:")
for item in sftp.listdir(REMOTE_DIR):
    print(f"  {item}")

print(f"\nUploading {LOCAL_DIR} -> {REMOTE_DIR} ...")
upload_dir(sftp, LOCAL_DIR, REMOTE_DIR)

sftp.close()
transport.close()

print(f"\n{'='*50}")
print(f"Upload complete: {uploaded} files uploaded, {failed} failed.")
print(f"{'='*50}")
