

import React from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import GoogleMapsContainer from "./GoogleMapsContainer"
import {getBalance} from "assets/js/IOTA"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    window.dashboard = this;

    setTimeout(() => {
      getBalance();
    }, 1000);
    
  }

  state = {
    currentPrice: 0,
    totalPrice: 0,
    balance: 0,
    zone: "No zone"
  }

  componentDidMount() {
    document.getElementById("content").addEventListener("update", this.handleUpdate);
  }

  componentWillUnmount() {
    document.getElementById("content").removeEventListener("update", this.handleUpdate);
  }

  handleUpdate = (event ) => {
    let price = event.detail.price;
    let total = event.detail.total;
    let lat = event.detail.lat;
    let long = event.detail.long;
    let zone = event.detail.zone;

    this.setState({
      currentPrice: this.convertToCAN(price),
      totalPrice: this.convertToCAN(total),
      zone: zone
    })

    window.mapComponent.update(lat, long);
  }

  updateBalance(value){
    
    if(value == null || value == "" || isNaN(value)){
      console.log(value);
      this.setState({

        balance: `...`
      })
    }
    else{
      console.log(value);
      this.setState({
        balance: this.convertToCAN(value)
      })
    }
  }

  convertToCAN(value){
    return (value * 0.322176).toFixed(2);
  }

  render() {
    
    return (
      <>
        <div className="content" id="content">
          <Row>
          <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody style={{height: 120}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-info">
                        <i className="nc-icon nc-map-big text-info" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Current Zone</p>
                        <CardTitle>{this.state.zone} </CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody style={{height: 120}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-watch-time text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Current zone price</p>
                        <CardTitle>{this.state.currentPrice} $/min</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody style={{height: 120}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Total session payment</p>
                        <CardTitle tag="p">{this.state.totalPrice} $</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>

            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody style={{height: 120}}>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-danger">
                        <i className="nc-icon nc-single-copy-04 text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Balance</p>
                        <CardTitle>{this.state.balance} $</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <GoogleMapsContainer/>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
