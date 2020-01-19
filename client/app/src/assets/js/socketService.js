import openSocket from 'socket.io-client';
import {sendTransaction} from 'assets/js/IOTA'
import {showZones} from 'views/GoogleMapsContainer'

var socket;
var dashboard;

export const Run = ()=>{
    const URL = "http://25.8.242.4:4000"
    socket = openSocket(URL);
    getPosition()
    //update position every 20s
    setInterval(getPosition, 10000);

    socket.on('pay', (price)=>{
        sendTransaction(price)
        console.log("PAY NOWW")
    })
}

export const GetRoads = async ()=>{
    socket.emit('getRoads', (geoJSON)=>{
        window.mapComponent.loadGeoJson(geoJSON);
    })
}


function getPosition(){
    
    navigator.geolocation.getCurrentPosition(emitPosition);
}
function emitPosition(position){
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    socket.emit('checkCoords', long, lat, (price, totalPayment, name) => {
        price = price < 0 ? 0 : price;
        name = name == "" ? "No zone" : name;
        var event = new CustomEvent('update', {detail: {price: parseInt(price), total: parseInt(totalPayment), lat: lat, long: long, zone: name}});
        document.getElementById("content").dispatchEvent(event);
        console.log(price + ' - ' + totalPayment)
    })
}

