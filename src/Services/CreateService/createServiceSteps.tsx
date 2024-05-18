import {Row, Col, Steps, Result, Button} from 'antd'
import { useEffect, useState } from 'react'
import CreateServiceSuccess from './createServiceSuccess'
import CreateServiceForm from './createServiceForm'
import ServiceParameterForm from './serviceForm'
import { RootState } from "../../state/reducers"
import { connect } from 'react-redux';
import "./service.css"
import { IparameterObj } from '../../type'
import { fetchUserRole } from '../../state/new actions/generalUserAction'
import { useMsal } from '@azure/msal-react'
import { LoadingOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
interface ICreateServiceSteps{
    serviceParameters:IparameterObj[] | null,
    serviceId:string | null,
    role:string | null,
    roleFetch_Error:string | null,
    userRoleInProgress:boolean,
}
function CreateServiceSteps({...props}:ICreateServiceSteps){
    const [current,setCurrent]=useState(0)
    const [service_Details,setservice_Details]=useState(null)
    const { instance } = useMsal();

    let activeAccount:any;
    let prop:any
    const onFinishServiceParameters=(values:any)=>{
        setCurrent(2)
    }
    const prevStep=()=>{
        setCurrent(0)
    }
    const onFinish_ServiceForm=(values:any)=>{
        setservice_Details(values)
        setCurrent(1)
    }
    const forms=[
        <CreateServiceForm onFinish={onFinish_ServiceForm} />,
        <ServiceParameterForm serviceObj={service_Details} prevStepExists={true} nextStepExist={true} prevStep={prevStep} serviceId={props.serviceId} nextStep={onFinishServiceParameters} initialValues={props.serviceParameters}/>,
        <CreateServiceSuccess />
    ]

    useEffect(()=>{
        async function getData(roles:any,accessToken:any){
          await fetchUserRole(roles)
      }
        if (instance) {
          activeAccount = instance.getActiveAccount();
          prop=instance.getActiveAccount()?.idTokenClaims
          const homeAccId:string=activeAccount.homeAccountId 
          const tenantId:string=activeAccount.tenantId
          const aud:string=prop.aud
          const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
          const sessionValue:any=sessionStorage.getItem(sId)
          const jsonObj=JSON.parse(sessionValue)
          const token=jsonObj.secret
          getData(prop.roles,token)
        }
      },[])
    return(
        <Row justify="center" align="middle" style={{paddingTop:'10px',height:'93vh'}}>
            {props.role==null&& <Col xs={23} sm={21.5} md={18} xl={16}><LoadingOutlined style={{fontSize:30}}/></Col>}
            {props.role=="General User" && <Col xs={23} sm={21.5} md={18} xl={16}>
                    <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Link to="/"><Button type="primary" >Back Home</Button></Link>}
                    />
                    </Col>
                }
            
            {props.role=="Super Admin" &&<Col xs={23} sm={21.5} md={18} xl={16}>
                <Steps onChange={setCurrent} current={current} className="disable-click">
                    <Steps.Step title="Create Service"  />
                    <Steps.Step title="Service Form"  />
                    <Steps.Step title="Success"  />
                </Steps>
                <div style={{margin:'30px'}}>{forms[current]}</div>
            </Col>}
        </Row>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
        serviceId:state.ServiceReducer.serviceId,
        serviceParameters:state.ServiceReducer.serviceParameters,
        role:state.RoleReducer.role,
        roleFetch_Error:state.RoleReducer.roleFetch_Error,
        userRoleInProgress:state.RoleReducer.userRoleInProgress
    };
  };
  
  export default connect(mapStateToProps)(CreateServiceSteps)