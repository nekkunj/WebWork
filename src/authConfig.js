/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";
        // redirectUri: 'https://bimvistaweb.azurewebsites.net/',

export const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENTID, 
        authority: 'https://login.microsoftonline.com/4507ae57-9a7b-4236-ba38-2189a5328f71', 
        redirectUri:'/',
        postLogoutRedirectUri: 'https://bimvista.com/', 
        navigateToLoginRequestUrl: true, 
    },
    cache: { 
        cacheLocation: 'sessionStorage', 
        storeAuthStateInCookie: true, 
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        // console.error(message);
                        return;
                    case LogLevel.Info:
                        // console.info(message);
                        return;
                    case LogLevel.Verbose:
                        // console.debug(message);
                        return;
                    case LogLevel.Warning:
                        // console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const apiConfig = {
    resourceUri: `${process.env.REACT_APP_DATABASE_API}/api/`,
    resourceScopes: [`api://${process.env.REACT_APP_CLIENTID}/access_as_a_user`]
}

export const loginRequest = {
    scopes: ["openid", "profile", "offline_access", ...apiConfig.resourceScopes]
}
 
// Add here scopes for access token to be used at the API endpoints.
export const tokenRequest = {
    scopes: [...apiConfig.resourceScopes]
}

// Add here scopes for silent token request
export const silentRequest = {
    scopes: ["openid", "profile", ...apiConfig.resourceScopes]
}
