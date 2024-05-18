import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Typography,Tooltip, Select  } from "antd"
import type{FormItemProps} from 'antd'
import {v4 as uuidv4} from 'uuid';
import { InfoCircleOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { createProject, setProjectNameDuplicacyToNull, updatingProjectDetailsAPI_createProjectSteps } from '../../state/new actions/projectAction';
import { connect } from 'react-redux';
import { RootState } from '../../state/reducers';
import { useLogoutRedirect,useToken } from '../../utils/getToken';
const { Title } = Typography;
const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  interface IProject_Form{
    organizationList:any | null,
    nextStep:(v:any,orgName:string)=>void,    projectId:string | null,
    organizationId:string | null,
    projectName:string | null,
    projectDescription:string | null,
    nameIsDuplicate:boolean | null
  }
function Project_Form({nextStep,organizationList,...props}:IProject_Form){
  const [wordCount, setWordCount] = useState(18); // Total word count
  const [orgName,setOrgName]=useState("")
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()
  const errorMessage="* Project Name should be unique in an organization"
   const [formData, setFormData] = useState({
                                      project_Name:props.projectName==null?"":props.projectName,
                                      description:props.projectDescription==null?"":props.projectDescription,
                                      organization:props.organizationId==null?"":props.organizationId
                                    });
  const onFinish=async(v:any)=>{
    const name=v.project_Name
    const description=v.description
    const organizationId=v.organization
    setFormData(v)
    const data={
      name,
      description,
      organizationId
    }
    if(props.projectId)
      await updatingProjectDetailsAPI_createProjectSteps(data,props.projectId,getToken(),handleLogoutRedirect)
    else
      await createProject(data,getToken(),handleLogoutRedirect)
  }
  const handleInput = (e:any) => {
    const inputValue = e.target.value;
    // const words = inputValue.split(/\s+/); // Split input value into words
    const remainingWords = Math.max(0, 18 - inputValue.length);
    setWordCount(remainingWords);
  };
  const handleSelect = (selectedId: any) => {
    const selectedOrg = organizationList.find((org: any) => org.id === selectedId);
    if (selectedOrg) {
      setOrgName(selectedOrg.name);
    }
  };
  
  useEffect(()=>{
    if(props.nameIsDuplicate==false){
      nextStep(formData,orgName)
      setProjectNameDuplicacyToNull()
    }
  },[props.nameIsDuplicate])
    return(
      <Form layout="vertical" size='middle' initialValues={props.projectId==null?undefined:formData}   onFinish={(v:any)=>{onFinish(v)}} >
            <Title level={1}>Name Your Project</Title>
            <Title level={5}>An project is the home for all the projects, teams, users and billing.</Title>
            <Form.Item {...layout} name="project_Name" label="Project Name" 
                        required 
                        tooltip={{ title: 'This item is required', icon: <InfoCircleOutlined /> }}
                        rules={[
                        
                            {
                              required: true,
                              message: 'Please enter project name!',
                            },
                          ]}>
              <Input maxLength={25} onInput={handleInput} />
                {/* <div style={{textAlign:'right',color:'red',fontSize:'12px'}}>
                  *{wordCount}/18
                </div> */}
            </Form.Item >
            {props.nameIsDuplicate && <p style={{color:'red',textAlign:'left'}}>{errorMessage}</p>}
            <Form.Item {...layout} label="Description" name="description"  required 
                    rules={[
                        {
                          required: true,
                          message: 'Please enter project description!',
                        },
                      ]}>
                    
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }}  />
            </Form.Item>
            <Form.Item {...layout} label="Organization" name="organization" required
              tooltip={{ title: 'This project should be a part of the organization', icon: <InfoCircleOutlined /> }}
              rules={[
                {
                  required:true,
                  message: `Please select any organization value !`,
                }
              ]}
            >
                  <Select onSelect={handleSelect}>
                    {organizationList?.map((op:any,index:number)=>{
                      return(
                      <Option key={op.name} value={op.id} props>
                      {op.name}
                    </Option>
                      )
                     })}  
                  </Select>
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
    nameIsDuplicate:state.CreateProject.nameIsDuplicate,
    projectId:state.CreateProject.projectId,
    projectName:state.CreateProject.projectName,
    projectDescription:state.CreateProject.projectDescription,
    organizationId:state.CreateProject.organizationId
  };
};

export default connect(mapStateToProps)(Project_Form)