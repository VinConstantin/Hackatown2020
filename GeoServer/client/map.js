

const socket = io()

function initMap() {
    let center = {lat: 0, lng: 0};
    socket.emit('getCoords', (points) => {
        console.log(points)
        points.forEach(point => {
            center.lat += point.lat;
            center.lng += point.lng;
        })
        center.lat /= points.length;
        center.lng /= points.length;

        var map = new google.maps.Map(document.getElementById('map'), {zoom: 6, center: center});
        points.forEach(point => {
            var marker = new google.maps.Marker({position: point, icon: 'car.png', map: map});
        })
        
    })
}
  