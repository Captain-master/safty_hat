import base64
from flask import Blueprint, request, jsonify
from models import Worker
from exts import db
from email_send import email_send
pro = Blueprint('pro', __name__)

@pro.route('/send_email',methods=["POST"])
def send_email():
    json_data = request.form.to_dict()
    print(json_data)
    data = {
        "code": 0
    }
    if json_data["action"] == '6':
        worker_email = ''.join(db.session.query(Worker.email).filter(Worker.worker_id == json_data["worker_id"]).first())
        #worker_emil为邮箱
        print(worker_email)
        email_send(worker_email)
        data["code"] = 1
    return jsonify(data)

@pro.route('/add_workers', methods=['POST'])
def add():
    json_data = request.form.to_dict()
    data = {
        "code": 0
    }
    if json_data["action"] == '1':
        worker = Worker(worker_id=json_data["worker_id"],
        worker_name=json_data["worker_name"],
        worker_age=json_data["age"],
        worker_sex=json_data["sex"],
        position=json_data["position"],
        worktime=json_data["worktime"],
        email=json_data["email"],
        hometowm=json_data["hometown"],
        avter=json_data["avater"])
        db.session.add(worker)
        db.session.commit()
        path = 'persons_img/' + json_data["avater"]
        imgFile = json_data["imgFile"][23:]
        print(imgFile)
        temp = base64.b64decode(imgFile)
        with open(path, "wb") as fp:
            fp.write(temp)
        data["code"] = 1
    return jsonify(data)

@pro.route('/all_workers',methods=["POST"])
def all_workers():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 0,
        "data": []
    }
    if json_data["action"] == '2':
        result_list = Worker.query.filter().all()
        for i in result_list:
            i.__dict__.pop('_sa_instance_state')
            data["data"].append(i.__dict__)
        data["success"] = True
        data["code"] = 1
    return jsonify(data)

@pro.route('/d_workers', methods=["POST"])
def delete():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 0
    }
    if json_data["action"] == '3':
        worker = Worker.query.filter(Worker.worker_id == json_data["worker_id"]).first()
        db.session.delete(worker)
        db.session.commit()
        data["success"] = True
        data["code"] = 1
    return jsonify(data)

@pro.route('r_workers',methods=["POST"])
def refactor():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 0
    }
    if json_data["action"] == '4':
        worker = Worker.query.filter(Worker.worker_id == json_data["worker_id"]).first()
        print(worker)
        worker.worker_age = json_data["age"]
        worker.worker_sex = json_data["sex"]
        worker.worker_name = json_data["worker_name"]
        worker.avter = json_data["avater"]
        worker.email = json_data["email"]
        worker.position = json_data["position"]
        worker.hometowm = json_data["hometown"]
        worker.worktime = json_data["worktime"]
        db.session.merge(worker)
        db.session.commit()
        data["success"] = True
        data["code"] = 1
    elif json_data["action"] == '5':
        data["success"] = True
        data["code"] = 1
    return jsonify(data)

@pro.route('/search_workers',methods=["POST"])
def search_workers():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 0
    }
    if json_data["action"] == 5:
        data["data"] = Worker.query.filter(Worker.worker_id==json_data["worker_id"]).first()
        data["success"] = True
        data["code"] = 1
    return jsonify(data)