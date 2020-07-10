$(function(){
	$.ajax({
		cache: false, //保留缓存数据
		type: "POST", //为post请求
		url:  url+"AwardServer",   
		dataType: 'json',
		data: {
			"action":1      
		},
		async: true, 
		error: function(request) { //请求失败之后的操作
			console.log(request);
	        alert("请求失败");
			return;
		},
		success: function(data) { //请求成功之后的操作
			if(data.code==1){
				var awardList=data.data;       //获取json数组
				//alert(awardList);
				for(var i=0;i<awardList.length;i++){   //循环遍历awardList集合中的数据，并输出到表格
	
	
				//创建行
				var tr = $("<tr>");
   				//创建列
   				var name = $("<td>");
				name.html(awardList[i].worker_name);
   				
				var job = $("<td>");
				job.html(awardList[i].position);

				var hometown = $("<td>");
				hometown.html(awardList[i].hometown);

				var age= $("<td>");
				age.html(awardList[i].age);

				var sex = $("<td>");
				sex.html(awardList[i].sex);

				var times = $("<td>");
				times.html(awardList[i].unwear_times);
				
				var fine = $("<td>");
				fine.html(awardList[i].fine);
				
				tr.append(name).append(job).append(hometown).append(age).append(sex).append(times).append(fine);
				$("#example2").append(tr);
				
			
				}
		}
	}
  })
	
})