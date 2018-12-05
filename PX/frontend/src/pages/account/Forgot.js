import React, {PureComponent} from 'react';
import {Link} from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import {  Input, Alert} from 'reactstrap';
import Recaptcha from '../../app/recaptcha';
import { connect } from 'react-redux';
import { authChange, recoverPassword, resetAuthReducer } from '../../redux/actions/auth.actions';

class Forgot extends PureComponent {
  
  componentWillUnmount() {
    this.props.resetAuthReducer();
  }

  handleChange = (event) => {
    this.props.authChange({ prop: event.target.name, value: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.authChange({ prop: 'errorMessage', value: '' });

    const { email, reCaptcha } = this.props;

    if (!this.isEmailValid(email)) {
      this.props.authChange({ prop: 'errorMessage', value: 'Please enter a valid email' });
      return;
    }

    if (!reCaptcha) {
      this.props.authChange({ prop: 'errorMessage', value: 'Please verify that you are not a robot' });
      return;
    }

    this.props.recoverPassword({ email, reCaptcha });
  };

  isEmailValid(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const { email, errorMessage, passwordSent } = this.props;
    return (
      <div className='account center' style={{ width: '400px' }}>
        <div className='account__wrapper'>
        <Image src={"/logo/pilot.png"} size="small" className="main-logo center" />
          <div className='account__card'>
            <div className='account__head'>
            <h5> Reset Password</h5>
              <hr />
              {errorMessage.length ?
                <Alert color="danger">
                  {errorMessage}!
                </Alert> : null}
            </div>
            {!passwordSent ?  <div className='form'>
              <div className='form__form-group'>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                    <AccountOutlineIcon />
                  </div>
                  <Input
                    name="email"
                    type='text'
                    placeholder='Email Address'
                    value={email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className='btn btn-primary btn-block' style={{ fontSize: '13px' }} onClick={this.handleSubmit} >Submit</div>
              <br />
              {!passwordSent ? <div className='center'> <Recaptcha callback={this.props.authChange} /></div> : null}
            </div> : <Alert color="info">Please check your email for your new password</Alert>}
            <div className='account__or'>
              <p>
                <Link className='terms' to='/'>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { reCaptcha, email, errorMessage, passwordSent } = state.auth;

  return { reCaptcha, email, errorMessage, passwordSent };
};

export default connect(mapStateToProps, { authChange, recoverPassword, resetAuthReducer })(Forgot);