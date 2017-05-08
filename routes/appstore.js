var express = require('express');
var router = express.Router();
var url = require("url");
var qiniu = require("qiniu");
var fs = require("fs");
var upload = require('./fileupload');
var AppModel = require('../models/appmodel');

//列表页面
router.get('/', function(req, res, next) {
    
     res.render("appstore")
})

//获取所有版本接口
router.get('/getAllVersion',function(req, res, next){
	AppModel.find({},function(error,docs){
    	 if(!error){
    	   res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'}); //解决中文乱码的问题
           res.end(JSON.stringify(docs));
    	 }
    }).limit(100).sort({time:-1}); //限制100行 倒序排列
});

//编辑某个版本

//删除某个版本


//获取已经存入数据库的所有app种类
router.get('/getAllApptypes',function(req, res, next){
	AppModel.find().distinct('whichapp',function(error,data){
		res.end(JSON.stringify(data));
	})
});

//上传页面
router.get('/create', function(req, res, next) {
    res.render('create');
})

//上传接口
router.post('/save', upload.single('files'), function(req, res, next) {

	if (req.file) {
		var appEntity = new AppModel({
			    files   : req.file.filename,
				version : req.body.version, 
				whichapp: req.body.whichapp,
				device  : req.body.device,
				remark  : req.body.remark
			}) ;

		appEntity.save(function (err, data) {
		  if (err){
		    console.log(err);
		  } else {
		    console.log('Saved : ', data );
		  }
		});
	}
     

});

module.exports = router;
