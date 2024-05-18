import { Button, Form, Input, InputNumber, Modal, Table,Select, Row, Col } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { IparameterObj } from "../type";
import { Typography } from 'antd';
import { updatingProjectServiceParameterDetailsAPI } from "../state/new actions/projectAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const { Title } = Typography;
const { Option } = Select;
interface IServiceModal{
    isOpen:boolean,
    handleClose:()=>void,
    document:any,
    projectId:string
}
function ServiceModal({isOpen,handleClose,document,projectId}:IServiceModal){
  const [form] = Form.useForm();
  const temp:IparameterObj[]=[{"name":"Parameter 1","type":"value","value":"example 1"},
  {"name":"Parameter 2","type":"Range","lowerBound":"1000","upperBound":"5000","value":"3000"},
  {"name":"Parameter 3","type":"Options","options":["first","second","third"],"value":"second"}]
  const [jsonObject,setJsonObject]=useState<IparameterObj[]>(temp)
  const [loading, setLoading] = useState(false);
  const [iframeMode, setLoadiniframeMode] = useState(true);
  const [open, setOpen] = useState(isOpen);
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()

  const columns=[{
    title:'Parameter',
    dataIndex:'parameter',
    key:'paramter'
  },
  {
    title:'Values',
    dataIndex:'values',
    key:'values'
},]
  const data=[
    {
      key: '1',
      parameter: 'Mike',
      values: 32,
    },
    {
      key: '2',
      parameter: 'Mike',
      values: 32,
    },
  ]

  const handleOk = () => {
    form.submit()
  };

  const handleCancel = () => {
    setOpen(false);
    handleClose()
  };
  const handleBack=()=>{
    setOpen(false);
    handleClose()
  }

  const onFinish=async (val:any)=>{
    document.parameterJsonData.forEach((param:any)=>{
      if (val.hasOwnProperty(param.name)) {
        param.value = val[param.name];
      }
    });
    const parameters=document.parameterJsonData
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toISOString(); // This will give you a string in the format "2024-03-17T19:06:02.226Z"
    
    
    const data={
      document,
      projectId,
      parameters,
      formattedDateTime
    }

    await updatingProjectServiceParameterDetailsAPI(data,getToken(),handleLogoutRedirect)
    setOpen(false);
    handleClose() 
  }
console.log(document)
    return(
        <>
            <Modal 
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                width={'58vw'}
                bodyStyle={{height:'60vh'}}
                

        footer={[
          <Button key="back" onClick={handleBack}>
            Back
          </Button>,
           <Button key="submit" type="primary" loading={loading} onClick={document.parameterJsonData === "" || document.parameterJsonData == null ? handleCancel:handleOk}>
           {document.parameterJsonData === "" || document.parameterJsonData == null  ? 'Close' : 'Save'}
       </Button>,
        ]}
                >
        <Row style={{marginTop:'10px',marginBottom:'10px'}}>
          <Col xs={24} style={{fontSize:15}}>
          <b>Service Name</b>
          </Col>
          <Col xs={24} style={{fontSize:15}}>
          {document.name}
          </Col>
        </Row>
         <Row style={{marginTop:'10px',marginBottom:'10px'}}>
          <Col xs={24} style={{fontSize:15}}>
          <b>Service Description</b>
          </Col>
          <Col xs={24} style={{fontSize:15}}>
          {document.description}
          </Col>
        </Row>
        <Row>
          <Col xs={24} style={{fontSize:15}}>
          <b>Service Parameters</b>
          </Col>
        </Row>
        {document.parameterJsonData && document.parameterJsonData.length==0 && <>No Parameters</>}
        <Form form={form} layout="vertical" onFinish={onFinish}  onChange={(v:any)=>{}} >
            {document.parameterJsonData &&  document.parameterJsonData.map((obj:any)=>(
              
                <>
                  {obj.type=="Value"  && 
                  <Form.Item label={obj.name} name={obj.name} key={obj.name} required initialValue={obj.value} rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Input style={{ width: 300 }}/>
                  </Form.Item>
                  }

                  {obj.type=="Text"  && 
                  <Form.Item label={obj.name} name={obj.name} key={obj.name} required initialValue={obj.value} rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Input style={{ width: 300 }}/> 
                  </Form.Item>
                  }

                  {obj.type=="Range" && 
                  <Form.Item label={obj.name} name={obj.name} key={obj.name} required initialValue={obj.value} rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <InputNumber min={obj.lowerBound} max={obj.upperBound} style={{ width: 300 }}/>
                  </Form.Item>
                  }
                  {obj.type=="Options" &&  obj.options && obj.options.length>0 &&
                  <Form.Item label={obj.name} name={obj.name} key={obj.name} required initialValue={obj.value} 
                  rules={[
                    {
                      required:true,
                      message: `Please enter ${obj.name} value !`,
                    }
                  ]}>
                  <Select style={{ width: 300 }}>
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
            )}
                    
          </Form> 
        </Modal>
        </>
    )
}
export default ServiceModal