from email.mime.text import MIMEText
msg = MIMEText('hello, send by Python...', 'plain', 'utf-8')
from_addr = '1319457708@qq.com'
password = 'vnwalkfpqrfligje'
to_addr = '384750610@qq.com'
smtp_server = 'smtp.qq.com'

import smtplib
server = smtplib.SMTP(smtp_server, 25) # SMTP协议默认端口是25
server.set_debuglevel(1)
server.login(from_addr, password)
server.sendmail(from_addr, [to_addr], msg.as_string())
server.quit()