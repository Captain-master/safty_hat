// var imgFile;
function addWorker() {
	var workerList = JSON.parse(sessionStorage.getItem('workerList'));//获取workers数组
	var id = $("#worker_id").val();
	var name = $("#worker_name").val();
	var sex = $("#sex").val();
	var age =  $("#age").val();
	var position= $("#position").val();
	var worktime =$("#worktime").val();
	var flag=100;

	var avater_arr = document.getElementById("avater").files;
	console.log(avater_arr);

	var fileInput = $('#avater').get(0).files[0];
	//创建读取文件的对象
	var reader = new FileReader();
	//创建文件读取相关的变量

	//为文件读取成功设置事件
	reader.onload=function(e) {
		alert('文件读取完成');
		var imgFile = e.target.result;
		console.log(imgFile);
		if(id==""){
			alert("员工编号不可为空！");
		}else{
			if(workerList!=null){
				for(var i=0;i<workerList.length;i++){
					if(id==workerList[i].worker_id){
						flag=400;
						alert("员工编号不可重复，请重新设置");
					}

				}
			}
			if(flag==100){
				if(sex==""||age==""){
					alert("员工年龄性别不可为空！");
				}else if(!fileInput){
					alert("请选择上传文件！");
				}else if(!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(avater_arr[0].name)){
					alert("请确保为文件为图像类型！");
					return false;
				}else{
					$.ajax({
						cache: false, //保留缓存数据
						type: "POST", //为post请求
						url: server_url+"pro_workers/add_workers",
						dataType: 'json',
						data: {
							"worker_id":$("#worker_id").val(),
							"worker_name":$("#worker_name").val(),
							"age": $("#age").val(),
							"sex":$("#sex").val(),
							"position":$("#position").val(),
							"worktime":$("#worktime").val(),
							"email":$("#email").val(),
							"hometown":$("#hometown").val(),
							"avater":avater_arr[0].name,
							"action":1,
							"imgFile":imgFile
						},
						async: true,
						error: function(request) { //请求失败之后的操作
							console.log(request);
							return;
						},
						success: function(data) { //请求成功之后的操作
							if(data.code==1){
								window.location.href = 'pro-users.html';
							}
						}
					})
				}
			}
		}
	};
	//正式读取文件
	reader.readAsDataURL(fileInput);


}

function deleteRecord_5(RecordId)
{
	if (confirm('确认删除？')) {
		$.ajax({
			cache: false, //保留缓存数据
			type: "POST", //为post请求
			url: server_url+"pro_workers/d_workers",
			dataType: 'json',
			data: {
				"worker_id":RecordId,
				"action":3
			},
			async: true,
			error: function(request) { //请求失败之后的操作
				console.log(request);
				return;
			},
			success: function(data) { //请求成功之后的操作
				if(data.code==1){
					window.location.href = 'pro-users.html';
				}
			}
		})
//																window.location.href = 'http://localhost:8080/Safety_Hat_Web_exploded/WorkerServer?'+data;
	}
}

function findInfoById(id){
	$.ajax({
		cache: false, //保留缓存数据
		type: "POST", //为post请求
		url: server_url+"pro_workers/search_workers",
		dataType: 'json',
		data: {
			"worker_id":id,
			"action":5
		},
		async: true,
		error: function(request) { //请求失败之后的操作
			console.log(request);
			return;
		},
		success: function(data) { //请求成功之后的操作
			if(data.code==1){
				var workers=data.data;       //获取json数组
				$("#ch_id").val(id);
				$("#ch_name").val(workers.worker_name)
				$("#ch_age").val(workers.worker_age);
				$("#ch_sex").val(workers.worker_sex);
				$("#ch_position").attr("value",workers.position);
				$("#ch_worktime").val(workers.worktime);
				$("#ch_email").val(workers.email);
				$("#ch_hometown").val(workers.hometown);
			}
		}
	})
}

function changeInfo(){
	var avater_arr = document.getElementById("ch_avater").files;
	var fileInput = $('#ch_avater').get(0).files[0];
	console.info(fileInput);
	if(!fileInput){
		var avater="avater1.png";//默认头像
	}else{
		var avater=avater_arr[0].name;
		if(!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(avater)){
			alert("请确保为文件为图像类型！");
			return false;
		}
	}

	$.ajax({
		cache: false, //保留缓存数据
		type: "POST", //为post请求
		url: server_url+"pro_workers/r_workers",
		dataType: 'json',
		data: {
			"worker_id":$("#ch_id").val(),
			"worker_name":$("#ch_name").val(),
			"age": $("#ch_age").val(),
			"sex":$("#ch_sex").val(),
			"position":$("#ch_position").val(),
			"worktime":$("#ch_worktime").val(),
			"email":$("#ch_email").val(),
			"hometown":$("#ch_hometown").val(),
			"avater":avater,
			"action":4
		},
		async: true,
		error: function(request) { //请求失败之后的操作
			console.log(request);
			return;
		},
		success: function(data) { //请求成功之后的操作
			if(data.code==1){
				window.location.href = 'pro-users.html';
			}
		}
	})
}

function send_email(id){
	$.ajax({
		cache: false, //保留缓存数据
		type: "POST", //为post请求
		url: server_url + "pro_workers/send_email",
		dataType: 'json',
		data: {
			"worker_id": id,
			"action": 6
		},
		async: true,
		error: function (request) { //请求失败之后的操作
			console.log(request);
			return;
		},
		success: function (data) { //请求成功之后的操作
			if (data.code == 1) {
				alert("邮箱已成功发送！");
			}
		}
	})
}
