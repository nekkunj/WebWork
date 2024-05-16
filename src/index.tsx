import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import msalInstance from './msalInstance';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import {store} from './state';
import { MsalProvider } from '@azure/msal-react';
import * as serviceWorker from './serviceWorker';
// const authRoute = require("./routes/auth");
// const express = require("express");
// const app=express()
// app.use("/api/auth", authRoute);
// import { Provider } from 'react-redux';
// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      {/* <Provider store={store}> */}
      <App instance={msalInstance}/>
      {/* </Provider> */}
    </MsalProvider>
  </React.StrictMode>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.unregister();