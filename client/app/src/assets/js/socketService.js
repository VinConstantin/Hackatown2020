import openSocket from 'socket.io-client';

var socket;
var socket;
export const Run = ()=>{
    const URL = "http://localhost"
    socket = openSocket(URL);

    socket.on('tollRoad', (price) => {

    })
    socket.on('offToll', () => {
        
    })
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
    socket.emit('checkCoords',long,lat);
}

