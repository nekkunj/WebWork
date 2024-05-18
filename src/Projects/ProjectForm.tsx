import { Button, Form, Input, Switch, Typography, notification } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { updatingProjectDetailsAPI } from "../state/new actions/projectAction";
import { CalendarOutlined } from "@ant-design/icons";
import { RootState } from "../state/reducers";
import { connect } from "react-redux";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const { Title } = Typography;

interface IProjectForm{
    projectId:string,
    data:any,
    orgId:string,
    projectUpdateInProgress:boolean,
    projectUpdateSuccess:boolean,
}

const layout = {
    labelCol: { span: 6 },  
    wrapperCol: { span: 18 },
  };
function ProjectForm({data,orgId,projectId,...props}:IProjectForm){
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const[status,setStatus]=useState(false)
    const [formData, setFormData] = useState(data);
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
  

    function DateComponent(mongoDbDate:string){
      // Assuming createdAt is a Date object fetched from MongoDB
      const createdAt: Date = new Date(mongoDbDate);

      // Get the local time zone offset in minutes
      const timeZoneOffset: number = new Date().getTimezoneOffset();

      // Apply the offset to get the local time
      const localTime: Date = new Date(createdAt.getTime() - timeZoneOffset * 60000);

      // Convert the local time to a string representation
      //toLocaleString for date and time
      //toLocaleDateString for just date
      const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(localTime);
      // const localDateTimeString: string = localTime.toLocaleDateString();

  return formattedTimestamp
  }
    async function onFinish(v:any){
        setFormData(v);
        const obj={
            name:v.name,
            description:v.description,
            isProjectActive:v.isProjectActive,
            id:projectId,
            services:data.services,
            projectUsers:data.projectUsers,
            createdOn:data.createdOn
        }
        await updatingProjectDetailsAPI(obj,orgId,getToken(),handleLogoutRedirect)
    }
    function handleStatusChange(v:any){
        setIsEditing(true)
        setStatus(!status)
}
    const handleEditService=()=>{
      setIsEditing(true)
    }
    const handleSaveService=()=>{
      form.submit()
      setIsEditing(false)
    }

    const handleProjectNameChange=()=>{
      setIsEditing(true)
    }
    const handleDescriptionChange = (val:any) => {
      setIsEditing(true);
      // if((val.target.value==formData.description))
      //     setIsEditing(false)
    };
    // useEffect(()=>{
    //   if(props.projectUpdateSuccess){
    //     notification.success({
    //       message: 'Project details updated successfully',
    //     });
    //   }
    // },[props.projectUpdateSuccess])
    return(
        <>
          <fieldset style={{backgroundColor:'white',borderRadius:'10px',height:'70vh',padding:'10px',width:'85%',margin:'0 auto'}}>
                <legend style={{fontSize:'20px'}}>Project Details</legend>
            <Form layout="vertical"  form={form} initialValues={formData} onFinish={onFinish} >
                {/* <Title level={2}>Service Details</Title> */}
                {'createdOn' in formData && <Form.Item {...layout} label="Created On" name="createdOn" style={{textAlign:'left'}} >
                    <Input disabled={true} defaultValue={DateComponent(data.createdOn)} prefix={<CalendarOutlined />}/>
                </Form.Item>} 
                <Form.Item {...layout} label="Name" name="name"  required
                  rules={[
                      {
                      required: true,
                      message: 'Please enter project Name!',
                    },
                  ]}>
                    <Input  onChange={handleProjectNameChange} disabled={true}/>
                </Form.Item>
                <Form.Item {...layout} label="Description" name="description" required
                    rules={[
                        {
                          required: true,
                          message: 'Please enter project description!',
                        },
                      ]}>
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }}  onChange={handleDescriptionChange}/>
                </Form.Item> 
                <Form.Item label="Status" name="isProjectActive" valuePropName="checked" style={{textAlign:'left'}} >
                    <Switch onChange={handleStatusChange}  />   
                </Form.Item>

                <Form.Item > 
                  <div style={{ textAlign: 'right' }}>
                    {/* { isEditing==false && Object.keys(formData).length > 0 &&  
                      <Button onClick={handleEditService} type="primary" htmlType="submit" style={{width:'113px'}}> Edit </Button> 
                    } Edit Button */}
                    {  Object.keys(formData).length ===0 &&  
                      <Button type="primary" htmlType="submit" style={{width:'113px'}}> Create </Button> 
                    } {/*Creation Mode*/}
                    { isEditing==true  &&  
                      <Button type="primary" onClick={handleSaveService} htmlType="submit" style={{width:'113px'}}> Save </Button> 
                    } {/*Saving Mode*/}
                  </div>
                </Form.Item>
            </Form>
            </fieldset >
        </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    projectUpdateInProgress:state.ProjectReducer.projectUpdateInProgress,
    projectUpdateSuccess:state.ProjectReducer.projectUpdateSuccess
  };
};

export default connect(mapStateToProps)(ProjectForm)