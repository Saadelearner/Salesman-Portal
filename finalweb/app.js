/**
 * Created by ALI COM on 2/4/2016.
 */
/**
 * Created by ALI COM on 2/3/2016.
 */
var express = require('express');
var server= require('http');
var path= require("path");
var bodyParser = require('body-parser');

var mongoose = require('mongoose');


var app= express();
var	publicPath=path.resolve(__dirname,"www");
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.get('/', function(req,res){
    console.log(publicPath);
    var path=path.resolve(__dirname,"./www/index.html");
    res.send(path);
    company.find({},function(err,company){
        if(!err){
            console.log(company);
            res.json(company);
        }
    });
});

mongoose.connect('mongodb://localhost/salesdb');

var adminschema=new mongoose.Schema({
    uemail: { type: String, required: true },
    upassword: { type: String, required: true }
});
var salemanschema=new mongoose.Schema({
    username:String,
    useremail: { type: String, required: true },
    userpassword: { type: String, required: true },
    comid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'company' }]
});
var companyschema = new mongoose.Schema({
    companyname    : String
    , Email     : String,
    companypwd :String,
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
var admin=mongoose.model('admin',adminschema);
var company=mongoose.model('company',companyschema);
var product=mongoose.model('product',productschema);

//save company
app.post('/home', function(req, res){
console.log("=========company pwd"+req.body.companypwd);
    new company({
        companyname:req.body.companyname,
        Email:req.body.companyemail,
        companypwd:req.body.companypwd

    }).save(function(err,doc){

            if(err)
                res.json(err);

            company.find({},function(err,company){
                if(!err){

                    console.log(company);
                    res.json(company);

                }
            });
               //      else res.send(company);

        })


});


//admin.find({},function(err,admin){
//    if(!err){
//
//        console.log(admin);
//
//
//    }
//});
//
//    new admin({
//        uemail:'saad',
//        upassword: '12'
//
//    }).save(function(err,doc){
//
//            if(err)
//                res.json(err);
//            else
//            console.log("---------admin-------"+doc);
//
//                   });


//login admin with username saad and password 12
app.post('/login', function(req, res) {
   admin.findOne({
       uemail:req.body.useremail,
       upassword:req.body.userpassword

   }).exec(function(err,user){
if(err) throw err;
       if(!user){
           console.log("email and password doesnot match");
           return res.json(404);
       }
       else{
           console.log("login Successfully with id"+user._id);
          return res.status(200).json(user);
       }
   });



});
// company administrator login
app.post('/comlogin', function(req, res) {
    company.findOne({
        Email:req.body.useremail,
        companypwd:req.body.userpassword

    }).populate("product").exec(function(err,user){
        if(err) throw err;
        if(!user){
            console.log("email and password doesnot match");
            return res.json(404);
        }
        else{
            console.log("company login Successfully with id"+user.companyname);
            return res.status(200).json(user);
        }
    });


});


//find all companies for admin
app.get('/companydetail',function(req,res){
    company.find({},function(err,company){
        if(!err){

//console.log(company);
            res.json(company);

        }
    });
});
//add salesman and push user id in company model
app.post('/user',function(req,res){
       new salesman({
        username: req.body.username,
        useremail: req.body.useremail,
        userpassword:req.body.userpassword,
           comid:req.body.comid

    }).save(function(err,doc){

            if(err){
                res.json(err);

            }else{

                company.findByIdAndUpdate(
                    req.body.comid,
                    {$push: {user: doc._id}},
                    {safe: true, upsert: true, new : true},
                    function(err, user) {
                        if(err)
                            console.log(err);
                        else
                        company.find({},function(err,company){
                            if(!err){


                                res.json(company);

                            }
                        });


                    }
                );
            }
        })

    });
//find selected company users
app.post('/viewuser',function(req,res) {


    company.findById(req.body.comid).populate('user')

        .find({}, function (err, company) {
            if (!err) {

               console.log("-------------------------------"+company);
                res.json(company);


            }
        });
});

app.listen(3000);
console.log("app is liestening");