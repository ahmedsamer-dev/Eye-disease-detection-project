import ftplib
import os
import sys

FTP_HOST = 'site74972.siteasp.net'
FTP_PORT = 21
FTP_USER = 'site74972'
FTP_PASS = '2c#Zy%X5M3?q'
LOCAL_DIR = 'Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/publish'
REMOTE_DIR = '/wwwroot'

def upload_dir(ftp, local_path, remote_path):
    try:
        ftp.mkd(remote_path)
        print(f"Created dir: {remote_path}")
    except ftplib.error_perm:
        pass

    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        remote_item = remote_path + '/' + item

        if os.path.isdir(local_item):
            upload_dir(ftp, local_item, remote_item)
        else:
            try:
                with open(local_item, 'rb') as f:
                    ftp.storbinary(f'STOR {remote_item}', f)
                print(f"  Uploaded: {remote_item}")
            except Exception as e:
                print(f"  FAILED {remote_item}: {e}")

print(f"Connecting to FTP: {FTP_HOST}:{FTP_PORT}")
try:
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print(f"Logged in. Server: {ftp.getwelcome()}")

    print(f"\nListing FTP root:")
    ftp.retrlines('LIST')

    print(f"\nUploading from {LOCAL_DIR} to {REMOTE_DIR} ...")
    upload_dir(ftp, LOCAL_DIR, REMOTE_DIR)

    print("\nUpload complete.")
    ftp.quit()
except Exception as e:
    print(f"FTP ERROR: {e}")
    sys.exit(1)
