import React, { Component } from 'react';

class Recaptcha extends Component {
  componentDidMount() {
    let interval = setInterval(() => {
      if (window.hasOwnProperty('grecaptcha')) {
        clearInterval(interval);
        window.grecaptcha.render('recap', {
          sitekey: '6LdsvEoUAAAAAI8LOSjSldzWK36HZjdrThHGEzNV',
          callback: this.verifyCallback,
          'expired-callback': this.expireCaptcha
        })
      }
    }, 100);
  }

  verifyCallback = () => {
    this.props.callback({ prop: 'reCaptcha', value: window.grecaptcha.getResponse() });
  };

  expireCaptcha = () => {
    this.props.callback({ prop: 'reCaptcha', value: '' });
  };

  render() {
    return (
      <div id={'recap'} />
    )
  }
}

export default Recaptcha;