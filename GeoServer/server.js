var express = require('express')
var app =  express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var inside = require('point-in-geopolygon');
var fs = require('fs');
const { exec } = require('child_process');

let toPay = new Set()

let balance = 0
executePyota()
var clients = new Map()
//clients.set('a', {point: {lng: -73.67294311523438, lat: 45.49672163945861}, cost: 1, time: 2})
//clients.set('b', {point: {lng: -73.76546859741211, lat: 45.44950396438697}, cost: 3, time: 4})


var roadData = fs.readFileSync(__dirname + '/test.geojson')

app.use(express.static(__dirname + '/client'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html')
});

app.get('/features', function(req, res) {
    res.sendFile(__dirname + '/client/page2.html')
});

http.listen(4000, function() {
    console.log('listening on *:4000');
});

io.on('connection', function(socket) {
    console.log('socket ' + socket.id + ' connected');

    socket.on('checkCoords', function(lng, lat, cb) {
        if (!clients.has(socket.id)) {
            clients.set(socket.id, {point: {lng: 0, lat: 0}, cost: 0, time: 0, total: 0})
        }
        clients.get(socket.id).point = {lng: lng, lat: lat};
        var map = JSON.parse(roadData)
        var feature = inside.feature(map, [lng, lat])
        if (feature != -1) {
            toPay.add(socket.id)
            clients.get(socket.id).cost = feature.properties.cost
        }
        cb(feature == -1 ? -1 : feature.properties.cost, clients.get(socket.id).total)
        io.sockets.in('admins').emit('updateMap', socket.id, lng, lat);
    });

    socket.on('getClients', (cb) => {
        cb(Array.from(clients))
    })

    socket.on('getRoads', (cb) => {
        cb(roadData.toString('utf8'))
    })

    socket.on('getBalance', (cb) => {
        cb(balance)
    })

    socket.on('joinAdmin', () => {
        socket.join('admins')
    })

    socket.on('disconnect', () => {
        console.log('socket ' + socket.id + ' left')
        socket.leaveAll()
        io.sockets.in('admins').emit('clientQuit', socket.id)
        clients.delete(socket.id)
    });
});

setInterval(() => {
    clients.forEach((val, key) => {
        val.time += 1
    })
    console.log(toPay)
    toPay.forEach((id) => {
        if (io.sockets.connected[id] != undefined) {
            io.sockets.connected[id].emit('pay', clients.get(id).cost)
            clients.get(id).total += clients.get(id).cost
        }
    })
    toPay.clear()
    executePyota()
}, 60000)

function executePyota() {
    exec('python ../pyota/check_iota-balance.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        
        let response = JSON.parse(stdout)
        balance = response.balances[0]
    })
}