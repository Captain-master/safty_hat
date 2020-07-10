#数据库连接配置

USERNAME = 'root'
PASSWORD = '17872321501qQ#'
HOST = '127.0.0.1'
PORT = '3306'
DATABASE = 'safty_hat'

SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://{}:{}@{}:{}/{}?charset-utf8'.format(
    USERNAME,
    PASSWORD,
    HOST,
    PORT,
    DATABASE
)

SQLALCHEMY_TRACK_MODIFICATIONS = True
