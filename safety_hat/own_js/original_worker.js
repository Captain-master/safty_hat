$(function(){
	$.ajax({
		cache: false, //保留缓存数据
		type: "POST", //为post请求
		url: server_url+"pro_workers/all_workers",
		dataType: 'json',
		data: {
			"action":2
		},
		async: true, 
		error: function(request) { //请求失败之后的操作
			console.log(request);
			return;
		},
		success: function(data) { //请求成功之后的操作
			if(data.code==1){ 
				var workerList=data.data;       //获取json数组
				sessionStorage.setItem('workerList',JSON.stringify(data.data));
				
				var num=workerList.length;
				$("#allworker").append(num); //统计所有员工
				
				for(var i=0;i<workerList.length;i++){   //循环遍历awardList集合中的数据，并输出到表格
				var tr = $("<tr>");//创建行
   				//创建列
   				var id = $("<td>"); 
   				var workerid=workerList[i].worker_id;
				id.html(workerList[i].worker_id);
				$("#ch_id").val(workerid);
				
   				var name = $("<td>");
   				var worker_name=workerList[i].worker_name;
   				var avater=workerList[i].avter;
				name.html("<span style='float: left; margin-right:90px;'><img alt='image' style='max-width:80px; height:80px;border-radius:15px' src='avater/"+avater+"' /></span>"+
				  "<strong>"+worker_name+"</strong>");
				$("#ch_name").val(worker_name)
				
				var age= $("<td>");
				var worker_age=workerList[i].worker_age;
				age.html(worker_age);
				$("#ch_age").val(worker_age);

				var sex = $("<td>");
				var worker_sex=workerList[i].worker_sex;
				sex.html(worker_sex);
   				$("#ch_sex").val(worker_sex);
   				
				var job = $("<td>");
				var worker_position=workerList[i].position;
				job.html(worker_position);
				$("#ch_position").attr("value",worker_position);
				
				var worktime = $("<td>");
				worktime.html(workerList[i].worktime);
				$("#ch_worktime").val(workerList[i].worktime);
				
				var email = $("<td>");
				var worker_eamil=workerList[i].email
				email.html(worker_eamil);
				$("#ch_email").val(worker_eamil);

				var hometown = $("<td>");
				hometown.html(workerList[i].hometowm);
				console.log(hometown)
				$("#ch_hometown").val(workerList[i].hometowm);
				
				
				var opertion = $("<td>");
				opertion.html("<button style='border:none' onclick='findInfoById("+workerid+")'><a class='btn btn-primary btn-sm' data-toggle='modal' data-target='#modal_edit_user_5'><i class='fa fa-pencil' aria-hidden='true'></i></a></button>"+
				"<button style='border:none' id='deletebtn' onclick='deleteRecord_5("+workerid+")'><a class='btn btn-danger btn-sm' data-title='Delete'><i class='fa fa-trash-o' aria-hidden='true'></i></a></button> "+
					"<button style='border:none' onclick='send_email("+workerid+")'><a class='btn btn-primary btn-sm'><i class=\"fa fa-envelope bigfonts\" aria-hidden=\"true\"></i></a></button> ");

				tr.append(id).append(name).append(age).append(sex).append(job).append(worktime).append(email).append(hometown).append(opertion);
				$("#workersTable").append(tr);
				}
		}
	
		}

})
})
