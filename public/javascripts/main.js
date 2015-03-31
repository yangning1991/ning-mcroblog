$(function($){
	//form check
	var group1_vaild=false,group2_vaild=false,group3_vaild=false,group4_vaild=false;
	$(".group1 input").focus(function(){
		$(this).removeClass('error');
		$('.group1 td').attr('class','');
		$('.group1 td').text("请输入账户名");
	});
	$(".group2 input").focus(function(){
		$(this).removeClass('error');
		$('.group2 td').attr('class','');
		$('.group2 td').text("长度为6-16de非空字符组合!");
	});
	$(".group3 input").focus(function(){
		$(this).removeClass('error');
		$('.group3 td').attr('class','');
		$('.group3 td').text("请再次输入密码!");
	});
	$(".group4 input").focus(function(){
		$(this).removeClass('error');
		$('.group4 td').attr('class','');
		$('.group4 td').text("请输入可用的邮箱!");
	});
	$(".group1 input").blur(function(){
		var username=$(this).val();
		if (username==="") {
			$('.group1 td').attr('class','error');
			$(this).addClass('error');
			$('.group1 td').text("用户名不能为空！");
			group1_vaild=false;
		}else{
			/*$.ajax({
				type:"get",
				url:"http://127.0.0.1:3000/ajax/",
				data:{"user":username},
				dataType:"json",
				suceess:function(data){
					if(data==null){
						alert('wrong!');
					}
					if(data.exit==true){
						$('.group1 td').attr('class','error');
						$(this).addClass('error');
						$('.group1 td').text("用户已存在!");
						group1_vaild=false;
					}else{
						$(this).removeClass('error');
						$('.group1 td').attr('class','ok');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
                  				  alert('error ' + textStatus + " " + errorThrown);  
               			 }
			});*/
			$.getJSON('http://127.0.0.1:3000/ajax/?user='+username,function(json){
				if(json.exit==true){
					$('.group1 td').attr('class','error');
					$(this).addClass('error');
					$('.group1 td').text("用户已存在!");
					group1_vaild=false;
				}else{
					$(this).removeClass('error');
					$('.group1 td').attr('class','ok');
					$('.group1 td').text("");
					group1_vaild=true;
				}
			});
		}
	});
	$(".group2 input").blur(function(){
		var password=$(this).val();
		if (password=="") {			
			$('.group2 td').text("密码不能为空！");
			group2_vaild=false;
		}else if(password.indexOf(" ") != -1){
			$('.group2 td').text("密码不能包含空格！");
			group2_vaild=false;
		}else if(password.length<6){
			$('.group2 td').text("密码长度为6-16！");
			group2_vaild=false;
		}else{
			group2_vaild=true;
			$(this).removeClass("error");
			if (/^[0-9]{6,16}$/.test(password) || /^[a-zA-Z]{6,16}$/.test(password)) {
				$('.group2 td').text("low！");
				$('.group2 td').attr("class","low");
			}else if (/^[0-9a-zA-Z]{6,16}$/.test(password)) {
				$('.group2 td').text("middle！");
				$('.group2 td').attr("class","middle");
			}else{
				$('.group2 td').text("high！");
				$('.group2 td').attr("class","high");
			}
		}
		if (group2_vaild==false) {
			$('.group2 td').attr('class','error');
			$(this).addClass('error');
		};
	});
	$(".group3 input").blur(function(){
		var repeat_password=$(this).val();
		if (repeat_password !=  $("#password").val()) {
			$(this).addClass("error");
			$(".group3 td").attr("class","error");
			$(".group3 td").text("密码不一致");
			group3_vaild=false;
		}else{
			group3_vaild=true;
			$(".group3 td").attr("class","ok");
			$(".group3 td").text("");
		}
	});
	$(".group4 input").blur(function(){
		var email=$(this).val();
		var reg_email=/^([a-zA-Z0-9]+[_|\-|\.]?)*[0-9a-zA-Z]+@([0-9a-zA-Z]+[_|\-|\.]?)*[0-9a-zA-Z]+\.[a-zA-Z]{2,3}$/
		if(reg_email.test(email)){
			group4_vaild=true;
			$(".group4 td").attr("class","ok");
			$(".group4 td").text("");
		}else{
			group4_vaild=false;
			$(".group4 td").attr("class","error");
			$(".group4 td").text("email  is not vaild!");
			$(this).addClass("error");
		}
	});
	$("#reg_form").submit(function(){
		if (group1_vaild && group2_vaild && group3 && group4_vaild) {
			$(this).submit();
			$("#reg_form button").attr("disabled","disabled");
		}else{
			return false;
		}
	});

})