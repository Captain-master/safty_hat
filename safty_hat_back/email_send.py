from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart

import smtplib

from_addr = '1319457708@qq.com'
password = 'vnwalkfpqrfligje'
smtp_server = 'smtp.qq.com'

def _format_addr(s):
    name, addr = parseaddr(s)
    return formataddr((Header(name, 'utf-8').encode(), addr))

def email_send(to_addr):
    msg = MIMEMultipart()
    msg['From'] = _format_addr('安全帽系统管理员 <%s>' % from_addr)
    msg['To'] = _format_addr('安全帽系统员工 <%s>' % to_addr)
    msg['Subject'] = Header(' 我们检测到您未佩戴安全帽', 'utf-8').encode()
    msg.attach(MIMEText('警告，您未佩戴安全帽,请佩戴安全帽进入生产车间', 'plain', 'utf-8'))

    # 添加附件就是加上一个MIMEBase，从本地读取一个图片:
    with open('images/pictures_saved_fine/2020-05-29-03-16-02-Alarm.jpg', 'rb') as f:
        # 设置附件的MIME和文件名，这里是png类型:
        mime = MIMEBase('image', 'jpg', filename='test.jpg')
        # 加上必要的头信息:
        mime.add_header('Content-Disposition', 'attachment', filename='test.jpg')
        mime.add_header('Content-ID', '<0>')
        mime.add_header('X-Attachment-Id', '0')
        # 把附件的内容读进来:
        mime.set_payload(f.read())
        # 用Base64编码:
        encoders.encode_base64(mime)
        # 添加到MIMEMultipart:
        msg.attach(mime)

    server = smtplib.SMTP(smtp_server, 25)
    server.starttls()
    server.set_debuglevel(1)
    server.login(from_addr, password)
    server.sendmail(from_addr, [to_addr], msg.as_string())
    server.quit()

if __name__ =='__main__':
    to_addr = '384750610@qq.com'
    email_send(to_addr=to_addr)




