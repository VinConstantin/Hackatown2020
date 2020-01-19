var map;
//var jsonFile = "google.json";
var saveBtn = document.getElementById("saveBtn");
var deleteBtn = document.getElementById("deleteBtn");
var zoneName = document.getElementById("zoneName");
var zoneType = document.getElementById("zoneType");
var zoneCost = document.getElementById("zoneCost");
var curSelect;

const socket = io()

var pieData = {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [
            'DarkGrey',
            'HotPink',
            'LightGrey',
        ],
        hoverBackgroundColor : 'rgba(0,0,0,0.4)'
    }],
    labels: [
        'Roads',
        'Parking',
        'Other'
    ]
};

var ctx = document.getElementById('myChart').getContext('2d');
var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: pieData
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 45.45, lng: -73.45} 
    });

    socket.emit('getRoads', (geoJSON) => {
        let features = map.data.addGeoJson(JSON.parse(geoJSON));
        features.forEach((feature) => {
            if (feature.getProperty('type') == "road")
                map.data.overrideStyle(feature, {fillColor: 'DarkGray', strokeColor: 'DarkGray'})
            else if (feature.getProperty('type') == "parking")
                map.data.overrideStyle(feature, {fillColor: 'HotPink', strokeColor: 'HotPink'})
        })
        updatePie()
    })


    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon']
        }
    });
    drawingManager.setMap(map);
    drawingManager.setDrawingMode(null);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        map.data.add(new google.maps.Data.Feature({
            geometry: new google.maps.Data.Polygon([event.overlay.getPath().getArray()])
        }));
        drawingManager.setDrawingMode(null);
        event.overlay.setMap(null);
    });

    map.data.addListener('click', function(event) {
        if (curSelect != undefined) {
            map.data.overrideStyle(curSelect, {editable: false, draggable: false});
        }
        //map.data.revertStyle();
        map.data.overrideStyle(event.feature, 
            {editable: 'true', draggable: 'true'});
        zoneName.disabled = false;
        zoneType.disabled = false;
        zoneCost.disabled = false;
        curSelect = event.feature;
        console.log(curSelect);
        if (curSelect.h.hasOwnProperty("name")) {
            zoneName.value = curSelect.h.name;
        } else {
            zoneName.value = '';
        }
        if (curSelect.h.hasOwnProperty("type")) {
            zoneType.value = curSelect.h.type;
        } else {
            zoneType.value = '';
        }
        if (curSelect.h.hasOwnProperty("cost")) {
            zoneCost.value = curSelect.h.cost;
        }   else {
            zoneCost.value = '';
        }
    });
}

zoneName.onchange = function () {
    console.log(curSelect.h.name);
    curSelect.h.name = zoneName.value;
}
zoneType.onchange = function () {
    curSelect.h.type = zoneType.value;
    updatePie()
}
zoneCost.onchange = function () {
    curSelect.h.cost = zoneCost.value;
}
deleteBtn.onclick = function () {
    map.data.remove(curSelect);
    updatePie()
}
saveBtn.onclick = function () {
    var geoOut;
    map.data.toGeoJson((obj) => {
        console.log(JSON.stringify(obj))
        socket.emit('saveGeo', JSON.stringify(obj))
    });
}

function updatePie() {
    console.log(map.data)
    dataArray = [0,0,0]
    map.data.forEach(function(feature){
        tType = feature.getProperty("type")
        if (tType == "road") {dataArray[0]++}
        else if (tType == "parking") {dataArray[1]++}
        else {dataArray[2]++}
    })
    myDoughnutChart.data.datasets[0].data = dataArray;
    myDoughnutChart.update();
}