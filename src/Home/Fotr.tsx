import { Col, Layout, Row } from "antd"
import './Fotr.css'
import { CopyrightCircleFilled, CopyrightOutlined, EllipsisOutlined } from "@ant-design/icons";
const { Header, Footer, Sider, Content } = Layout;
const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'gray',
    backgroundColor: '#A7BBCB',
  };
function Fotr(){
    return(
        <Layout>
            <Footer style={footerStyle}>
                <Row> 
                    <Col  xs={1}></Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <EllipsisOutlined style={{fontSize:55,color:'black'}}/>
                    </Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <div style={{color:'black'}}>PRODUCT</div>
                        <div>Team, Boards & Alerts</div>
                        <div>Interactive Reports</div>
                        <div>Limitless Segmentation</div>
                        <div>Group Analytics</div>
                        <div>Data Integrations</div>
                    </Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <div style={{color:'black'}}>SOLUTIONS</div>
                        <div>Unreal</div>
                        <div>SaaS Platform</div>
                        <div>Ecommerce</div>
                    </Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <div style={{color:'black'}}>RESOURCES</div>
                        <div>Product Updates</div>
                        <div>Customer Stories</div>
                        <div>Blog</div>
                        <div>FAQs</div>
                        <div>Content Library</div>
                        <div>Digital Events</div>
                        <div>Testimonials</div>
                    </Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <div style={{color:'black'}}>SUPPORT</div>
                        <div>Contact US</div>
                        <div>Developer Docs</div>
                        <div>Help Center</div>
                    </Col>
                    <Col xs={11} md={5} lg={2} className="footer-class">
                        <div style={{color:'black'}}>COMPANY</div>
                        <div>About Us</div>
                        <div>Press</div>
                        <div>Careers</div>
                        <div>Legal</div>
                        <div>Privacy Policy</div>
                    </Col>
                    <Col xs={24}>
                        <Row>
                            <Col xs={0} sm={2} md={3}></Col>
                            <Col xs={13} sm={11} md={10} style={{textAlign:'left'}} >
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                            </Col>
                            <Col xs={3}>
                                <CopyrightOutlined /> 2023. All rights reserved
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Footer>
        </Layout>
    )
}
export default Fotr