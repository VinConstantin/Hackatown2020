import openSocket from 'socket.io-client';
import {sendTransaction} from 'assets/js/IOTA'

var socket;
var dashboard;

export const Run = ()=>{
    const URL = "http://25.8.242.4:4000"
    socket = openSocket(URL);
    getPosition()
    //update position every 20s
    setInterval(getPosition, 5000);

    socket.on('pay', (price)=>{
        console.log("PAY NOWW")
    })
}

function getPosition(){
    
    navigator.geolocation.getCurrentPosition(emitPosition);
}
function emitPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    socket.emit('checkCoords', long, lat, (price, totalPayment) => {
        
        var event = new CustomEvent('update', {detail: {price: price, total: totalPayment, lat: lat, long: long}});
        document.getElementById("content").dispatchEvent(event);
        console.log(price + ' - ' + totalPayment)
        //sendTransaction(price)
    })
}

