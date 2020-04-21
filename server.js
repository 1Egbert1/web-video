var express=require('express');
var app=express();
var fs=require('fs');
app.use(express.static('./static',{indrx:false}))
app.get('/',function(req,res){
    fs.readFile('./index.html',{encoding:'utf-8'},function(err,data){
        res.send(data)
    })
})
app.listen(3000)