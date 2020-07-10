$(function() {
	day = new Date().getDay();
	var hour = new Date().getHours();
	if(hour>6 && hour<=12){
		document.getElementById("gt").innerHTML = "上午好";
	}else  if(hour>12&&hour<=18){
		document.getElementById("gt").innerHTML = "下午好";
	}else  if(hour>18&&hour<=24){
		document.getElementById("gt").innerHTML = "晚上好";
	}
	else  if(hour>=0&&hour<=6){
		document.getElementById("gt").innerHTML = "夜深了";
	}
	var d;
	if(day ==0 ){
		d = "星期天";
	}else if(day == 1){
		d = "星期一";
	}else if(day == 2){
		d = "星期二";
	}else if(day == 3){
		d = "星期三";
	}else if(day == 4){
		d = "星期四";
	}else if(day == 5){
		d = "星期五";
	}else if(day == 6){
		d = "星期六";
	}
	setInterval("cg.innerHTML=new Date().toLocaleDateString()",1000);
	document.getElementById("day").innerHTML=d;
	setInterval("ti.innerHTML=new Date().toLocaleTimeString()",1000);
	var manager_name = JSON.parse(sessionStorage.getItem('manager_name'));
	 
	if(manager_name==null){
			 document.getElementById("head_show").innerHTML="游客身份";
			 document.getElementById("head_a").innerHTML="登陆";
			 }
	else if(manager_name!=null){
			 document.getElementById("head_show").innerHTML=manager_name+"欢迎登陆";
			 document.getElementById("adname").innerHTML = manager_name+"管理员";
			 document.getElementById("head_a").innerHTML="注销";
	         document.getElementById("adname").innerHTML = manager_name+"管理员"
	}
	
    
	cam_inspect(); //必须在此处调用
	image_recognition()//识别图片
});


setInterval(function() {
	
	$.post(server_url + "index/", {"action":1}, function (data) {
		if (data.code == 1) {
			
			$("#all_people").html(data.data.allpeople);
			$("#hated_people").html(data.data.allpeople-data.data.nohatpeople);
			$("#no_hat_people").html(data.data.nohatpeople);
			var num = data.data.nohatpeople/data.data.allpeople;
			$("#no_hat_ratio").html(num.toFixed(2));
			}
			 else {
			$("#all_people").html("0");
			$("#hated_people").html("0");
			$("#no_hat_people").html("0");
			$("#no_hat_ratio").html("0");	
		}
	});
},1000)

//摄像头监测
function cam_inspect(){
	 var open_cam=$("#open_cam");
	 var close_cam=$("#close_cam");
	 var record=$("#record");
	 var stop=$("#stop")
	 var video_re=$("#video_re");
	 //打开摄像头
	 open_cam.click(function() {
				 	alert("打开摄像头");		 	
				 $.post(server_url + "index/open_feed", {"action":1}, function (data) {
				 		if (data.code == 1) {
				 			//成功,这里需要你自己来写js 代码
								path = server_url + "index/views"
								document.getElementById('cam').innerHTML = '<img src="'+path+'">'
								//document.getElementById('hrf').src = path
				 			}
				 			 else {

				 		}
				 	});
				  });
	
	//关闭摄像头
	close_cam.click(function() {
					 	alert("关闭摄像头");		 	
					  $.post(server_url + "index/close_feed", {"action":2}, function (data) {
					  		if (data.code == 1) {
					  			//这里需要你自己来写js 代码
					  			
					  			}
					  			 else {
					  			
					  		}
					  	});
					 });
					 
	// 视频监测
	// video_re.click(function() {
	// 				 	alert("使用视频监测");
	// 				  $.post(server_url + "CamearS", {"action":3}, function (data) {
	// 				  		if (data.code == 1) {
	// 				  			//这里需要你自己来写js 代码
	//
	// 				  			}
	// 				  			 else {
	//
	// 				  		}
	// 				  	});
	// 				 });

	record.click(function () {
		alert("开始录制");
		// var url = window.location.href + "record_status";
		record.disabled = true;
		stop.disabled = false;

		// 禁用下载链接
		// var downloadLink = document.getElementById("download");
		// downloadLink.text = "";
		// downloadLink.href = "";

		// XMLHttpRequest
		$.post(server_url + "index/save_img", {'status': true})
	});

	stop.click(function () {
		alert("停止录制")
		record.disabled = false;
		stop.disabled = true;

		$.post(server_url + "index/save_img", {'status': false})
	});



}

//图片文件上传
//index.html里面

//图片识别
function image_recognition(){
	
		$("#pic_ul").on("click","li",function(){

			// 获取当前点击li 的下标
	
			let index = $(this).index() + 1;
	       $.post(server_url + "index/Get_img", {"action":1 ,"image_id":index}, function (data) {
			   document.getElementById('cam').innerHTML=data
	       	});
			
	
		});

	
}

