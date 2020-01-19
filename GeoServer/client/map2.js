var map;
var jsonFile = "google.json";
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: -28, lng: 137}
    });

    map.data.loadGeoJson(jsonFile);

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
        map.data.toGeoJson(function(obj) {console.log(obj);});
    });

    map.data.addListener('click', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, 
            {editable: 'true', draggable: 'true'});
    });
}