from flask import Blueprint, jsonify, request
from exts import db
from models import Award, Worker
import os
import re
import base64
from models import Worker

reward = Blueprint('reward', __name__)

@reward.route('/search', methods=['POST'])
def search():
    json_data = request.form.to_dict()
    data = {
        "code": 0
    }
    if json_data["action"] == '1':
        data["code"] = 1
        data["data"] = db.session.query(Worker.worker_id,
                                        Worker.worker_name,
                                        Worker.position,
                                        Award.unwear_times,
                                        Award.fine).filter().all()
    return jsonify(data)

@reward.route('/history', methods=['POST'])
def history():
    json_data = request.form.to_dict()
    files = []
    if(json_data["action"] == '1'):
        root, dirs, files_name = list(os.walk('images/pictures_saved_fine'))[0]
        count = 0
        for i in files_name:
            files_time = re.findall('^.{10}', i)
            count = count + 1
            i = 'images/pictures_saved_fine/' + i
            img = open(i, 'rb')  # 读取图片文件
            try:
                images = base64.b64encode(img.read()).decode()  # 进行base64编码
                files.append({'image_src': images, 'image_saved_time': files_time, 'id': count})
            finally:
                img.close()
    data = {
        "success": True,
        "code": 1,
        "data": files
    }
    return jsonify(data)

@reward.route('/delete', methods=['POST'])
def delete():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 1
    }
    print(json_data)
    if (json_data["action"] == '3'):
        root, dirs, files_name = list(os.walk('images/pictures_saved_fine'))[0]
        image_name = files_name[int(json_data['id'])-1]
        path = 'images/pictures_saved_fine/' + image_name
        os.remove(path)
        data['success'] = True

    return jsonify(data)

@reward.route('person_compare', methods=['POST'])
def person_compare():
    json_data = request.form.to_dict()
    data = {
        "success": False,
        "code": 1
    }
    if(json_data["action"]== '1'):
        imgFile = json_data["imgFile"][23:]
        temp = base64.b64decode(imgFile)#图片的二进制
        #人脸对比返回员工的id,人脸存储在person_img，是worker的头像


        i = Worker.query.filter(Worker.worker_id == 123).first().__dict__
        i.pop('_sa_instance_state')
        print(i)
        path = 'persons_img/' + i["avter"]
        img = open(path, 'rb')  # 读取图片文件
        try:
            images = base64.b64encode(img.read()).decode()  # 进行base64编码
            i["avater"] = "data:image/png;base64," + images
        finally:
            img.close()
        data["data"] = i
        print(data["data"])
    return jsonify(data)

