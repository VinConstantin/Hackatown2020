/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col ,  
  CardFooter,
  CardTitle,} from "reactstrap";

const MapWrapper = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 40.748817, lng: -73.985428 }}
      defaultOptions={{
        scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
        
      }}
    >
      <Marker position={{ lat: 40.748817, lng: -73.985428 }} />
    </GoogleMap>
  ))
);

class Map extends React.Component {
  state = {
    time: 0
  }

  constructor(){
    super();
    window.mapComponent = this;
  }
  
  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }
    
  tick() {
    this.timer = setInterval(() => this.setState({
      time: this.state.time + 1
    }), 1000)
  }

  update(){
    console.log("resettime")
    this.setState({time: 0})
  }
  render() {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle tag="h5">Curent position</CardTitle>
            <p className="card-category">Your position in real time</p>
          </CardHeader>
          <CardBody>
            <div id="map"
                className="map"
                style={{ position: "relative", overflow: "hidden" }} >
                <MapWrapper
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key= - AIzaSyCLMM_sm9suvkQ5FfHhyjd6R7mhpnHZrNk"
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={<div style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="fa fa-history" /> Updated {this.state.time} seconds ago
            </div>
          </CardFooter>
        </Card>
      </>
    );
  }
}

export default Map;
