import React, {PureComponent} from 'react';
import { authChange, signupUser, resetAuthReducer } from "../../redux/actions/auth.actions";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import EyeIcon from 'mdi-react/EyeIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faMobileAlt, faUser, faAt, faKey} from '@fortawesome/free-solid-svg-icons';
import { Input, Alert} from 'reactstrap';

class Register extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      visible: true
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.showPassword = this.showPassword.bind(this);
  }

  showPassword(e) {
    e.preventDefault();
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

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

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    const { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted } = this.props;
    return (
      <div className='account center' style={{width:'400px'}}>
        <div className='account__wrapper'>
         <Image src={"/logo/pilot.png"} size="small" className="main-logo center" />
         <div className='account__card'>
             <div className='account__head'>
              <h4 className='account__subhead subhead'>Create an account</h4>
              {signupErrors.length ?
                <div>
                  <b className="text-danger"> There were some errors with your submission </b>
                  <hr />
                  {signupErrors.map((err, index) => {
                    return (<Alert color="danger" key={index} isOpen={this.state.visible} toggle={this.onDismiss}>
                      {err}
                    </Alert>)
                  })}
                </div> : null}
            </div>
            {!accountSubmitted ? <div className='form'>
              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                    {/* <i className="fa fa-spinner fa-spin"/> */}
                    <span><FontAwesomeIcon icon={faBuilding} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" placeholder="Company Name" value={company} name="company" onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                    <span><FontAwesomeIcon icon={faUser} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faUser} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faAt} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" name="email" placeholder="Email address" value={email} onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faAt} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" name="verifyEmail" placeholder="Verify Email" value={verifyEmail} onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faMobileAlt} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input type="text" name="phone" placeholder="Phone Number (Optional)" value={phone} onChange={this.handleChange} className="" />
                </div>
              </div>

              <div className='form__form-group form__form-group--forgot' style={{ marginBottom: '10px' }}>
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faKey} style={{color:'#8e8e8e'}}/> </span>
                  </div>

                  <Input type={this.state.showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={password} onChange={this.handleChange} className="" />
                  
                  <button className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                    onClick={(e) => this.showPassword(e)}><EyeIcon /></button>
                </div>
              </div>

              <div className='form__form-group form__form-group--forgot' >
                <div className='form__form-group-field'>
                  <div className='form__form-group-icon'>
                  <span><FontAwesomeIcon icon={faKey} style={{color:'#8e8e8e'}}/> </span>
                  </div>
                  <Input name="verifyPassword" placeholder="Confirm Password" type={this.state.showPassword ? 'text' : 'password'} value={verifyPassword} onChange={this.handleChange} className="" />
                  <button className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                    onClick={(e) => this.showPassword(e)}><EyeIcon /></button>
                </div>
              </div>
              <div className='btn btn-primary account__btn' onClick={this.handleSignup}>Request Account</div>
            </div> :
              <Alert color="info"> Your account request has been submitted. An email will be sent to you soon.</Alert>}
            <div className='account__have-account'>
              <p>Already have an account? <Link to='/'>Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted } = state.auth;

  return { company, firstName, lastName, email, verifyEmail, phone, password, verifyPassword, signupErrors, accountSubmitted };
};

export default connect(mapStateToProps, { authChange, signupUser, resetAuthReducer })(Register);