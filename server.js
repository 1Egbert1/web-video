var express =require('express')
const app=express('app')
const bodyParser=require('body-parser')
const urlencodedParser=bodyParser.urlencoded({extended:false})
const cookieParser=require('cookie-parser')
const MongoControl=require('./tools/databasecontrol').MongoControl
const page=new MongoControl('blog','page')
const comment=new MongoControl('blog','comment')
const ejs=require('ejs')
var fs=require('fs');
const moment =require('moment')
app.use(cookieParser())
app.use(express.static('./static',{index:false}))
app.use('/admin',express.static('./static',{index:false}))
app.use('/admin',require('./admin'))
app.get('/',function(req,res){
    fs.readFile('./static/index.html',{encoding:'utf-8'},function(err,data){
        res.send(data)
    })
})
// app.get('/',function(req,res){
//     page.find({},function(err,data){
//         ejs.renderFile('./ejs-tpl/message.ejs',{data:data},function(error,html){
//             res.send(html)
//         })
//     })
// })
app.get('/p',function(req,res){
    var _id=req.query._id

    //查询文章
    page.findById(_id,function(err,result){
        if(result.length==0){
            res.status(404).send('没有找到')
            return 
        }
        //查询评论
        var data=result[0]
        comment.find({fid:_id},function(err,result){
              //渲染
        ejs.renderFile('./ejs-tpl/page.ejs',{data:data,comment:result},function(err,html){
            res.send(html)
        })
        })
    })
})
app.post('/submitComment',urlencodedParser,function(req,res){
    var _id=req.query._id
    var {email,content}=req.body
    if(!_id){
        res.send('不允许评论')
        return
    }
    if(!email||!content){
        res.send('提交为空')
        return
    }
    comment.insert(
        {
            fid:_id,
            author:email,
            content:content,
            date:moment().format('MMMM Do YYYY, h:mm:ss a'),

        },(err,result)=>{
            if(err){
                res.status(500).send('服务器被你玩坏了')
                return
            }
            res.redirect(
                '/p?_id='+_id
            )
        }
    )
})

app.listen(3301)