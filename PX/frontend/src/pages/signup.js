import React, { Component } from 'react';
import { Grid, Form, Segment, Message, Button, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { authChange, signupUser, resetAuthReducer } from "../actions/auth.actions";
import { connect } from 'react-redux';

class Signup extends Component {
  componentWillUnmount() {
    this.props.resetAuthReducer();
  }

  handleSignup = (event) => {
    event.preventDefault();
    const { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors } = this.props;

    this.props.authChange({ prop: 'signupErrors', value: [] });

    let arr = [];
    if (company.length < 6) {
      arr.push('Company name shall be at least 6 characters long');
    }
    if (company.length > 200) {
      arr.push('Company name shall be at most 200 characters long');
    }
    if (firstName.length < 3) {
      arr.push('First name shall be at least 3 characters long');
    }
    if (firstName.length > 100) {
      arr.push('First name shall be at most 100 characters long');
    }
    if (lastName.length < 3) {
      arr.push('Last name shall be at least 3 characters long');
    }
    if (lastName.length > 100) {
      arr.push('Last name shall be at least 100 characters long');
    }
    if (!this.emailValid(email)) {
      arr.push('Please enter a valid email address');
    }
    if (email !== verifyEmail) {
      arr.push('Emails do not match');
    }
    if (password.length < 6) {
      arr.push('Password shall be at least 6 characters');
    }
    if (password.length > 20) {
      arr.push('Password shall be at most 20 characters');
    }
    if (password.length) {
      let re = /[0-9]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one number');
      }
      re = /[a-z]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one lowercase letter');
      }
      re = /[A-Z]/;
      if (!re.test(password)) {
        arr.push('Password must contain at least one uppercase letter');
      }
      if (password !== verifyPassword) {
        arr.push('Passwords do not match');
      }
    }
    if (phone.length) {
      if (phone.length < 10 || phone.length > 15) {
        arr.push('Please enter a valid phone number or remove completely')
      }
    }

    if (arr.length) {
      this.props.authChange({ prop: 'signupErrors', value: arr });
      this.props.authChange({ prop: 'password', value: '' });
      this.props.authChange({ prop: 'verifyPassword', value: '' });
      return;
    }

    this.props.signupUser({ company, firstName, lastName, email, phone, password });
  };

  emailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  handleChange = (event) => {
    this.props.authChange({ prop: event.target.name, value: event.target.value });
  };

  render() {
    const { loginStyle, columnWidth, textStyle } = styles;
    const { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted } = this.props;

    return (
      <Grid centered textAlign="center" style={{ backgroundColor: 'white', height: '500px', overflow: "scroll" }}>
        <Grid.Column style={columnWidth}>
          <Form size="large" style={loginStyle}>
            <Image src={window.location.origin+"/logo/pilot.png"} centered size="medium" className="main-logo" />
            { !accountSubmitted ?
              <Segment stacked>
                <Form.Input placeholder="Company Name" value={company} name="company" onChange={this.handleChange} />
                <Form.Group widths="equal">
                  <Form.Input name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} />
                  <Form.Input name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} />
                </Form.Group>
                <Form.Input name="email" placeholder="Email address" value={email} onChange={this.handleChange} />
                <Form.Input name="verifyEmail" placeholder="Verify Email" value={verifyEmail} onChange={this.handleChange} />
                <Form.Input name="phone" placeholder="Phone Number (Optional)" value={phone} onChange={this.handleChange} />
                <Form.Input name="password" placeholder="Password" type="password" value={password} onChange={this.handleChange} />
                <Form.Input name="verifyPassword" placeholder="Confirm Password" type="password" value={verifyPassword} onChange={this.handleChange} />
                <Message>Password must contain at least six characters, including uppercase, lowercase letters and numbers.</Message>
                <Button fluid color="blue" onClick={this.handleSignup} style={{ backgroundColor: '#597C94' }}>Request Account</Button>
              </Segment> :
              <Segment stacked>
                <Message color='teal'><Message.Header>Your account request has been submitted. An email will be sent to you soon.</Message.Header></Message>
              </Segment> }

            <Header size="tiny" color="grey" style={textStyle}>Already have an account? <Link to="/" style={{ color: '#597C94' }}>Sign in</Link></Header>

            {/* <Header size="tiny"  style={textStyle}>Already have an account? <Link to="/">Sign in</Link></Header> */}
          </Form>
          { signupErrors.length ? <Message error header='There were some errors with your submission' list={signupErrors} /> : null }
          <br/>
          <br />
        </Grid.Column>
      </Grid>
    )
  }
}

const styles = {
  loginStyle: {
    marginTop: "20px"
  },
  columnWidth: {
    width: "450px"
  },
  textStyle: {
    textAlign: 'center',
     color: '#44546A'
  }
};

const mapStateToProps = state => {
  const { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted } = state.auth;

  return { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted };
};

export default connect(mapStateToProps, { authChange, signupUser, resetAuthReducer })(Signup);
