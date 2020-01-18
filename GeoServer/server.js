var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var GeoJSON = require('geojson');
var inside = require('point-in-geopolygon');
var fs = require('fs') 

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('socket connected');
    socket.on('checkCoords', function(long, lat) {
        fs.readFile(__dirname + '/test.geojson', (err, data) => {
            var map = JSON.parse(data)
            console.log(inside.feature(map, [long, lat]))
        });
    });
});

