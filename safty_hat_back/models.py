from exts import db

class Manager(db.Model):
    __tablename__ = 'manager'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    manager_id = db.Column(db.Integer, unique=True, nullable=False)
    manager_name = db.Column(db.String(20), nullable=False)
    manager_pwd = db.Column(db.String(20), nullable=False)


class Worker(db.Model):
    __tablename__ = 'worker'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    worker_id = db.Column(db.Integer, unique=True, nullable=False)
    worker_name = db.Column(db.String(50))
    worker_age = db.Column(db.Integer)
    worker_sex = db.Column(db.String(10))
    position = db.Column(db.String(100))
    worktime = db.Column(db.Integer)
    email = db.Column(db.String(255))
    hometowm = db.Column(db.String(255))
    avter = db.Column(db.String(255))

class Award(db.Model):
    __tablename__ = 'award'
    award_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    worker_id = db.Column(db.Integer, unique=True, nullable=False)
    unwear_times = db.Column(db.DateTime, nullable=False)
    fine = db.Column(db.Integer, nullable=False)

class Pictrue(db.Model):
    __tablename__ = 'pictrue'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_src = db.Column(db.String)
