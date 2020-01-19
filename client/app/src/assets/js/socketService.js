import openSocket from 'socket.io-client';

var socket;
var dashboard;

export const Run = ()=>{
    const URL = "http://localhost:4000"
    socket = openSocket(URL);

    //update position every 30s
    setInterval(getPosition, 3000);
}

function getPosition(){
    
    navigator.geolocation.getCurrentPosition(emitPosition);
}
function emitPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(long +" , "+ lat)
    socket.emit('checkCoords', long, lat, (price) => {
        var event = new CustomEvent('update', { lat, long });
        document.getElementById("content").dispatchEvent(event);
        console.log(price)
    })
}

