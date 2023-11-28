import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaComponent = ({ onChange }) => {
  const recaptchaRef = React.createRef();

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey="6Ld1IXkUAAAAAC7wbzJpeJ-SORretgHTCD283GKd"
      onChange={onChange}
    />
  );
};

export default RecaptchaComponent;
