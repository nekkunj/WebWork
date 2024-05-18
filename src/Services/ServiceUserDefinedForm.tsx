import { Row,Col, Select, Card, Button, Form, Input } from "antd"
import ServiceParameterForm from "./CreateService/serviceForm"
import { IparameterObj } from "../type"

interface IServiceUserDefinedForm{
    data:any
}
function ServiceUserDefinedForm({data}:IServiceUserDefinedForm){
    const correctedJsonString = data.parameterJsonData==null?null:data.parameterJsonData.replace(/'/g, '"');
    return(
            <>
            <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',width:'80%',margin:'0 auto'}}>
                <legend style={{fontSize:'20px'}}>Service Parameters</legend>
                <ServiceParameterForm  prevStepExists={false} nextStepExist={false} serviceObj={data} serviceId={data.id} nextStep={()=>{}} prevStep={()=>{}} initialValues={correctedJsonString==""?null:JSON.parse(correctedJsonString)}/>
            </fieldset>
            </>
    )
}
export default ServiceUserDefinedForm