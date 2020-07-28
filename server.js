'use strict'
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

const methodOverride = require('method-override');




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');
const client=new pg.Client(process.env.DATABASE_URL);

app.get('/',(req,res)=>{
let url = `https://official-joke-api.appspot.com/jokes/programming/ten`;
superagent.get(url)
.then(myData=>{
    let newData = myData.body;
    
    res.render('index',{newData:newData});
})

    // res.render('index');
})

app.post('/addfav',(req,res)=>{
    let {type,setup,punchline}= req.body;
    let SQL = `INSERT INTO joke (type,setup,punchline) VALUES ($1,$2,$3);`;
    let val = [type,setup,punchline];
    client.query(SQL,val)
    .then(()=>{
        res.redirect('/fav')
    })
    
})

app.get('/fav',(req,res)=>{
    let SQL = `SELECT * FROM joke;`;
    client.query(SQL)
    .then(myData=>{
        let newData = myData.rows;
        res.render('fav',{newData:newData});
    })
})

app.get('/fav/:id',(req,res)=>{
    let id = req.params.id;
    let SQL = `SELECT * FROM joke WHERE id=$1;`;
    let val = [id];
    client.query(SQL,val)
    .then(myData=>{
        let newData = myData.rows[0];
        console.log(newData)
        res.render('det',{newData:newData});
    })
})

app.put('/update',(req,res)=>{
   let {id,type,setup,punchline}=req.body;
   let SQL = `UPDATE joke SET type=$1 ,setup=$2 ,punchline=$3 WHERE id=$4;`
   let val = [type,setup,punchline,id];
   client.query(SQL,val)
   .then(()=>{
       res.redirect(`/fav/${id}`);
   })
})

app.delete('/delete',(req,res)=>{
    let id=req.body.id;
    let SQL = `DELETE FROM joke WHERE id=${id};`
    client.query(SQL)
    .then(()=>{
        res.redirect(`/fav`);
    })
})

app.get('/random',(req,res)=>{
let url = 'https://official-joke-api.appspot.com/jokes/programming/random';
superagent.get(url)
.then(myData=>{
    let newData = myData.body[0];
    res.render('random',{newData:newData});
})

})

app.get('*',(req,res)=>{
    res.status(404).json('this rout doesnt exist')
})

client.connect()
.then(()=>{
    app.listen(PORT,()=>console.log(`you listen to ${PORT}`))
})