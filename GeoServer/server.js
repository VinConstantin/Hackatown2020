var express = require('express')
var app =  express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var inside = require('point-in-geopolygon');
var fs = require('fs') 

var clients = new Map()
clients.set('a', {lng: -73.67294311523438, lat: 45.49672163945861})
clients.set('b', {lng: -73.76546859741211, lat: 45.44950396438697})


var roadData = fs.readFileSync(__dirname + '/test.geojson')

app.use(express.static(__dirname + '/client'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' connected');

    socket.on('checkCoords', function(lng, lat) {
        clients.set(socket.id, {lat: lat, lng: lng})
        var map = JSON.parse(roadData)
        var feature = inside.feature(map, [lng, lat])
        
        if (feature != -1) {
            socket.emit('tollRoad', feature.properties.cost)
        } else {
            socket.emit('offToll')
        }
    });

    socket.on('getCoords', (cb) => {
        let temp = []
        clients.forEach((val, key, clients) => {
            temp.push(val)
        })
        cb(temp)
    })



    socket.on('disconnect', () => {
        console.log('socket ' + socket.id + ' left')
        clients.delete(socket.id)
    });
});



