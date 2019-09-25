const express = require('express');
const router = express.Router();
const TaskUser = require('../models/user');

router.get('/users', function (req, res, next) {
    TaskUser.find({}).then(function (users) {
        res.send(users);
    });
});

router.post('/user', function (req, res, next) {
    TaskUser.create(req.body).then(function (user) {
        res.send({msg:"User Added successfully"});
    }).catch(next);
});

router.put('/user/:id', function (req, res, next) {
    TaskUser.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        TaskUser.findOne({ _id: req.params.id }).then(function (user) {
            res.send({msg:"User updated successfully"});
        });
    }).catch(next);
});

router.delete('/user/:id', function (req, res, next) {
    TaskUser.findByIdAndRemove({ _id: req.params.id }).then(function (user) {
        res.send({msg:"User deleted successfully"});
    }).catch(next);
});

module.exports = router;
