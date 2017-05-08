//创建schema
require('../config/mongo');
var mongoose = require("mongoose");

var AppSchema = new mongoose.Schema({
	files   :  {type : String },
	version :  {type : String },
	whichapp:  {type : String },
	device  :  {type : String },
	remark  :  {type : String },
	time	:  {type : Date , default: Date.now  }
})



module.exports = AppSchema;