const MongoControl=require('./tools/databasecontrol').MongoControl
const page=new MongoControl('blog','page')
const comment=new MongoControl('blog','comment')
const moment =require('moment')
var getDateStr=function(dataObj){

}
// page.insert(
//     {
//         sort:'JS',
//         title:'JS',
//         author:'Egbert',
//         date:moment().format('MMMM Do YYYY, h:mm:ss a'),
//         content:'今天新买的书到了',
//         intro:'这是我写的第一篇文章'
//     },
//     ()=>{}
// )
comment.insert(
    {
        fid:'5ed74d86b49d061a64b4d605',
        content:'想看',
        author:'1111@qq.com',
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
    }, ()=>{}
)