//设置cookie
function setCookie(c_name,value,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
//获取cookie
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        var c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!==-1)
        {
            c_start=c_start + c_name.length+1;
            var c_end=document.cookie.indexOf(";",c_start);
            if (c_end===-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}
//清除cookie
function clearCookie(name) {
    setCookie(name, "", -1);
}



/**
 * 文档就绪事件，防止在文档加载之前就运行jQuery代码
 * */
$(document).ready(function () {
    //进入先判断有没有记住密码和验证码
    checkRemember();

    function checkRemember() {
        $("#name").val(getCookie("name"));
        $("#pwd").val(getCookie("pwd"));
        if (getCookie("check") === "true") {
            $("input.myCheckBox").attr("checked", true);
        }
        

    }

//判断登陆是否成功

    $("button.btn").click(function () {
        var name = $("#name").val();
        var pwd = $("#pwd").val();
        var input_wrong = $("#input_wrong");
        if (name == null || name === "") {
            input_wrong.html("用户名不能为空");//错误警告
            input_wrong.css("display", "block");
        } else if (pwd == null || pwd === "") {
            input_wrong.html("密码不能为空");
            input_wrong.css("display", "block");
        }  else{
            input_wrong.css("display", "none");
            var myCheckBox = $("input.myCheckBox");
            if (myCheckBox.is(':checked')) {
                setCookie("name", name, 7);
                setCookie("pwd", pwd, 7);
                setCookie("check", "true", 7);//记录复选框选中
            } else {
                clearCookie("name");
                clearCookie("pwd");
                clearCookie("check");
            }
            succeed();//将数据传回服务端
        }
    });


    /**
     * 登录之后将数据发送到服务端
     * */

    function succeed() {
        /* $.post("/LoginServlet", function (data, status) {
             alert(data + "状态：\n" + status);
         });*/
        
        //提交json数据
        $.ajax({
            type: "POST",
           cache: false, //保留缓存数据
			url: server_url+"sign_in/sign",
			dataType: 'json',
			data: {
				"name":$("#name").val(),
				"pwd":$("#pwd").val(),
				"action":1,
				},
				
			success: function(data) { //请求成功之后的操作
				if (data.code == 1) {
					sessionStorage.setItem('manager_name',JSON.stringify(data.data.manager_name));
					 $("#input_wrong").css("display", "none");
						window.location.href = 'index.html';
					
					
					
				} else {
					//提示用户名或密码错误
					var input_wrong = $("#input_wrong");
                    input_wrong.html("用户名或密码错误！");
                    input_wrong.css("display", "block");
				}
			
			}
           
        });

    }

   
 
});
