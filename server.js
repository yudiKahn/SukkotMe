const mongoose = require('mongoose');
const express  = require('express');
const path     = require('path');
const app = express();
require('dotenv').config();

//force https
app.use((req,res,next)=>{
    if(!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production'){
        return res.redirect('https://' + req.get('host') + req.url);
    }
    return next();
});

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
        .then(() => console.log('connection to db established...'))
        .catch(er => console.log(`connection to db faild. Error: ${er}`));

app.use(express.json({ extended: false }));

app.use('/api/users',  require('./routs_api/users'));
app.use('/api/orders', require('./routs_api/orders'));
app.use('/api/items', require('./routs_api/items'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const listener = app.listen(process.env.PORT || 8000, ()=>{
    if(process.env.NODE_ENV !== 'production'){
        require('dns').lookup(require('os').hostname(), (er,ad,fa)=>{
            console.log(`backend runing on http://${ad}:${listener.address().port}`);
        });
    }
});