const { Schema, model } =require('mongoose')

const stockSchema = new Schema({
  name:String,
  symbol:String,
  code: String,
  rate: Number,
  stockCode:String
},{timestamps:true});

const Stock = model('Stock', stockSchema);

module.exports = Stock;