const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('connected to db...'))
        .catch((er)=>console.error(er));

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routs/users'));
app.use('/api/auth', require('./routs/auth'));
app.use('/api/profile', require('./routs/profile'));
app.use('/api/posts', require('./routs/posts'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const listener = app.listen(process.env.PORT||8000, ()=>{
    console.log(`Listening on port ${listener.address().port}`)
});