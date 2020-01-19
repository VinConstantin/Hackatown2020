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


var roadData = JSON.parse(fs.readFileSync(__dirname + '/test.geojson').toString('utf8'))

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
            io.in('admins').emit('userOnline', clients.size);
        }
        clients.get(socket.id).point = {lng: lng, lat: lat};
        var map = roadData
        var feature = inside.feature(map, [lng, lat])
        if (feature != -1) {
            toPay.add(socket.id)
            clients.get(socket.id).cost = parseInt(feature.properties.cost)
            io.in('admins').emit('userType', [toPay.size, clients.size - toPay.size])
        }
        cb(feature == -1 ? -1 : feature.properties.cost, clients.get(socket.id).total, feature == -1 ? "": feature.properties.name)
        io.sockets.in('admins').emit('updateMap', socket.id, lng, lat);
    });

    socket.on('getUserOnline', (cb) => {
        cb(clients.size);
    })

    socket.on('getClients', (cb) => {
        cb(Array.from(clients))
    })

    socket.on('getRoads', (cb) => {
        cb(JSON.stringify(roadData))
    })

    socket.on('getBalance', (cb) => {
        cb(balance)
    })

    socket.on('joinAdmin', () => {
        socket.join('admins')
        io.in('admins').emit('userType', [toPay.size, clients.size - toPay.size])
    })

    socket.on('saveGeo', (data) => {
        const newGeo = JSON.parse(data);
        roadData = newGeo;
        fs.writeFileSync(__dirname + '/test.geojson', JSON.stringify(newGeo))
    })

    socket.on('disconnect', () => {
        console.log('socket ' + socket.id + ' left')
        socket.leaveAll()
        io.sockets.in('admins').emit('clientQuit', socket.id)
        io.in('admins').emit('userOnline', clients.size);
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
        io.in('admins').emit('balance', balance);
    })
}