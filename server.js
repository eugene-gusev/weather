/**
 * Created by eugenegusev on 15.10.15.
 */
var update = require("./update");
var http = require("http");
var express = require("express");
var mysql = require("mysql");

var app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "eugene",
    password: "some_pass",
    database: "weather"
});

setInterval(function() {update()},300000);        //обновление информации в базе каждые 5 минут

app.get('/:id', function (req, res) {               //обработка запроса погоды по id города
    con.query("select * from info where id_city=?",req.params.id, function (err,inf) {
        if (err) console.log(err);
        res.send(inf);
    });
});

app.listen(3000);

