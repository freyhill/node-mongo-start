var express = require('express');
var router = express.Router();
var url = require("url");
var qiniu = require("qiniu");
var fs = require("fs");
var upload = require('./fileupload');
var AppModel = require('../models/appmodel');

var date = new Date();
var time = {
  date: date,
  year : date.getFullYear(),
  month : date.getFullYear() + "-" + (date.getMonth() + 1),
  day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
  minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
  date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
}


//查询所有列表页面

router.get('/', function(req, res, next) {

	AppModel.find({},function(error,docs){
    	 if(!error){
    	    res.render('appstore',{data:docs});
    	 }
    }).limit(100).sort({_id:-1}); //限制100行 _id:-1 倒序排列
})


//增加版本页面

router.get('/create', function(req, res, next) {
    res.render('create');
}) 

//删除某个版本
router.get('/delete',function(req, res, next){

	var id = req.query.id;
	AppModel.remove({"_id":id},function(err,docs){
		console.log(err);
		if(!err){
			res.redirect('/appstore');
		}
	})

});

//编辑某个版本页面
router.get('/edit/:id',function(req, res, next){
	var id = req.params.id;
	AppModel.find({"_id":id},function(error,docs){
    	 if(!error){
    	 	console.log(docs);
    	 	console.log(docs[0].version);
    	    res.render('edit',{data:docs});
    	 }
    }); //限制100行 _id:-1 倒序排列
	
});

//编辑某个版本接口
router.post('/edit/:id',upload.single('files'),function(req, res, next){
	var id = req.params.id;
	var files ;
    if (req.file) {
    	files = req.file.filename;
    }else{
    	files = req.body.files_no_change;
    }
	var updatedata = {
			    files   : files,
				version : req.body.version, 
				whichapp: req.body.whichapp,
				device  : req.body.device,
				remark  : req.body.remark,
				time: time.minute
			};
			console.log(updatedata);
	AppModel.update({"_id":id},{$set:updatedata},function(err,docs){
		console.log(docs);
		console.log(err);
		if(!err){
			res.redirect('/appstore');
		}
	})

});



//获取已经存入数据库的所有app种类
router.get('/getAllApptypes',function(req, res, next){
	AppModel.find().distinct('whichapp',function(error,data){
		res.end(JSON.stringify(data));
	})
});



//获取所有版本接口
router.get('/getAllVersion',function(req, res, next){
	AppModel.find({},function(error,docs){
    	 if(!error){
    	   res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'}); //解决中文乱码的问题
           res.end(JSON.stringify(docs));
    	 }
    }).limit(100).sort({time:-1}); //限制100行 倒序排列
});

//上传接口
router.post('/save', upload.single('files'), function(req, res, next) {

	if (req.file) {
		var appEntity = new AppModel({
			    files   : req.file.filename,
				version : req.body.version, 
				whichapp: req.body.whichapp,
				device  : req.body.device,
				remark  : req.body.remark,
				time: time.minute
			}) ;

		appEntity.save(function (err, data) {
		  if (err){
		    console.log(err);
		    res.redirect('/appstore');
		  } else {
		  	res.redirect('/appstore');
		    console.log('Saved : ', data );
		  }
		});
	}
     

});


//用户下载页面(某个类型app的某个端的某个版本)
router.get('/download/:type/:device/:version',function(req, res, next){

	var params = req.params;
 	console.log(params);
 	//这个用于浏览某个具体的版本 开发可用
	if(params.type && params.device && params.version ){
	 	
	 	AppModel.find({"whichapp":params.type},function(error,docs){
    	 if(!error){
    	    console.log(docs);
           res.render('download',{data:docs});
    	 }
    	}).limit(1).sort({time:-1}); //限制100行 倒序排列
	 }



});


//这个用于站外下载最新版本
router.get('/download/:type/:device',function(req, res, next){
	var params = req.params;
  
	AppModel.find({"whichapp":params.type,"device":params.device},function(error,docs){
	 if(!error){
	 	res.end(JSON.stringify(docs));
	 }
	}).sort({version:-1}).limit(1); 
 	 
	
	 
});

router.get('/download/:type',function(req, res, next){
	var params = req.params;
 	res.render('download');
 	 
	 
});


module.exports = router;
