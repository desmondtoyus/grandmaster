import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col
} from "reactstrap";
import Alert from "../components/Alert";

class Notfound extends Component {
  render() {
    return (
        <Col md={12} lg={12}>
      <Card >
        <CardBody>
   
            <Alert color="info" className="alert--neutral" icon>
              <p>
                <span className="bold-text">Page Not Found </span>
              </p>
            </Alert>
         
        </CardBody>
      </Card>
      </Col>
    );
  }
}

export default Notfound;
