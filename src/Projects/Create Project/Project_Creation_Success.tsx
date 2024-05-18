import {  Typography,Row,Col, Button } from "antd"
const { Title } = Typography;
interface ISuccess{
    val:string
}
function Project_Creation_Success({val}:ISuccess){
    return(
        <Row justify="center" align="middle">
            <Col xs={23} sm={21.5} md={20} xl={18}>
                <Title level={1} >Congratulations!</Title>
                <Title level={5} >You have successfully created your project {val}</Title>
                <Button type="primary" href="/?id=6">
                  Let's Get Started
                </Button>
            </Col>
        </Row>
    )
}
export default Project_Creation_Success