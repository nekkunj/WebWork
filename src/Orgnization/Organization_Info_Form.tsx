import { Breadcrumb, Button, Form, Input, Switch, Typography, notification } from "antd"
import { useEffect, useState } from "react";
import Users_List_Card from "./Users_List_Card";
import TextArea from "antd/es/input/TextArea";
import { updatingOrganizationDetailsAPI } from "../state/new actions/organizationAction";
import { CalendarOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const { Title } = Typography;
interface IOrganization_Info_Form{
    orgId:string,
    organizationDetails:any,
    organizationUpdateInProgress:boolean,
    organizationUpdateSuccess:boolean,
    fetchData:()=>void
}
const layout = {
    labelCol: { span: 6 },  
    wrapperCol: { span: 18 },   
  };

function Organization_Info_Form({orgId,organizationDetails,fetchData,...props}:IOrganization_Info_Form){
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const[status,setStatus]=useState(false)
    const [formData, setFormData] = useState({description:organizationDetails.description,status:organizationDetails.isOrganizationActive});
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
        if (isEditing)
        {
            organizationDetails.description=v.description
            organizationDetails.status=v.status
            await updatingOrganizationDetailsAPI(organizationDetails,getToken(),handleLogoutRedirect)
            setIsEditing(false)
            fetchData()
        }
        // form.resetFields();
    }
    function handleStatusChange(v:any){
            setIsEditing(true)
            setStatus(!status)
    }
    const handleDescriptionChange = (val:any) => {
        setIsEditing(true);

      };

    return(
        <>
            <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',width:'80%',margin:'0 auto'}}>
                <legend style={{fontSize:'20px'}}>Organization Details</legend>
            <Form layout="vertical"   initialValues={formData}  onFinish={(v:any)=>{onFinish(v)}} >
                <Form.Item {...layout} label="Created On" name="createdOn" style={{textAlign:'left'}} >
                    <Input disabled={true} defaultValue={DateComponent(organizationDetails.createdOn)} prefix={<CalendarOutlined />}/>
                </Form.Item> 
                <Form.Item {...layout} label="Description" name="description"   required 
                    rules={[
                        {   
                          required: true,
                          message: 'Please enter organization description!',
                        },
                      ]}>
                    
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }} onChange={handleDescriptionChange} style={{width:'100%'}} />
                </Form.Item>
                <Form.Item label="Status" name="status" valuePropName="checked" style={{textAlign:'left'}} >
                    <Switch  onChange={handleStatusChange}  />   
                </Form.Item>
                
                {isEditing ? (
                    <Form.Item  >
                        <div style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" style={{width:'113px'}}>
                            Save
                        </Button>
                        </div>
                    </Form.Item>
                ) : <div style={{minHeight:'50px'}}></div>}
            </Form>
            </fieldset>
        </>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
      organizationUpdateInProgress:state.OrganizationFetchReducer.organizationUpdateInProgress,
      organizationUpdateSuccess:state.OrganizationFetchReducer.organizationUpdateSuccess,
    };
  };
  
  export default connect(mapStateToProps)(Organization_Info_Form)