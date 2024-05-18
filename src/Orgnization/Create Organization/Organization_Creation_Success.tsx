import {  Typography,Row,Col, Button } from "antd"
const { Title } = Typography;
interface ISuccess{
    val:string
}
function Organization_Creation_Success({val}:ISuccess){
    return(
        <Row justify="center" align="middle">
            <Col xs={23} sm={21.5} md={20} xl={18}>
                <Title level={1} >Congratulations!</Title>
                <Title level={5} >You have successfully created the organization {val}</Title>
                <Button type="primary" href="/?id=4" onClick={() => console.log('Button clicked')}>
                  Let's Get Started
                </Button>
            </Col>
        </Row>
    )
}
export default Organization_Creation_Success