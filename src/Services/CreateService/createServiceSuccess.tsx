import {  Typography,Row,Col, Button } from "antd"
import { RootState } from "../../state/reducers"
import { connect } from 'react-redux';
const { Title } = Typography;
interface ISuccess{
    serviceName:string | null
}
function CreateServiceSuccess({...props}:ISuccess){
    return(
        <Row justify="center" align="middle">
            <Col xs={23} sm={21.5} md={20} xl={18}>
                <Title level={1} >Congratulations!</Title>
                <Title level={5} >You have successfully created the service  <b>{props.serviceName}</b></Title>
                <Button type="primary" href="/?id=5" onClick={() => console.log('Button clicked')}>
                  Return to home page
                </Button>
            </Col>
        </Row>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
        serviceName:state.ServiceReducer.serviceName,
    };
  };
  
  export default connect(mapStateToProps)(CreateServiceSuccess)