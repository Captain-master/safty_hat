import base64
import time
import cv2
from flask import request, Blueprint, jsonify, Response
from Camera.camera import VideoCamera
import os
from models import Pictrue
from exts import db
from base64 import b64decode
import random
import string

import cv2
from backend.tf_inference import load_model, inference
sess, detection_graph = load_model()

Camera = None
video_file_path = ""
allpeople = 0
nohatpeople = 0

def gen(camera):
    global nohatpeople, allpeople
    while True:
        frame,allpeople,nohatpeople = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: images/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

index = Blueprint('index', __name__)

@index.route('/', methods=['POST'])
def get_number():
    global allpeople
    global nohatpeople
    data = request.form.to_dict()
    Data = {
            "code": 0,
            "data": {
                "allpeople": 0,
                "nohatpeople": 0
            }
        }
    if data['action'] == '1':
        Data["code"] = 1
        Data["data"]["allpeople"] = allpeople
        Data["data"]["nohatpeople"] = nohatpeople
    return jsonify(Data)

@index.route('/open_feed',methods=['POST']) #打开摄像头
def video_feed():
    json_data = request.form.to_dict()
    global Camera
    data = {
        "code": 0
    }
    if json_data["action"] == '1':
        if Camera is None:
            print(Camera)
            Camera = VideoCamera(sess, detection_graph)
            data["code"] = 1
            print(data)
    return jsonify(data)

@index.route('/views',methods=['GET']) #发送视频流
def views():
    global Camera
    #获取的帧
    frame = gen(Camera)
    # Yes_No = False
    #
    # #检测程序处理，如果得到需要保存的图片 则Yes_No = True
    # if Yes_No == True:
    #     image = Pictrue(image=frame)
    #     db.session.add(image)
    #     db.session.commit()
    return Response(frame,
            mimetype='multipart/x-mixed-replace; boundary=frame')
@index.route('/get_img',methods=['POST']) #获取前端图片
def get_img():
    global allpeople
    global nohatpeople
    file = request.files
    imgData = file["image"]

    # 设置图片要保存到的路径
    path = ".\images\pictures_upload\\"
    # 获取图片名称及后缀名
    imgName = imgData.filename
    # 图片path和名称组成图片的保存路径
    file_path = path + imgName
    # 保存图片
    imgData.save(file_path)

    # Yes_No = False
    # #检测程序处理并将处理，如果有未带安全帽的返回处理后的图片picture，并将Yes_No = True
    #
    # if Yes_No == True:
    #     file_path = Save_image(pictrue)

    # 读取图片 返回结果
    img = cv2.imread(file_path)
    results = inference(sess, detection_graph, img, conf_thresh=0.7)

    print(results)
    allpeople = len(results["results"])
    nohatpeople = 0
    for people in results["results"]:
        if people["name"] == "person":
            nohatpeople = nohatpeople + 1

    img_paint =  paint_rectanle(results,img)
    cv2.imwrite(file_path,img_paint)

    Save_image(img_paint)

    #发送处理后的图片
    img = open(file_path, 'rb')  # 读取图片文件
    data = base64.b64encode(img.read()).decode()  # 进行base64编码
    html = '''<img src="data:image/png;base64,{}" style="width:100%;height:100%;"/>'''  # html代码
    htmlstr = html.format(data)  # 添加数据
    return htmlstr

@index.route('/Get_img',methods=['POST']) #获取index的4张图片图片
def Get_img():
    global allpeople
    global nohatpeople
    file = request.form.to_dict()
    print(file)
    if file['image_id'] == '1':
        file_path = 'Image/test_000002.jpg'
    elif file['image_id'] == '2':
        file_path = 'Image/test_000034.jpg'
    elif file['image_id'] == '3':
        file_path = 'Image/test_000313.jpg'
    else:
        file_path = 'Image/test_000547.jpg'
    #检测程序处理
    img = cv2.imread(file_path)
    results = inference(sess, detection_graph, img, conf_thresh=0.7)
    print(results)
    allpeople = len(results["results"])
    nohatpeople = 0
    for people in results["results"]:
        if people["name"] == "person":
            nohatpeople = nohatpeople + 1

    file_save_path = 'images/pictures_saved/'+file_path.split('/')[-1]
    img_paint = paint_rectanle(results,img)
    cv2.imwrite(file_save_path,img_paint)

    #发送处理后的图片
    img = open(file_save_path, 'rb')  # 读取图片文件
    data = base64.b64encode(img.read()).decode()  # 进行base64编码
    html = '''<img src="data:image/png;base64,{}" style="width:100%;height:100%;"/>'''  # html代码
    htmlstr = html.format(data)  # 添加数据
    return htmlstr

@index.route('/close_feed', methods=['POST']) #关闭摄像头
def close():
    data = {
        "code": 0
    }
    global Camera
    if Camera is not None:
        Camera.close()
        Camera = None
        data["code"] = 1
    return jsonify(data)

@index.route('/save_img',methods=['POST']) #录像
def record_status():
    global Camera
    if Camera is None:
        Camera = VideoCamera()
    json = request.form.to_dict()
    status = json['status']
    if status == 'true':
        Camera.start_record()
        return jsonify(result="started")
    else:
        Camera.stop_record()
        return jsonify(result="stopped")

@index.route('/get_video',methods=['POST','GET'])#储存前端上传并经检测程序处理后的视频
def get_video():
    file = request.files
    imgData = file["image"]
    global video_file_path
    path = ".\images\\videos_upload\\"
    imgName = imgData.filename
    video_file_path = path + imgName
    #检测程序处理

    # Yes_No = False
    # # 检测程序处理并将处理，如果有未带安全帽的返回处理后的图片picture，并将Yes_No = True
    #
    # if Yes_No == True:
    #     file_path = Save_image(pictrue)
    print(type(imgData))
    imgData.save(video_file_path) #保存视频

    data = {
        "code": 1
    }
    return jsonify(data)

@index.route('/send_video',methods=['GET'])#返回检测程序处理后的视频
def send_video():
    global video_file_path
    print(video_file_path)
    cap = cv2.VideoCapture(video_file_path)
    # 获取总帧数
    totalFrameNumber = cap.get(cv2.CAP_PROP_FRAME_COUNT)
    print(totalFrameNumber)

    COUNT = 0
    while True:
        frame = Video(cap, totalFrameNumber, COUNT)
        if frame != False:
            return Response(frame,
                            mimetype='multipart/x-mixed-replace; boundary=frame')

def Video(cap,totalFrameNumber,COUNT):
    # 若小于总帧数则读一帧图像
    global nohatpeople,allpeople
    while COUNT < totalFrameNumber:
        # 一帧一帧图像读取
        ret, frame = cap.read()
        #resize frame
        frame = cv2.resize(frame, (640, 480))
        if COUNT % 5 == 0:
            results = inference(sess, detection_graph, frame, conf_thresh=0.7)
            print(results)
            allpeople = len(results["results"])
            nohatpeople = 0
            for people in results["results"]:
                if people["name"] == "person":
                    nohatpeople = nohatpeople + 1
            frame = paint_rectanle(results, frame)
            if nohatpeople>0:
                Save_image(frame)
        ret, jpeg = cv2.imencode('.jpg', frame)
        # 把每一帧图像保存成jpg格式（这一行可以根据需要选择保留）
        jpeg = jpeg.tobytes()
        if ret == True:
            COUNT = COUNT + 1
            yield (b'--frame\r\n'
                    b'Content-Type: images/jpeg\r\n\r\n' + jpeg + b'\r\n\r\n')
        if COUNT == totalFrameNumber:
            cap.release()
    return False

def Save_image(pictrue):
    #<class 'numpy.ndarray'>
    # print(type(pictrue))
    path = ".\\images\\pictures_saved_fine\\"
    # imgName = ''.join([random.choice(string.digits + string.ascii_letters) for i in range(10)])
    # file_path = path + imgName

    image_name = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime()) + '-Alarm.jpg'
    file_path = os.path.join(path,image_name)
    cv2.imwrite(file_path, pictrue)

    image = Pictrue(image_src=file_path)
    db.session.add(image)
    db.session.commit()
    return file_path

def paint_rectanle(results,img):
    list_results = results["results"]
    for rect in list_results:
        if rect["name"] == "hat":
            rectcolor = (0, 255, 0)
            cv2.putText(img,"Safe",(rect["bbox"][-4], rect["bbox"][-3]),cv2.FONT_HERSHEY_SIMPLEX,1,rectcolor,2)
        elif rect["name"] == "person":
            rectcolor = (0, 0, 255)
            cv2.putText(img, "Alarm", (rect["bbox"][-4], rect["bbox"][-3]), cv2.FONT_HERSHEY_SIMPLEX, 1, rectcolor, 2)
        else:
            rectcolor = (255, 0, 0)
            cv2.putText(img, "Others", (rect["bbox"][-4], rect["bbox"][-3]), cv2.FONT_HERSHEY_SIMPLEX, 1, rectcolor, 2)
        img = cv2.rectangle(img, (rect["bbox"][-4], rect["bbox"][-3]), (rect["bbox"][-2], rect["bbox"][-1]), rectcolor, 2)
    return img