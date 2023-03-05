const path = require('path');  
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api  = require('./routes/api');

const app = express();

app.use(cors({
    origin : 'http://localhost:3000'
}));
app.use(morgan('short'));

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
//     res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//     next();
//   }) 

//json middleware
app.use(express.json());

//api versioning
app.use('/v1', api)

//static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

//serving the static files on the root route
app.get('/*', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = app;