from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from app import app
from exts import db
manager = Manager(app)  #实列化一个manager对象

Migrate(app, db)

manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()