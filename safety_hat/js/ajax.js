//JS模拟表格数据
// $(function() {
// 			var text1 = `
// 			<tr>
// 				<th class="t_id">33</th>
// 				<th><img onclick="t_img(this)" class="t_img" src="images/1.jpg" ></th>
// 				<th>2020-7-6</th>
// 				<th><button class="btn_del" type="button" onclick="btn_1(this)" style="background-color: #00c0ef;">删除</button></th>
// 			</tr>
// 			`								
// 			for (var i=0;i<20;i++) {
// 				$('.t_body').append(text1);
// 			}
// 		})


//--------------------------------------
// 加载所有数据
 var data_1
 $.ajax({
 	async: false,
 	type: "POST",
 	data: {
 		"action": 1 //一个查找事件
 	},
 	url: "http://127.0.0.1:8080/award/history",
 	success: function(result) {
 		data_1 = eval(result)
 		data_1 = data_1.data //试试要不要data
		//console.log(data_2)
 		for (var i = 0; i < data_1.length; i++) {
 			var text =
 				`<tr>
										<th class="id_1">${data_1[i].id}</th>
										<th><img onclick="t_img(this)" class="t_img" src="data:image/png;base64,${data_1[i].image_src}" ></th>
										<th>${data_1[i].image_saved_time}</th>
										<th><button class="btn_del" type="button" onclick="btn_1(this)" style="background-color: #00c0ef;">删除</button></th>
									</tr>`
 			$('.t_body').append(text);
 		}
 	},
 	error: function() {
 		alert("error，加载失败")
 	}
 });

//--------------------------------------------------------------------

//点击删除事件
var id_1
function btn_1(obj) {
	id_1 = $(obj).parents("th").siblings(".id_1").text()
	var msg = "您确定要删除当前id:" + id_1 + "信息吗？";
	if (confirm(msg) == true) {
		console.log("删除删除")
		$.ajax({
			async: false,
			type: "POST",
			data: {
				"action": 3, //一个查找事件
				"id": id_1
			},
			url: "http://127.0.0.1:8080/award/delete",
			success: function(result) {
				window.location.reload() //刷新
			},
			error: function() {
				alert("error，删除失败")
			}
		});
		return true; //你也可以在这里做其他的操作
	} else {
		return false;
	}
}

//--------------------------------------------------------------------
//js模拟 个人信息 数据
// var json = {
// 	data: {
// 		worker_id: 1103, //员工id
// 		worker_name: "张翼德", //员工姓名
// 		age: 21,//年龄
// 			sex: "男",//性别
// 			position: "搬砖",//职位
// 			worktime: 3,//工龄
// 			email: "4567@qq.com",//邮件
// 			hometown: "英国·曼彻斯特",//籍贯
// 			avater: "images/3.jpg",//头像
// 	}
// }
// function show(data) {
// 	console.log(data);
// 	$(".t_img_1").attr("src",data.data.avater)
// 	$("#f_name").text(data.data.worker_name)
// 	$("#f_id").text(data.data.worker_id)
// 	$("#f_eml").text(data.data.email)
// 	$("#f_age").text(data.data.age)
// 	$("#f_job").text(data.data.position)
// 	$("#f_add").text(data.data.hometown)
// 	$("#f_year").text(data.data.worktime)
// 	$("#f_sex").text(data.data.sex)
// }
// show(json)
//--------------------------------------------------------------------
//点击上传
function btn_upload(obj) {
	var msg = "是否继续上传";
	if (confirm(msg) == true) {
		var avater = document.getElementById("filer_example1").files[0];
		var formData = new FormData()
		formData.append('avater',avater);
		// console.log($(".jFiler-item-title").children("b").text());
		// var fd = new FormData();
		// var files = $("#filer_input").files;
		// fd.append("file", files[0]);
		console.log(avater);
		// fd.append("file", files[1]);
		$.ajax({
			url: "http://127.0.0.1:8080/award/person_compare", // flask后端路由
			type: "POST",
			processData: false,
			contentType: false,
			data: {
				"action": 1, //查找
				"compare_pic": formData
			}, // form数据
			success: function(result) {
				//成功后展示数据
				data = eval(result)
				$(".t_img_1").attr("src",data.data.avater)
				$("#f_name").text(data.data.worker_name)
				$("#f_id").text(data.data.worker_id)
				$("#f_eml").text(data.data.email)
				$("#f_age").text(data.data.age)
				$("#f_job").text(data.data.position)
				$("#f_add").text(data.data.hometown)
				$("#f_year").text(data.data.worktime)
				$("#f_sex").text(data.data.sex)
			},
			error: function() {
				alert("error，上传失败")
			}
		});
		return true; //你也可以在这里做其他的操作
	} else {
		return false;
	}
}


var data
function btn_upload() {
	var msg = "是否继续上传";
	if (confirm(msg) == true) {
		var fileInput = $('#filer_example1').get(0).files[0];
		//FileReader可直接将上传文件转化为二进制流
		var reader = new FileReader();
		reader.onload = function (e) {
			alert('文件读取完成');
			var imgFile = e.target.result;
			console.log(imgFile)
			$.ajax({
				url: "http://127.0.0.1:8080/award/person_compare", // flask后端路由
				type: "POST",
				cache: false, //保留缓存数据
				dataType: 'json',
				data: {
					"action": 1, //查找
					"imgFile": imgFile
				}, // form数据
				async: true,
				success: function (result) {
					//成功后展示数据
					data = eval(result)
					$(".t_img_1").attr("src", data.data.avater)
					$("#f_name").text(data.data.worker_name)
					$("#f_id").text(data.data.worker_id)
					$("#f_eml").text(data.data.email)
					$("#f_age").text(data.data.worker_age)
					$("#f_job").text(data.data.position)
					$("#f_add").text(data.data.hometowm)
					$("#f_year").text(data.data.worktime)
					$("#f_sex").text(data.data.worker_sex)
				},
			error: function () {
					alert("error，上传失败")
				}
			});
		};
		//正式读取文件
		reader.readAsDataURL(fileInput);

	}
}
//-------------------------------------
