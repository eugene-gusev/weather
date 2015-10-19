/**
 * Created by eugenegusev on 08.10.15.
 */
var xml2js = require('xml2js');
var http= require("http");
var mysql = require("mysql");

var cities = [{id:27459},{id:27612},{id:26063}];

var con = mysql.createConnection({
    host: "localhost",
    user: "eugene",
    password: "some_pass",
    database: "weather"
});

function loadAndUpdate() {
    cities.forEach(function (city) {
        http.get("http://export.yandex.ru/weather-ng/forecasts/" + city.id + ".xml", function (res) {
            var xml = '';

            res.on('data', function (chunk) {
                xml += chunk;
            });

            res.on('error', function (err) {
                console.log("there was a trouble " + err.message);
            });

            res.on('end', function () {
                var temp,
                    counter,
                    namesOfFields = ["weather_type", "temperature", "picture", "humidity", "wind", "pressure"];
                xml2js.parseString(xml, function (err, result) {
                    temp = result.forecast.fact[0];
                });
                city.weather_type = temp.weather_type[0];             //описание погоды
                city.temperature = temp.temperature[0]["_"];         //градус
                city.picture = temp["image-v3"][0]["_"];         //название картинки
                city.humidity = temp.humidity[0];                 //влажность
                city.wind = temp.wind_speed[0];               //скорость ветра
                city.pressure = temp.pressure[0]["_"];            //давление

                for (counter = 0; counter < namesOfFields.length; counter++) {    //обновляем все поля в таблице
                    con.query('update info set ' + namesOfFields[counter] + ' = ? where id_city = ?',
                        [city[namesOfFields[counter]], city.id], function (err) {
                            if (err) console.log(err.message);
                        });
                }
            });
        });
    });
}

module.exports = loadAndUpdate;