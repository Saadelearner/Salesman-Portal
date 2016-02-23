/**
 * Created by ALI COM on 1/30/2016.
 */
var express = require('express');
var server= require('http');
var path= require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app= express();

var	publicPath	=	path.resolve(__dirname,	"www");
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.get('/', function(req,res){
    console.log(publicPath);
    res.sendFile("./www/index.html", { root: __dirname });
});
mongoose.connect('mongodb://localhost/salesdb');


var salemanschema=new mongoose.Schema({
    username:String,
    useremail: { type: String, required: true },
    userpassword: { type: String, required: true },
    comid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'company' }]
});
var companyschema = new mongoose.Schema({
    companyname    : String
    , Email     : String,
    user : [{ type: mongoose.Schema.Types.ObjectId, ref: 'salesman' }],
    product : [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }]


});
var productschema = new mongoose.Schema({
    productname    : { type: String, required: true }
    , quantity     : { type: Number, required: true },
    orderdate:{ type: Date, default: Date.now },
    deldate:{ type: Date, required: true },
    address:{ type: String, required: true },
    salesmanid:{type: mongoose.Schema.Types.ObjectId ,ref:salesman},
    salesmanname:{type:String,required:true},
    latpos:{type: Number,required:true},
    longpos:{type: Number,required:true},
    company : [{ type: mongoose.Schema.Types.ObjectId, ref: 'company' }]
});
var salesman=mongoose.model('salesman',salemanschema);
var company=mongoose.model('company',companyschema);
var product=mongoose.model('product',productschema);


app.post('/home', function(req, res){

    new company({
        companyname:req.body.companyname,
        Email:req.body.companyemail

    }).save(function(err,doc){

            if(err)
                res.json(err);

            company.find({},function(err,company){
                if(!err){

                   // console.log(company);
                    res.json(company);

                }
            });
            //      else res.send(company);

        })


});

//salesman.findOne({''},function(err,company){
//    if(!err){
//
//        console.log(company);
//
//
//    }
//});

app.post('/dash', function(req, res) {

    salesman.findOne({
        useremail:req.body.useremail,
        userpassword:req.body.userpassword

    }).populate('comid').exec(function(err,salesman){
        if(err) throw err;
        if(!salesman){
            console.log("email and password doesnot match");
            return res.json(404);
        }

        else{
            console.log("login Successfully with id"+salesman._id);
         //   console.log("-----------------------------"+salesman);

            return res.status(200).json(salesman);

        }
    });


});
salesman.find({},function(err,user){
    if(!err){

//console.log("----------user------"+user);


    }
});
app.post('/main', function(req, res) {


});
app.get('/companydetail',function(req,res){
    company.find({},function(err,company){
        if(!err){

//console.log(company);
            res.json(company);

        }
    });
});

app.post('/user',function(req,res){
    new salesman({
        username: req.body.username,
        useremail: req.body.useremail,
        userpassword:req.body.userpassword,
        comid:req.body.comid

    }).save(function(err,doc){

            if(err){
                res.json(err);
                //  console.log("-----------err----------"+err);
            }else{
//console.log("-----------doc----------"+doc);
                company.findByIdAndUpdate(
                    req.body.comid,
                    {$push: {user: doc._id}},
                    {safe: true, upsert: true, new : true},
                    function(err, user) {
                        if(err)
                            console.log(err);
                        else
                        //      console.log("------doc------"+user);
                            company.find({},function(err,company){
                                if(!err){

                                    // console.log(company);
                                    res.json(company);

                                }
                            });


                    }
                );   //    }  else res.send(company);
            }
        })


});
// return company with users
app.post('/viewuser',function(req,res) {
  company.findById(req.body.comid).populate('user')

        .find({}, function (err, company) {
            if (!err) {
                res.json(company.comid);
            }
        });
});
// save order details in product schema
app.post('/account',function(req,res){
    console.log("===product name==="+req.body.productname)
    new product({
        productname    : req.body.productname,
        quantity       : req.body.quantity,
        deldate        :req.body.deldate,
        address        :req.body.address,
        salesmanid     :req.body.salesmanid,
        salesmanname   :req.body.salesmanname,
        latpos         :req.body.latpos,
        longpos        :req.body.longpos,
        company        :req.body.company

    }).save(function(err,doc){

            if(err){
                res.json(err);
                console.log("-----------err----------"+err);
            }else{
console.log("-----------doc----------"+doc);
                company.findByIdAndUpdate(
                    req.body.company,
                    {$push: {product: doc._id}},
                    {safe: true, upsert: true, new : true},
                    function(err, user) {
                        if(err)
                            console.log(err);
                        else
                        //      console.log("------doc------"+user);
                            company.find({},function(err,company){
                                if(!err){

                                    console.log("------products-----"+company);
                                    //res.json(company);

                                }
                            });


                    }
                );   //    }  else res.send(company);
            }
        })

    // console.log("--------username------"+company);




    //console.log("-----company----"+user);
//        var doc = new company({
//            user:{username:req.body.username,
//                useremail:req.body.useremail,
//                userpassword: req.body.userpassword}
//        });
//
//  user.$push(doc);

    // console.log("----------doc----------"+doc);


});


app.listen(9000);
console.log("Server Running on port 9000");