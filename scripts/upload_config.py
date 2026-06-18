import paramiko
import time

SFTP_HOST = "site74972.siteasp.net"
SFTP_PORT = 22
SFTP_USER = "site74972"
SFTP_PASS = "2c#Zy%X5M3?q"

transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

# Upload updated appsettings.json
sftp.put(
    "Hassan_EyeDiseaseAI-master/EyeDiseaseAI.API/appsettings.json",
    "/wwwroot/appsettings.json",
)
print("[OK] appsettings.json uploaded")

# Read web.config, add a harmless comment, re-upload to trigger IIS app pool recycle
with sftp.file("/wwwroot/web.config", "r") as f:
    wc = f.read().decode("utf-8")

# Toggle a comment to force recycle
if "<!-- recycled -->" in wc:
    wc = wc.replace("<!-- recycled -->", "<!-- recycled2 -->")
else:
    wc = wc.replace("</configuration>", "<!-- recycled -->\n</configuration>")

with sftp.file("/wwwroot/web.config", "w") as f:
    f.write(wc.encode("utf-8"))
print("[OK] web.config touched — IIS app pool will recycle")

sftp.close()
transport.close()
print("\nDone. App will reload with new CORS settings on next request.")
