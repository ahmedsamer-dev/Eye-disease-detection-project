import paramiko
import time

SFTP_HOST = 'site74972.siteasp.net'
SFTP_PORT = 22
SFTP_USER = 'site74972'
SFTP_PASS = '2c#Zy%X5M3?q'

transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
transport.connect(username=SFTP_USER, password=SFTP_PASS)
sftp = paramiko.SFTPClient.from_transport(transport)

# Read web.config
with sftp.file('/wwwroot/web.config', 'r') as f:
    wc = f.read().decode('utf-8')

# Bump the comment to force IIS recycle
import re
wc = re.sub(r'<!-- recycled\d* -->', '', wc)
wc = wc.replace('</configuration>', '<!-- r1 -->\n</configuration>')

with sftp.file('/wwwroot/web.config', 'w') as f:
    f.write(wc.encode('utf-8'))

print("web.config touched - IIS app pool will recycle")
sftp.close()
transport.close()
