

const socket = io()
let map;
let markers = new Map()

socket.emit('joinAdmin');
socket.on('updateMap', (id, lng, lat) => {
    if (markers.has(id)) {
        markers.get(id).setPosition({lat: lat, lng: lng})
    }
    else {
        socket.emit('getClients', (clients) => {
            updateClients(clients)
        })
    }
})

function updateClients(clients) {
    clients.forEach(client => {
        var image = {
            url: 'car.png',
            anchor: new google.maps.Point(8, 8)
          };
        
        var marker = new google.maps.Marker({position: client[1].point, icon: image, map: map});
        markers.set(client[0], marker)
        let date = new Date(client[1].time * 60000)
        var contentString = `
        <h2>${client[0]}</h2>
        <table style="width:100%">
            <tr>
                <th style="text-align: left;">Total cost: </th>
                <th style="text-align: right;">${client[1].total}</th>
            </tr>
            <tr>
                <th style="text-align: left;">Time: </th>
                <th style="text-align: right;">${date.getUTCHours().toString().padStart(2, '0') + 'h' + date.getUTCMinutes().toString().padStart(2, '0')}</th>
            </tr>
        </table>`;

        var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });            
    })
}

function initMap() {
    socket.emit('getClients', (clients) => {
        let center = {lat: 0, lng: 0};
        console.log(clients)
        clients.forEach(client => {
            center.lat += client[1].point.lat;
            center.lng += client[1].point.lng;
        })
        center.lat /= clients.length;
        center.lng /= clients.length;

        map = new google.maps.Map(document.getElementById('map'), {zoom: 6, center: center});
        updateClients(clients)
    })
    socket.emit('getRoads', (geoJSON) => {
        let features = map.data.addGeoJson(JSON.parse(geoJSON))
        features.forEach((feature) => {
            map.data.overrideStyle(feature, {fillColor: 'DarkGray', strokeColor: 'DarkGray'})
        })
    })
    socket.emit('getBalance', (bal) => {
        document.getElementById('balance').innerHTML = bal;
    })
}
  