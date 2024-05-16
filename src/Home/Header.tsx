import { Button, Col, Row, Typography } from "antd";
import { useEffect } from "react";
import { loginRequest } from '../authConfig';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Loading3QuartersOutlined, LoadingOutlined } from "@ant-design/icons";
const { Title } = Typography;


function Header(){
    const { instance } = useMsal();
    useEffect(() => {
        console.log(process.env.REACT_APP_CLIENTID)
        // This code will be executed when the component is mounted
        instance.loginRedirect(loginRequest).catch((error) => console.log(error));
      }, []);
    return(
        <div style={{color:'black',backgroundColor:'white',display:'flex',height:'100vh',alignItems:'center',justifyContent:'center'}}>
            <br/>
            <LoadingOutlined style={{fontSize:'40px'}}/>
            {/* <Row justify="center" align="middle">
                <Col xs={23} md={16} xl={14} >
                    <Title level={1} style={{color:'white'}}>Build Better Products</Title>
                </Col>
            </Row>
            <Row justify="center" align="middle">
                <Col xs={23} md={12} xl={12}>
                    <Title style={{color:'white'}} level={4}>Powerful,self-serve product analytics to help you convert, engage, and retain more users</Title>
                </Col>
            </Row>
            <Row justify="center" align="middle">
                <Col xs={23} md={16} xl={12} style={{padding:'10px'}}>
                    <Button size="large" type="primary" style={{margin:'10px'}}> Take a tour</Button>
                    <Button size="large" ghost style={{margin:'10px'}}> Sign Up</Button>
                </Col>
            </Row> */}
        </div>
    )
}

export default Header