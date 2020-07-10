#全局数据
from flask import Flask
app = Flask(__name__)
import config
from flask_sqlalchemy import SQLAlchemy

app.config.from_object(config)
db = SQLAlchemy(app)