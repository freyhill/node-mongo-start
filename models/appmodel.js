//创建model

var mongoose = require("mongoose");
var AppSchema = require("../schemas/appschema");
  
var AppModel  = mongoose.model('appstore',AppSchema);

module.exports = AppModel;