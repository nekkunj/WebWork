import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';

function SignOutPage(){
    const { instance } = useMsal();

    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };
    return(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        status="success"
        title="Signout Successful"
        subTitle="You have been successfully signed out."
        extra={[
          <Link to="/">
            <Button type="primary">Back to Home</Button>
          </Link>,
          <Button onClick={handleLoginRedirect}>Login</Button>
        ]}
      />
    </div>
    )
}
export default SignOutPage