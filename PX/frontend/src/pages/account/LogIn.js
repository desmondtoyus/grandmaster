import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Image } from "semantic-ui-react";
import { connect } from "react-redux";
import { loginUser, authChange } from "../../redux/actions/auth.actions";

import {
  Input,
  Alert,
} from "reactstrap";

import EyeIcon from "mdi-react/EyeIcon";
import KeyVariantIcon from "mdi-react/KeyVariantIcon";
import AccountOutlineIcon from "mdi-react/AccountOutlineIcon";

class LogIn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      loading: false
    };

    this.showPassword = this.showPassword.bind(this);
  }

  componentWillMount(){
    if(window.location.href =='http://trade.pilotx.tv/')
    {
      window.location.href ='https://trade.pilotx.tv/';
    }
    
  }

  handleEnterKey = (event) => {
    if(event.key == 'Enter'){
      this.handleLogin(event);
    }
  }


  handleLogin = event => {
    event.preventDefault();
    this.setState({ loading: false });

    const { email, password, history } = this.props;

    if (!this.emailValid(email)) {
      this.props.authChange({
        prop: "errorMessage",
        value: "Please enter a valid email"
      });
      return;
    }

    if (!password) {
      this.props.authChange({
        prop: "errorMessage",
        value: "Please enter a password"
      });
      return;
    }
    this.setState({ loading: true });
    this.props.loginUser({ email, password, history });
  };

  emailValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleChange = event => {
    this.props.authChange({
      prop: event.target.name,
      value: event.target.value
    });
  };

  showPassword(e) {
    e.preventDefault();
    this.setState({
      showPassword: !this.state.showPassword
    });
  }

  render() {
    const { email, password, errorMessage } = this.props;
    return (
      <div className="account center">
        {this.state.loading && !errorMessage ? (
          <div className="loader"> </div>
        ) : null}
        <div className="account__wrapper">
          <Image
            src={"/logo/pilot.png"}
            size="small"
            className="main-logo center"
          />
          <div className="account__card">
            <div className="account__head">
              {errorMessage.length ? (
                <Alert color="danger">{errorMessage}!</Alert>
              ) : null}
            </div>
            <div className="form">
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <AccountOutlineIcon />
                  </div>
                  <Input
                    name="email"
                    type="text"
                    placeholder="Email Address"
                    value={email}
                    onKeyPress={this.handleEnterKey} 
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <div className="form__form-group-field">
                  <div className="form__form-group-icon">
                    <KeyVariantIcon />
                  </div>
                  <Input
                    name="password"
                    type={this.state.showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onKeyPress={this.handleEnterKey} 
                    onChange={this.handleChange}
                  />
                  <button
                    className={`form__form-group-button${
                      this.state.showPassword ? " active" : ""
                    }`}
                    onClick={e => this.showPassword(e)}
                  >
                    <EyeIcon />
                  </button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Link className="terms" to="/forgot">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div
                className="btn btn-primary account__btn account__btn--small"
                style={{ fontSize: "13px" }}
                onClick={this.handleLogin}
              >
                Sign In
              </div>
              <Link
                className="btn btn-outline-primary account__btn account__btn--small"
                to="/signup"
                style={{ fontSize: "13px", textAlign: "center" }}
              >
                Sign Up
              </Link>
            </div>
            <div className="account__or">
              <p>
                <Link className="terms" to="/terms">
                  Terms and Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { email, password, errorMessage } = state.auth;

  return { email, password, errorMessage };
};

export default connect(
  mapStateToProps,
  { loginUser, authChange }
)(LogIn);
