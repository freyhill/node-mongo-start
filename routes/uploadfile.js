
var express = require('express');
var router = express.Router();
var url = require("url");
var qiniu = require("qiniu");
var fs = require("fs");
var upload = require('./fileupload');
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'ad-5LqieYzV0jY0_TUgLFQoZ6FbVW0zAqYmETJQC';
qiniu.conf.SECRET_KEY = 'n4ptxxdHqi6C6wUlKuujEmnuZSrAVzuGVUU-hQJh';

//要上传的空间
bucket = 'leinovpic';

//上传页面
router.get('/',function(req, res, next){
   res.render('uploadfile');
})

//上传接口
router.post('/upload', upload.single('avatar'), function (req, res, next) {
    if (req.file) {
       console.log(req.file.filename); 
       console.log(req.body.name); 
       console.log(req.body.version);            
        res.render('uploadfile');
         
    }
});

module.exports = router;
 
