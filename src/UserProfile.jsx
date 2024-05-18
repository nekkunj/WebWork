import React from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig"; // Assuming this is your configuration file

const UserProfile = () => {
    const { instance, accounts } = useMsal();
    const [tokenDetails, setTokenDetails] = React.useState(null);

    React.useEffect(() => {
        if (accounts.length > 0) {
            instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0]
            }).then(response => {
                // Assuming you do something with the token, here we're just setting it to state for demonstration
                setTokenDetails({ user: response.account.name, token: response.accessToken });
            }).catch(e => {
                console.error(e);
            });
        }
    }, [accounts, instance]);

    if (!tokenDetails) {
        return <div>Loading...</div>;
    }

    return( 
        <>
        Welcome, {tokenDetails.user} 
        Your token is: {tokenDetails.token} 
        </>
    );
};

export default UserProfile