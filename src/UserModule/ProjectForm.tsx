import { Button, Form, Input, Switch, Typography, notification } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { updatingProjectDetailsAPI } from "../state/new actions/projectAction";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import { CalendarOutlined } from "@ant-design/icons";
const { Title } = Typography;

interface IProjectForm{
    data:any,
    projectId:string,
    orgId:string,
    userRole:string,
    projectUpdateInProgress:boolean,
    projectUpdateSuccess:boolean,
}

const layout = {
    labelCol: { span: 6 },  
    wrapperCol: { span: 18 },
  };
function ProjectForm({data,orgId,projectId,userRole,...pops}:IProjectForm){
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const[status,setStatus]=useState(false)
    const [formData, setFormData] = useState(data);
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()


    function DateComponent(mongoDbDate:string){
      if(mongoDbDate == undefined)
        return "Data not exist"
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
    const handleCreateService=()=>{
      setIsEditing(true)
    }
    const handleProjectNameChange=()=>{
      setIsEditing(true)
    }
    useEffect(()=>{
      if(pops.projectUpdateSuccess){
        notification.success({
          message: 'Project details updated successfully',
        });
      }
    },[pops.projectUpdateSuccess])

    const isEnabled = userRole === 'OrganizationAdmin';
    return(
        <>
            <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',width:'80%',margin:'0 auto'}}>
            <legend style={{fontSize:'20px'}}>Project Details</legend>
            <Form layout="vertical"  form={form} initialValues={formData} onFinish={onFinish} >
              <Form.Item {...layout} label="Created On" name="createdOn" style={{textAlign:'left'}} >
                    <Input disabled={true} value={DateComponent(data.createdOn)} prefix={<CalendarOutlined />}/>
                </Form.Item>
                <Form.Item {...layout} label="Name" name="name"  required
                  rules={[
                      {
                      required: true,
                      message: 'Please enter project Name!',
                    },
                  ]}>
                    <Input disabled={true} onChange={handleProjectNameChange}/>
                </Form.Item>
                <Form.Item {...layout} label="Description" name="description" required
                    rules={[
                        {
                          required: true,
                          message: 'Please enter project description!',
                        },
                      ]}>
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }} disabled={!isEnabled}  onChange={handleProjectNameChange}/>
                </Form.Item>
                <Form.Item label="Status" name="isProjectActive" valuePropName="checked" style={{textAlign:'left'}} >
                    <Switch disabled={!isEnabled} onChange={handleStatusChange}  />   
                </Form.Item>

                {isEnabled && <Form.Item > 
                  <div style={{ textAlign: 'right' }}>
                    {  Object.keys(formData).length ===0 &&  
                      <Button type="primary" htmlType="submit" style={{width:'113px'}}> Create </Button> 
                    } {/*Creation Mode*/}
                    { isEditing==true  &&  
                      <Button type="primary" onClick={handleSaveService} htmlType="submit" style={{width:'113px'}}> Save </Button> 
                    } {/*Saving Mode*/}
                  </div>
                </Form.Item> }
            </Form>
            </fieldset>
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