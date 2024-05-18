import { Button, Form, Input, Typography } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { updateServiceInfo } from "../state/new actions/serviceAction";
import { CalendarOutlined } from "@ant-design/icons";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const { Title } = Typography;

interface IServiceForm{
    data:any
}

const layout = {
    labelCol: { span: 6 },  
    wrapperCol: { span: 18 },
  };
function ServiceForm({data}:IServiceForm){
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(data);
    const getToken = useToken();
    const handleLogoutRedirect = useLogoutRedirect();
  
    async function onFinish(v:any){
        let obj=formData
        obj.description= v.description
        obj.url= v.url
        setFormData(obj);
        await updateServiceInfo(obj,getToken(),handleLogoutRedirect)
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
    return(
        <>
          <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',height:'70vh',width:'80%',margin:'0 auto'}}>
            <legend style={{fontSize:'20px'}}>Service Details</legend>
            <Form layout="vertical"  form={form} initialValues={formData} onFinish={onFinish} >
                {/* <Title level={2}>Service Details</Title> */}
                <Form.Item {...layout} label="Created On" name="createdOn" style={{textAlign:'left'}} >
                    <Input disabled={true} defaultValue={DateComponent(data.createdOn)} prefix={<CalendarOutlined />}/>
                </Form.Item> 
                <Form.Item {...layout} label="Name" name="name"  required
                  rules={[
                      {
                      required: true,
                      message: 'Please enter service details!',
                    },
                  ]}>
                    <Input onChange={handleEditService} disabled={true}/>
                </Form.Item>
                <Form.Item {...layout} label="Description" name="description" required
                    rules={[
                        {
                          required: true,
                          message: 'Please enter service description!',
                        },
                      ]}>
                    <TextArea autoSize={{ minRows: 5, maxRows: 6 }} onChange={handleEditService} />
                </Form.Item>
                <Form.Item {...layout} label="URL" name="url" required 
                    rules={[
                        {
                          required: true,
                          message: 'Please enter service URL!',
                        },
                      ]}>
                    <Input onChange={handleEditService}/>
                </Form.Item>
                <Form.Item > 
                  <div style={{ textAlign: 'right' }}>
                    {  Object.keys(formData).length ===0 &&  
                      <Button type="primary" htmlType="submit" style={{width:'113px'}}> Create </Button> 
                    } {/*Creation Mode*/}
                    { isEditing==true  &&  
                      <Button type="primary" onClick={handleSaveService} htmlType="submit" style={{width:'113px'}}> Save </Button> 
                    } {/*Saving Mode*/}
                  </div>
                </Form.Item>
            </Form>
          </fieldset>
        </>
    )
}
export default ServiceForm