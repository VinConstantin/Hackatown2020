

const socket = io();

socket.emit('joinAdmin');

socket.emit('getBalance', (bal) => {
    document.getElementById('totalIota').innerHTML = bal;
    document.getElementById('totalDollars').innerHTML = (bal * 0.323831).toFixed(2);
})

socket.emit('getUserOnline', (nUsers) => {
    document.getElementById('usersOnline').innerHTML = nUsers;
})

socket.on('balance', (bal) => {
    document.getElementById('totalIota').innerHTML = bal;
    document.getElementById('totalDollars').innerHTML = (bal * 0.323831).toFixed(2);
})

socket.on('userOnline', (nUsers) => {
    document.getElementById('usersOnline').innerHTML = nUsers;
})