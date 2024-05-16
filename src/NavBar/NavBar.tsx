import "./navbar.css"
import {Menu,Drawer, Dropdown, MenuProps, Button} from "antd";
import {useState} from "react";
import {MenuOutlined, UserOutlined} from "@ant-design/icons"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
function NavBar(){
    const [openMenu,setOpenMenu]=useState(false)
   
return(
    <div>
        <div className="menuButton" 
            style={{
                height:"60px",
                backgroundColor:"skyBlue",
                paddingLeft:12,
                paddingTop:12
                }}
        >
            <MenuOutlined style={{color:"white",fontSize:30}} 
                onClick={()=>{setOpenMenu(true)}}
            />
        </div>
        <span className="menunavbar" >
            <AppMenu />
        </span>
        <Drawer placement="left" 
            open={openMenu} 
            onClose={()=>{setOpenMenu(false);}} 
            closable={false} 
            bodyStyle={{backgroundColor:"skyBlue"}}
            >
            
            <AppMenu isInLine/>
        </Drawer>
    </div>
)
}

function AppMenu({isInLine=false}){
    
    const { instance } = useMsal();

    let activeAccount:any;
    let props:any

    if (instance) {
     activeAccount = instance.getActiveAccount();
     props=instance.getActiveAccount()?.idTokenClaims
    }
    
    const handleLoginRedirect = () => {
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
    };
    const handleLogoutRedirect = () => {
        instance.logoutRedirect().catch((error) => console.log(error));
    };
    const menuItems=[
        { key: 'logo', label: 'BimVista'},
        { key: 'Boards', label: 'Boards' },
        { key: 'Reports', label: 'Reports' },        
        { key: 'Users', label: 'Users' },
        // { key: 'signup', label: 'Sign Up', alignRight: true },
        // { key: 'login', label: 'Login' },
    ]
    const loggedInMenuItems=[
        { key: 'logo', label: 'BimVista' },        
    ]
    const items: MenuProps['items'] = [
        {
            key:'1',
            label:(
                <a  rel="noopener noreferrer" href="/profile">
            Profile
            </a>
            )
        },
        {
            key:'2',
            label:(
                <a target="_blank" onClick={handleLogoutRedirect}  rel="noopener noreferrer" >
            Logout
            </a>
            )
        }
    ];
    return(
        <>
            <UnauthenticatedTemplate>

                <Menu  mode={isInLine ? "inline":"horizontal" }
                    style={{backgroundColor:"black",color:"white",fontSize:16,border:"none"}}
                    >
                    {menuItems.map((item) => (
                        <Menu.Item key={item.key} 
                            style={{ 
                                // marginLeft: item.alignRight ? 'auto' : undefined ,
                                marginLeft: undefined,
                                // color:item.logoColor?'red':'white',
                                // fontWeight:item.logoColor?'bold':'none'
                                }}>
                    {item.label}
                </Menu.Item>
                ))} 

                <Menu.Item key="login" onClick={handleLoginRedirect} style={{ marginLeft: 'auto' ,color:'white',fontWeight:'bold' 
                                    }}> 
                                    Login
                </Menu.Item>
                </Menu>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <Menu  mode={isInLine ? "inline":"horizontal" }
                theme="dark"
                    style={{color:"white",fontSize:16,border:"none",height:'7vh'}}
                    >
                    {loggedInMenuItems.map((item) => (
                        <Menu.Item key={item.key} 
                            style={{ 
                                // marginLeft: item.alignRight ? 'auto' : undefined ,
                                marginLeft:undefined,
                                // color:item.logoColor?'red':'white',
                                // fontWeight:item.logoColor?'bold':'none'
                                }}>
                    {item.label}
                </Menu.Item>
            ))} 
                {activeAccount  && 
                <Menu.Item style={{ marginLeft: 'auto' ,color:'white',fontWeight:'bold' }}>
                    <Dropdown  menu={{items}} placement="bottomRight">
                         <Button style={{ color:'white',backgroundColor:'transparent',border:'0' }}> <UserOutlined />{props.preferred_username}</Button> 
                    </Dropdown> 
                </Menu.Item>
                }
                
                {/* <Menu.Item key="logout" onClick={handleLogoutRedirect} style={{ marginLeft: undefined ,color:'white',fontWeight:'bold' 
                                    }}> 
                        Logout
                </Menu.Item> */}

                </Menu>
                
            </AuthenticatedTemplate>
        </>
    )
}
export default NavBar