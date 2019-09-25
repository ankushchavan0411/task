express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')

const app = express();
app.use(cors())

// connect to mongodb
mongoose.connect('mongodb://localhost/userDB');
app.use(bodyParser.json());
 

// initialize routes
app.use('/api', require('./routes/api'));

// error handling 
app.use(function (err, req, res, next) {
    console.log(err);
    res.send({ msg: "Something went wrong, please try again later" });
});

// listen for requests
app.listen(process.env.port || 3019, function () {
    console.log('server start on 3019');
});
