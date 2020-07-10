from flask import Blueprint, request, jsonify
from models import Manager

sign_in = Blueprint('sign', __name__)

@sign_in.route('/sign', methods=['POST'])
def landing():
    json_data = request.form.to_dict()
    result = Manager.query.filter(Manager.manager_name == json_data['name']).first().__dict__
    print(result)
    data = {
        "code": 0,
        "data": {}
     }
    if result != None:
        if result['manager_pwd'] == json_data['pwd']:
            data["code"] = 1
            data["data"]["manager_name"] = result["manager_name"]
    return jsonify(data)