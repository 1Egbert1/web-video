var express =require('express')
var router=express.Router()
const bodyParser=require('body-parser')
const urlencodedParser=bodyParser.urlencoded({extended:false})
const moment =require('moment')
var MongoControl=require('./tools/databasecontrol').MongoControl
var path =require('path')
const CookieControl=require('./cookie')
var admin =new CookieControl()
const page=new MongoControl('blog','page')
///uploadPage
const token='1uiehdiq9hcancloapiq'
router.get('/',function(req,res){
    if(admin.checkToken(req.cookies.token)){
        res.sendFile(
            path.resolve('./static/admin.html')
        )
    }else{
        res.redirect('/admin/login')
    }
   
})
router.get('/login',function(req,res){
    res.sendFile(
        path.resolve('./static/login.html')
    )
})
router.post('/login',urlencodedParser,function(req,res){
    if(req.body.username=='admin' && req.body.password=='admin'){
        res.cookie('token',admin.getToken())
        res.redirect('/admin')
    }else{
        res.status(403).send('登陆失败')
    }
})
router.post('/uploadPage',urlencodedParser,function(req,res){
    if(admin.checkToken(req.cookies.token)){

    }else{
        res.status(403).send('没有权限')
        return
    }
    var {sort,title,author,content,intro}=req.body
    var now =moment().format('MMMM Do YYYY, h:mm:ss a')
    page.insert({
        sort:sort,
        title:title,
        author:author,
        content:content,
        intro:intro,
        date:now
    },()=>{
        res.send('文章发表成功')
        
    })
})

module.exports=router