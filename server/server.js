const express = require('express')
const app = express()
const port = 4000
app.get('/', (req, res) => { res.send('Hello server ...');
});
app.listen(port, () => {
console.log(`Server is running on port ${port}`) })

const mongoose = require('mongoose');
const uriCompass = "mongodb://localhost:27017/info" 
const uriAtlas = "mongodb://localhost:27017"
mongoose.connect(uriAtlas).then(()=> console.log("successful connexion DB"));
