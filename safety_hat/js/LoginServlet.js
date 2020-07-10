function LoginServlet() {	
//	window.location.href = 'home.html';
	 $.ajax({
	 	cache: false, //保留缓存数据
	 	type: "POST", //为post请求
	 	url: url+"LoginServer",
	 	dataType: 'json',
	 	data: {
	 		"name":$("#name").val(),
	 		"pass":$("#pass").val(),
	 		"action":1
	 	},
	 	async: true, //设置成true，这标志着在请求开始后，其他代码依然能够执行。如果把这个选项设置成false，这意味着所有的请求都不再是异步的了，这也会导致浏览器被锁死
	 	error: function(request) { //请求失败之后的操作
	 		console.log(request);
	 		return;
	 	},
	 	success: function(data) { //请求成功之后的操作
	 		if (data.code == 1) {
	 			var managername=data.data.manager_name;
	 			//alert(managername);
	 			localStorage.setItem("managername",data.data.manager_name);
	 			window.location.href = 'home.html';
	 			document.getElementById("wrong").style.visibility = "hidden";
	 		} else {
	 			//提示用户名或密码错误
	 			document.getElementById("wrong").style.visibility = "visible";
	 		}

	 	}
	 });
}