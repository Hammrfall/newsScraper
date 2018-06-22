var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

  title: {
    type: String,
    unique : true, 
    required : true, 
    dropDups: true 
  },

  link: {
    type: String,
    unique : true, 
    required : true, 
    dropDups: true 
  },

  summary: {
    type: String,
    required: false, 
  },

  note: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
