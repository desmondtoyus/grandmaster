import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import Alert from '../components/Alert';

class Optout extends Component {
    componentDidMount() {
        this.optOut();
    }
    optOut = () => {
        document.cookie = `OPTOUT_TARGETED=${1}`;
        console.log(document.cookie);
    }
    state = { link: '' }
    handleDismiss = (e) => {
        e.preventDefault();
        (window.history.back());
    }
    render() {
 return (
<Col md={12}>
            <Card>
                <CardBody>
                        <Alert color='info' className='alert--neutral' icon>
                            <p><span className='bold-text'>You have successfully opted out!</span></p>
                            <p> We will no longer use your data for ad targeting. Important things you should know: </p>
                            <p> Opting out of the PilotX.tv cookie means that PilotX.tv will know you have opted out of interest-based advertising. You will see the same number of ads as before, but they may not be as relevant when you opt out. </p>
                            <p>  Please note that if you use more than one type of browser or more than one computer to surf the Internet, you will have to opt out in each browser and on each computer that you use. If you delete this opt-out cookie, you will have to opt out again. </p>
                            <p>  You can opt in again by removing the PilotX.tv Opt-out cookie. Click <Link to='/' onClick={this.handleDismiss}> HERE</Link> to return.</p>
                        </Alert>

                </CardBody>
            </Card >
            </Col>
        )
    }
}




export default Optout;
