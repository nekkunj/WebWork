import { AuthenticatedTemplate,UnauthenticatedTemplate,useIsAuthenticated,useMsal } from "@azure/msal-react"
import NavBar from "../NavBar/NavBar"
import { useEffect, useState } from "react";
import VerticalMenu from "../NavBar/VerticalMenu"
import Fotr from "./Fotr"
import Header from "./Header"
import { loginRequest } from '../authConfig';


interface IHome{
    menuItemNumber:number
}
function Home({menuItemNumber}:IHome){
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();

    let activeAccount:any;
    let props:any
    
    useEffect(()=>{
        // console.log(isAuthenticated)
    //     instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    },[])

    return(
        <>
            <UnauthenticatedTemplate>
                <Header />
                {/* <VerticalMenu /> */}
                
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <VerticalMenu menuItemNumber={menuItemNumber}/>
                {/* <Fotr /> */}
            </AuthenticatedTemplate>
            
        </>
    )
}

  
  export default Home