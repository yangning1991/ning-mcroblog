
/*
 * GET home page.
 */
 var crypto = require('crypto');
 var url=require('url');
 var User=require("../node_modules/user.js");
 var Post=require("../node_modules/post.js");

module.exports = function(app) {
	app.get('/', function(req, res) {
		Post.get(null,function(err,posts){
			if (err) {
				posts=[];
			};
			res.render('index', {
				title: '首页',
				posts:posts,
			});
		});	
	});

	app.get('/reg',checkNotLogin);
	app.get('/reg', function(req, res) {
		res.render('reg', {
		title: '用户注册',
		});
	});

	app.post('/reg',checkNotLogin);
	app.post('/reg',function(req,res){
		//check the password!
		if (req.body['password-repeat']!=req.body['password']) {
			req.flash('error',"the repeat-password is wrong!");
			return res.redirect('/reg');
		};
		//生成口令的散列值
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		var newUser = new User({
			name: req.body.username,
			password: password,
		});
		//检查用户名是否已经存在
		User.get(newUser.name, function(err, user) {
			if (user)  err = 'Username already exists.';
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			//如果不存在则新增用户
			newUser.save(function(err) {
				if (err) {
			         	          req.flash('error', err);
				          return res.redirect('/reg');
				}
				req.session.user = newUser;
				req.flash('success', '注册成功');
				res.redirect('/');
			});
		});
	});

	app.get('/login',checkNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
		title:"用户登录",
		});
	});

	app.post('/login',checkNotLogin);
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('base64');

		User.get(req.body.username,function(err,user){
			if(!user){
				req.flash('error',"user is not exsit");
				return res.redirect('/login');
			}
			if(user.password!==password){
				req.flash('error',"the password is wrong!")
				return res.redirect('/login');
			}
			req.session.user=user;
			req.flash('success',"login sucess!");
			res.redirect('/');
		});
	});

	app.post('/post',checkLogin);
	app.post('/post',function(req,res){
		var currentUser=req.session.user;
		var post=new Post(currentUser.name,req.body.post);
		post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
			}
		req.flash('success', '发表成功');
		res.redirect('/u/' + currentUser.name);
		});
	});

	app.get('/u/:user',function(req,res){
		User.get(req.params.user,function(err,user){
			if (!user) {
				req.flash("error","用户不存在!");
				return res.redirect('/');
			};
			Post.get(user.name,function(err,posts){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				res.render('user',{
					title:user.name,
					posts:posts,
				});
			});
		});
	});

	app.get('/logout', checkLogin);
	app.get('/logout',function(req,res){
		req.session.user=null;
		req.flash('success',"登出成功");
		res.redirect('/');
	});

	app.get('/ajax/',function(req,res){
		var username = url.parse(req.url,true).query.user;
		 User.get(username,function(err,user){	 	
		 	if (!user) {
		 		res.send({"exit":false});
		 	}else{
		 		res.send({"exit":true});
		 	}
		 });
	});

	function checkLogin(req,res,next){
		if (!req.session.user) {
			req.flash("error","未登入");
			return res.redirect('/login');
		};
		next();
	}
	function checkNotLogin(req,res,next){
		if (req.session.user) {
			req.flash("error","已登入");
			return res.redirect('/');
		};
		next();
	}


};





