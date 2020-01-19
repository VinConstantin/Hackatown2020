

const socket = io()
let map;

function initMap() {
    let center = {lat: 0, lng: 0};
    socket.emit('getClients', (clients) => {
        console.log(clients)
        clients.forEach(client => {
            center.lat += client[1].point.lat;
            center.lng += client[1].point.lng;
        })
        center.lat /= clients.length;
        center.lng /= clients.length;

        map = new google.maps.Map(document.getElementById('map'), {zoom: 6, center: center});
        clients.forEach(client => {
            var marker = new google.maps.Marker({position: client[1].point, icon: 'car.png', map: map});
            let date = new Date(client[1].time * 60000)
            var contentString = `
            <h2>${client[0]}</h2>
            <table style="width:100%">
                <tr>
                    <th style="text-align: left;">Total cost: </th>
                    <th style="text-align: right;">${client[1].cost}</th>
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
        socket.emit('getRoads', (geoJSON) => {
            let features = map.data.addGeoJson(JSON.parse(geoJSON))
            features.forEach((feature) => {
                map.data.overrideStyle(feature, {fillColor: 'DarkGray', strokeColor: 'DarkGray'})
            })
        })
        socket.emit('getBalance', (bal) => {
            document.getElementById('balance').innerHTML = bal;
        })
    })
}
  