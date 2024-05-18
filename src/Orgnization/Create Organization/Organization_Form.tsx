import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Typography,Tooltip  } from "antd"
import type{FormItemProps} from 'antd'
import {v4 as uuidv4} from 'uuid';
import { InfoCircleOutlined } from '@ant-design/icons';
import { createOrganization, setOrganizationNameDuplicacyToNull, updatingOrganizationDetailsAPI, updatingOrganization_CreateOrganization } from '../../state/new actions/organizationAction';
import { RootState } from '../../state/reducers';
import { connect } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { useMsal } from '@azure/msal-react';
const { Title } = Typography;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  interface IOrganization_Form{
    nextStep:(v:any)=>void,
    nameIsDuplicate:boolean | null,
    organizationId:string | null,
    documentId:string | null,
    organizationName:string | null,
    organizationDescription:string | null,
  }

function Organization_Form({nextStep,...props}:IOrganization_Form){
  const [wordCount, setWordCount] = useState(18); // Total word count
  const [formData,setData]=useState({
                                      organization_Name:props.organizationName==null?"":props.organizationName,
                                      description:props.organizationDescription==null?"":props.organizationDescription,
                                    })
  const st = useMsal();
  let activeAccount:any;
  let prop:any

  const errorMessage="* Organization Name should be unique"
  const onFinish=async(v:any)=>{
    const name=v.organization_Name
    const description=v.description
    setData(v)
    const data={
      name,
      description,
    }
    const id=props.organizationId
    const status=true
    const upDateData={
      name,
      id,
      description,
      status
    }
    // await createOrganization(data)
    console.log(upDateData)
    if(props.organizationId)
      await updatingOrganization_CreateOrganization(upDateData,getToken(),handleLogoutRedirect)
    else 
      await createOrganization(data,getToken(),handleLogoutRedirect)
  }

  const handleLogoutRedirect = () => {
    const {instance}=st
    instance.logoutRedirect().catch((error) => console.log(error));
  };
  const handleInput = (e:any) => {
    const inputValue = e.target.value;
    // const words = inputValue.split(/\s+/); // Split input value into words
    const remainingWords = Math.max(0, 18 - inputValue.length);
    setWordCount(remainingWords);
  };

  function getToken(){
    if(st){
      const {instance} =st
      activeAccount = instance.getActiveAccount();
      prop=instance.getActiveAccount()?.idTokenClaims
      if(activeAccount){
      const homeAccId:string=activeAccount.homeAccountId 
      const tenantId:string=activeAccount.tenantId
      const aud:string=prop.aud
      const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
      const sessionValue:any=sessionStorage.getItem(sId)
      const jsonObj=JSON.parse(sessionValue)
      const token=jsonObj.secret
      return token
      }
      else{
        return ""
      }
    }
    else{
      return ""
    }
  } 


  useEffect(()=>{
    if(props.nameIsDuplicate==false){
      nextStep(formData)
      setOrganizationNameDuplicacyToNull()
    }
  },[props.nameIsDuplicate])
    
    return(
      <Form layout="vertical" size='middle' initialValues={props.organizationName==null?undefined:formData}  onFinish={(v:any)=>{onFinish(v)}} style={{display:'flex',flexDirection:'column',minHeight: '60vh',borderRadius:'10px',padding:'10px',margin:'20px auto',width:'80%'}}>
            <Title level={1}>Name Your Organization</Title>
            <Title level={5}>An organization is the home for all the projects, teams, users and billing.</Title>
            {props.nameIsDuplicate==true && <p style={{color:'red',textAlign:'left'}}>{errorMessage}</p>}
            <Form.Item {...layout} name="organization_Name" label="Organization Name" 
                        required 
                        tooltip={{ title: 'This item is required', icon: <InfoCircleOutlined /> }}
                        rules={[
                            {
                              required: true,
                              message: 'Please enter organization name!',
                            },
                          ]}>
                <Input maxLength={25} onInput={handleInput} />
                {/* <div style={{textAlign:'right',color:'red',fontSize:'12px'}}>
                  *{wordCount}/50
                </div> */}
            </Form.Item >
            <Form.Item {...layout} label="Description" name="description"  required 
                    rules={[
                        {
                          required: true,
                          message: 'Please enter organization description!',
                        },
                      ]}>
                    
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }}  />
            </Form.Item>
            <Form.Item {...layout} style={{display:'flex',justifyContent:'flex-end'}}> 
                <Button type="primary" htmlType="submit">
                    Next
                    </Button>
            </Form.Item>
      </Form>   

    )
}
const mapStateToProps = (state: RootState) => {
  return {
    nameIsDuplicate:state.CreateOrganization.nameIsDuplicate,
    organizationId:state.CreateOrganization.organizationId,
    documentId:state.CreateOrganization.documentId,
    organizationName:state.CreateOrganization.organizationName,
    organizationDescription:state.CreateOrganization.organizationDescription,
  };
};

export default connect(mapStateToProps)(Organization_Form)