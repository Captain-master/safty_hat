function _s() {  
        //var avater = document.getElementById("avater").files;  
        
	var fileInput = $('#avater').get(0).files[0];
	//console.info(fileInput);
	if(!fileInput){
		alert("请选择上传文件！");
	}else{
		$("#reportXMLform").submit();
	}
//	else if(fileInput){
//	       	   if(!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(avater_arr[0].name)){
//					alert("请确保为文件为图像类型！");
//					return false;
//			 }
//	       }
//      if(!/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(avater[0].name)){
//				alert("请确保为图像类型！");
//				return false;
//			}else{ 
//				  // var avater = $("#avater").files;
//       //上次修改时间  
//       alert(avater[0].lastModifiedDate);  
//       //alert(avater[0].val()); 
//       //名称  
//       alert(avater[0].name);  
//       //大小 字节  
//      alert(avater[0].size);  
//       //类型  
//       alert(avater[0].type); 
//			}
//     
         
         
//       // 判断文件类型
// var type=(src.substr(src.lastIndexOf("."))).toLowerCase();
// if(type!=".jpg"&&type!=".gif"&&type!=".jpeg"&& type!=".png"){
// alert("您上传图片的类型不符合(.jpg|.jpeg|.gif|.png)！");
//return false;
//}
     }