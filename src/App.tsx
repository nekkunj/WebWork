import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as express from 'express'
import NavBar from './NavBar/NavBar';
import Create_Organization from './Orgnization/Create Organization/Create_Organization';
import CreateServiceSteps from './Services/CreateService/createServiceSteps'
import { MsalProvider, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react';
import {createBrowserRouter,Navigate,RouterProvider,useLocation} from "react-router-dom";
import VerticalMenu from './NavBar/VerticalMenu';
import { Col, Row } from 'antd';
import Home from './Home/Home';
import DropdownTabs from './NavBar/DropdownTabs';
import { Provider } from 'react-redux';
import Create_Project from './Projects/Create Project/Create_Project';
import SignOutPage from './SignOutPage';
import Profile from './NavBar/Profile';



const HomeContainer: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');   //id is used for the vertical navbar default value
  
  return (
    <Home menuItemNumber={id ? parseInt(id) : 2} />
  );
};

const router = createBrowserRouter([
  {
    path: "/", 
    element: <HomeContainer/>,
  },
  {
    path:"/create_Service_Steps",
    element:<>
                <UnauthenticatedTemplate>
                  <Navigate to="/" />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <CreateServiceSteps />
                </AuthenticatedTemplate>
            </>
  },
  {
    path:'/create_organization',
    element:<>
                <UnauthenticatedTemplate>
                  <Navigate to="/" />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <Create_Organization />
                </AuthenticatedTemplate>
            </>
  },
  {
    path:'/create_project',
    element:<>
                <UnauthenticatedTemplate>
                  <Navigate to="/" />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <Create_Project />
                </AuthenticatedTemplate>
            </>
  },
  {
    path:'/signout-callback-oidc',
    element:<>
                <UnauthenticatedTemplate>
                  <SignOutPage />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <Navigate to="/" />
                </AuthenticatedTemplate>
            </>
  },
  {
    path:'/profile',
    element:<>
                <UnauthenticatedTemplate>
                  <Navigate to="/" />
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                  <Profile />
                </AuthenticatedTemplate>
            </>
  }

]);
function App(instance:any) {
  return (
      <div className="App" style={{backgroundColor:'rgb(225,225,225)'}}>
          <AuthenticatedTemplate>
          <NavBar />  
          </AuthenticatedTemplate>
          <RouterProvider router={router}/>
      </div>
    
  );
}

export default App;
