

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

var ctx = document.getElementById('myPieChart').getContext('2d');
var pieConfig = {
    type: 'pie',
    data: {
        datasets: [{
            data: [1, 0],
            backgroundColor: [
                "#FF0000",
                "#FFA500"
            ],
            label: 'Dataset 1'
        }],
        labels: [
            'Paying zone',
            'Non-paying zone'
        ]
    },
    options: {
        responsive: true
    }
};
var pie = new Chart(ctx, pieConfig);
var time = 0;
var lineConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Canadian dollars',
            backgroundColor: "#FF0000",
            borderColor: "#FF0000",
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Amount($)'
                }
            }]
        }
    }
};
var lineCtx = document.getElementById('myAreaChart').getContext('2d');
var myLine = new Chart(lineCtx, lineConfig);


socket.on('userType', (uT) => {
    pie.data.datasets[0].data = uT 
    pie.update();
})

setInterval(() => {
    myLine.data.datasets[0].data.push(parseFloat(document.getElementById('totalDollars').innerHTML))
    myLine.data.labels.push(time++)
    myLine.update()
}, 5000)