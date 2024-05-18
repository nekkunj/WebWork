import { Button, Form, Input, Typography } from "antd"
import TextArea from "antd/es/input/TextArea";
import {v4 as uuidv4} from 'uuid';
import { useEffect, useState } from "react";
import { createService,setServiceNameDuplicacyToNull,updateServiceDetails } from "../../state/new actions/serviceAction";

import { connect } from 'react-redux';
import { IServiceReducer } from "../../state/reducers/serviceReducer";
import { RootState } from "../../state/reducers";
import { IparameterObj } from "../../type";
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect, useToken } from "../../utils/getToken";
const { Title } = Typography;

interface IServiceForm{
    onFinish:(value:any)=>void,
    serviceId:string | null,
    serviceName:string | null,
    serviceDescription:string | null,
    serviceURL:string | null,
    serviceStatus:boolean | null,
    serviceParameters:IparameterObj[] | null,
    serviceDetailsSaving:boolean,
    serviceParametersSaving:boolean,
    serviceDetailsSaveSuccess:boolean,
    serviceDetailsSaveFailure:boolean,
    nameIsDuplicate:boolean  | null
    error:string | null
}

const layout = {
    labelCol: { span: 6 },  
    wrapperCol: { span: 18 },
  };
function CreateServiceForm({onFinish,...props}:IServiceForm){
    const [form] = Form.useForm();
    const [wordCount, setWordCount] = useState(18); // Total word count
    const [formData, setFormData] = useState({
                                      name:props.serviceName==null?"":props.serviceName,
                                      description:props.serviceDescription==null?"":props.serviceDescription,
                                      url:props.serviceURL==null?"":props.serviceURL
                                    });
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
                                  
    const errorMessage="* Service Name should be unique"




    async function onFinishF(v:any){
        setFormData(v);
        let id = uuidv4();
        const name=v.name
        const description=v.description
        const url=v.url
        const parameters=""
        const status=true
        var serviceId=""
        if(props.serviceId)
          serviceId=props.serviceId
        else 
          serviceId=id
        
        const data:any = {
          serviceId,
          name,
          description,
          url,
          parameters,
          status
        };
        
        if(props.serviceId)
          await updateServiceDetails(data,getToken(),handleLogoutRedirect)
        else 
          await createService(data,getToken(),handleLogoutRedirect)
    }
    const handleInput = (e:any) => {
      const inputValue = e.target.value;
      // const words = inputValue.split(/\s+/); // Split input value into words
      const remainingWords = Math.max(0, 18 - inputValue.length);
      setWordCount(remainingWords);
    };
    useEffect(()=>{
      if(props.nameIsDuplicate==false){
        onFinish(formData)
        setServiceNameDuplicacyToNull()
      }
    },[props.nameIsDuplicate])

    return(
        <>
            <Form layout="vertical" initialValues={props.serviceName==null?undefined:formData}  onFinish={(v:any)=>{onFinishF(v)}} >
                {/* <Title level={2}>Service Details</Title> */}
                {props.nameIsDuplicate && <p style={{color:'red',textAlign:'left'}}>{errorMessage}</p>}
                <Form.Item {...layout} label="Name" name="name"  required
                  rules={[
                      {
                      required: true,
                      message: 'Please enter service details!',
                    },
                  ]}>
                  <Input maxLength={25} onInput={handleInput} />
                  {/* <div style={{textAlign:'right',color:'red',fontSize:'12px'}}>
                    *{wordCount}/18
                  </div> */}
                </Form.Item>
                <Form.Item {...layout} label="Description" name="description" required
                    rules={[
                        {
                          required: true,
                          message: 'Please enter service description!',
                        },
                      ]}>
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }}  />
                </Form.Item>
                <Form.Item {...layout} label="URL" name="url" required 
                    rules={[
                        {
                          required: true,
                          message: 'Please enter service URL!',
                        },
                      ]}>
                    <Input />
                </Form.Item>
                <Form.Item > 
                  <div style={{ textAlign: 'right' }}>
                      <Button type="primary" htmlType="submit" loading={props.serviceDetailsSaving} style={{width:'113px'}}> Next </Button> 
                  </div>
                </Form.Item>
            </Form>
        

        </>
    )
}

const mapStateToProps = (state: RootState) => {
  return {
    serviceId:state.ServiceReducer.serviceId,
    serviceName:state.ServiceReducer.serviceName,
    serviceDescription:state.ServiceReducer.serviceDescription,
    serviceURL:state.ServiceReducer.serviceURL,
    serviceStatus:state.ServiceReducer.serviceStatus,
    serviceParameters:state.ServiceReducer.serviceParameters,
    serviceDetailsSaving:state.ServiceReducer.serviceDetailsSaving,
    serviceParametersSaving:state.ServiceReducer.serviceParametersSaving,
    serviceDetailsSaveSuccess:state.ServiceReducer.serviceDetailsSaveSuccess,
    serviceDetailsSaveFailure:state.ServiceReducer.serviceDetailsSaveFailure,
    nameIsDuplicate:state.ServiceReducer.nameIsDuplicate,
    error:state.ServiceReducer.serviceCreationError
  };
};

// export default CreateServiceForm
export default connect(mapStateToProps)(CreateServiceForm)