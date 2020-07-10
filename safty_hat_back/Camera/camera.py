import random
import string

import cv2
import threading    #python 多线程操作库

import time, os
from exts import db
from models import Pictrue
from backend.tf_inference import  inference
count = 0


class RecordingThread(threading.Thread):
    def __init__(self, name, camera):
        threading.Thread.__init__(self)
        self.name = name
        self.isRunning = True

        self.cap = camera
        # fourcc = cv2.VideoWriter_fourcc(*'MJPG') #设置视频编码方式
        # self.out = cv2.VideoWriter('./images/video.avi', fourcc, 20.0, (640, 480))
        # # out 是VideoWriter的实列对象，就是写入视频的方式，第一个参数是存放写入视频的位置，
        # # 第二个是编码方式，20是帧率，最后是视频的高宽，如果录入视频为灰度，则还需加一个false

    # def run(self):
    #     while self.isRunning:
    #         ret, frame = self.cap.read()  #read()函数表示按帧读取视频，success，frame是read()的两个返回值，
    #         # ret是布尔值——如果读取帧是正确的则返回True，如果文件读取到结尾则返回False，Frame表示的是每一帧的图像，是一个三维矩阵
    #         if ret:
    #             self.out.write(frame)
    #
    #     self.out.release()

    def stop(self):
        self.isRunning = False

    def __del__(self):
        self.out.release()


class VideoCamera(object):
    def __init__(self,sess,detection_graph):
        # 打开摄像头， 0代表笔记本内置摄像头
        self.cap = cv2.VideoCapture(0)

        # 初始化视频录制环境
        self.is_record = False
        self.out = None

        # 视频录制线程
        self.recordingThread = None

        self.sess =sess
        self.detection_graph = detection_graph
        self.allpeople = 0
        self.nohatpeople = 0

    # 退出程序释放摄像头
    def __del__(self):
        self.cap.release()

    def close(self):
        if self.cap.isOpened():
            self.cap.release()

    def get_frame(self):
        global count
        ret, frame = self.cap.read()
        count = count + 1

        if count % 5 == 0:
            results = inference(self.sess, self.detection_graph, frame, conf_thresh=0.7)
            print(results)
            allpeople = len(results["results"])
            nohatpeople = 0
            for people in results["results"]:
                if people["name"] == "person":
                    nohatpeople = nohatpeople + 1
            self.allpeople = allpeople
            self.nohatpeople  = nohatpeople
            frame = paint_rectanle(results, frame)
            if nohatpeople>0:
                Save_image(frame)
            count = count % 100000

        if ret:
            ret, jpeg = cv2.imencode('.jpg', frame)
            # 视频录制
            if self.is_record:
                if self.out == None:
                    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
                    # imgName = ''.join([random.choice(string.digits + string.ascii_letters) for i in range(10)])
                    imgName = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime())
                    self.out = cv2.VideoWriter('images/videos_saved/' + imgName + '-Alarm.avi', fourcc, 20.0, (640, 480))

                # ret, frame = self.cap.read()
                if ret:
                    self.out.write(frame)
            else:
                if self.out != None:
                    self.out.release()
                    self.out = None

            return jpeg.tobytes(),self.allpeople,self.nohatpeople

        else:
            return None

    def start_record(self):
        self.is_record = True
        self.recordingThread = RecordingThread("Video Recording Thread", self.cap)
        self.recordingThread.start()

    def stop_record(self):
        self.is_record = False

        if self.recordingThread != None:
            self.recordingThread.stop()

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


def Save_image(pictrue):

    path = ".\\images\\pictures_saved_fine\\"
    image_name = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime()) + '-Alarm.jpg'
    file_path = os.path.join(path,image_name)
    cv2.imwrite(file_path, pictrue)

    image = Pictrue(image_src=file_path)
    db.session.add(image)
    db.session.commit()