

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
import Map from "./Map"
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.jsx";


class Dashboard extends React.Component {
  state = {
    currentPrice: 0,
    totalPrice: 0,
    balance: 0
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

    this.setState({
      currentPrice: price,
      totalPrice: total,
    })

    window.mapComponent.update(lat, long);
  }

  render() {
    
    return (
      <>
        <div className="content" id="content">
          <Row>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-watch-time text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Current zone price</p>
                        <CardTitle tag="cBilling">{this.state.currentPrice} $</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
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

            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Balance</p>
                        <CardTitle tag="cBilling">{this.state.balance} $</CardTitle>
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
              <Map/>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
