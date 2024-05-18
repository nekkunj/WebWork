import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, Modal, Select, Space } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useRef,Ref, useState } from "react";
import { IparameterObj } from "../type";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers"; 
import type { SelectProps } from 'antd';
import { assignNewServiceInProject } from "../state/new actions/projectAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const {Option}=Select
interface IServiceModal{
    unassignedServicesList:object[] | null,
    unassignedServices_InProgress:boolean,
    unassignedServicesFetch_Success:boolean,
    unassignedServices_Error:string | null,
    projectId:string,
    isOpen:boolean,
    handleClose:()=>void,
    organizationId:string,
    assignService:()=>void

}



function AddServiceModal({isOpen,projectId,handleClose,organizationId,assignService,...props}:IServiceModal){
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);
  const [formData, setFormData] = useState({});
  const [jsonObject,setJsonObject]=useState<IparameterObj[]>([])
  const [selectedServiceObj,setSelectedServiceObj]=useState<Object>({})
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()

  function onFormChange(val:any,parameterName:any){
    setJsonObject(prevObjects => {
      const updatedObjects = prevObjects.map(obj => {
        if (obj.name === parameterName) {
          return {
            ...obj,
            value: val,
          };
        }
        return obj;
      });
      return updatedObjects;
    });
  }
  
  

  const handleFormSubmit = () => {
    form.submit()
  };
  assignService()
  const onFinish=async (data:any)=>{
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toISOString(); // This will give you a string in the format "2024-03-17T19:06:02.226Z"

    const obj=
    {
      selectedServiceObj,
      jsonObject,
      projectId,
      organizationId,
      formattedDateTime
    }
    await assignNewServiceInProject(obj,getToken(),handleLogoutRedirect)
    setOpen(false);
    handleClose()

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setOpen(false);
    //   handleClose()
    // }, 3000);
  }

  const handleSelect=(v:any)=>{
    //On selecting one service
    if(props.unassignedServicesList)
      {
        const foundObject:any =props.unassignedServicesList.find((obj:any) => obj.name === v);
        const correctedJsonString = foundObject.parameterJsonData==null?null:foundObject.parameterJsonData.replace(/'/g, '"');
        setJsonObject(foundObject.parameterJsonData==""?[]:JSON.parse(correctedJsonString))
        setSelectedServiceObj(foundObject)
        
      }
    }
  const handleCancel = () => {
    handleClose()
  };



  return(
    <>
      <Modal 
          open={open}
          title="Add a Service"
          onOk={handleFormSubmit}
          onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={handleFormSubmit}>
            Add
          </Button>,
          
        ]}
                >
        <Form layout="vertical" form={form}  onFinish={onFinish} >
            <Form.Item label="Service Name" name="Service Name"   style={{textAlign:'left'}} required
              rules={[
                {
                  required: true,
                  message: 'Please enter service name!',
                }
              ]}>
                <Select 
                    showSearch
                    style={{ width: 300 }}
                    placeholder="Find  a service"
                    optionFilterProp="children"
                    onSelect={handleSelect}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={props.unassignedServicesList?props.unassignedServicesList.map((item:any) => ({ label: item.name, value: item.name })) : undefined}
                    dropdownRender={(menu) => (
                        <>
                        {menu}
                        </>
                    )}
                />
            </Form.Item>
            {jsonObject && jsonObject.length>0 && <h4>Please complete the service form :</h4>}
            {jsonObject && jsonObject.map((obj)=>{
              
              return(
                <>
                  {obj.type=="Value"  && 
                  <Form.Item label={obj.name} name={obj.name} initialValue={obj.value} required rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Input style={{ width: 300 }} onChange={(v)=>{onFormChange(v.target.value,obj.name)}}/>
                  </Form.Item>
                  }

                  {obj.type=="Text"  && 
                  <Form.Item label={obj.name} name={obj.name} initialValue={obj.value} required rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Input style={{ width: 300 }} onChange={(v)=>{onFormChange(v.target.value,obj.name)}}/> 
                  </Form.Item>
                  }

                  {obj.type=="Range" && 
                  <Form.Item label={obj.name} name={obj.name} initialValue={obj.value} required rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <InputNumber min={obj.lowerBound} max={obj.upperBound} style={{ width: 300 }} onChange={(v)=>{onFormChange(v,obj.name)}}/>
                  </Form.Item>
                  }
                  {obj.type=="Options" &&  obj.options && obj.options.length>0 &&
                  <Form.Item label={obj.name} name={obj.name}  required initialValue={obj.value} rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Select style={{ width: 300 }} onChange={(v)=>{onFormChange(v,obj.name)}}>
                    {obj.options?.map((op:string)=>{
                      return(
                      <Option key={op} value={op}>
                      {op}
                    </Option>
                      )
                     })}  
                  </Select>
                  </Form.Item>
                  }
                </>
              )
            })}
        </Form>
        </Modal>
        </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    unassignedServicesList:state.UnassignedServicesReducer.unassignedServicesList,
    unassignedServices_InProgress:state.UnassignedServicesReducer.unassignedServices_InProgress,
    unassignedServicesFetch_Success:state.UnassignedServicesReducer.unassignedServicesFetch_Success,
    unassignedServices_Error:state.UnassignedServicesReducer.unassignedServices_Error,
  };
};

// export default CreateServiceForm
export default connect(mapStateToProps)(AddServiceModal)