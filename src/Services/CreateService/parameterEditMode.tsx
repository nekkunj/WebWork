import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Card, Form, Input, InputNumber,Button, Select } from "antd";
import { useState } from "react";
import { IparameterObj } from "../../type"

interface IParameterEditMode{
    jsonObject:IparameterObj,
    index:number,
    deleteParameter:(index:number)=>void,
    updateElementAtIndex:(index: number, updatedValue: IparameterObj)=>void

}


const formItemLayout = {
    labelCol: {
      xs: { span: 24 }, 
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
function ParameterEditMode({jsonObject,index,deleteParameter,updateElementAtIndex}:IParameterEditMode){
    const [form] = Form.useForm();
    const [selectedParameterType,setSelectedParameterType]=useState<string>(jsonObject.type)
    const [parameterJson,setParameterJson]= useState<IparameterObj>(jsonObject)
    const onChange=(val:any)=>{
        setSelectedParameterType(val)
    }
    const onFinish=(data:any)=>{
        var newObj:IparameterObj={"name":data.name,"type":data.type}
        if(selectedParameterType=="Range")
             newObj={"name":data.name,"type":data.type,"lowerBound":data.lowerBound,"upperBound":data.upperBound}
        else if(selectedParameterType=="Options")
             newObj={"name":data.name,"type":data.type,"options":data.options}
        else
             newObj={"name":data.name,"type":data.type}
        setParameterJson(newObj)
        updateElementAtIndex(index,newObj)
    }
    const submitForm=()=>{
        form.submit()
    }
    return(
        <Card style={{textAlign:'left',marginTop:'20px'}}
        actions={[<a href="#" onClick={submitForm}>Save</a>,
                      <DeleteOutlined data-testid="delete-icon" onClick={()=>{deleteParameter(index)}}/>
                    ]}
        >
            
            <Form form={form} layout="vertical"  
                style={{fontSize:17}} 
                initialValues={jsonObject}
                onFinish={onFinish}
            >
                
                <Form.Item label="Parameter Name:" name="name" required 
                rules={[
                    {
                    required: true,
                    message: 'Please enter Parameter Name!',
                    },
                ]}
                >
                    <Input style={{width:300}}/>
                </Form.Item>
                <Form.Item label="Type of parameter:" name="type" required
                rules={[
                    {
                    required: true,
                    message: 'Please select type of parameter!',
                    },
                ]}
                >
                    <Select 
                    defaultValue={'Value'}
                    placeholder="Type of parameter"
                    onChange={onChange}
                    style={{ width: 300,fontSize:17 }}
                    options={[
                        { value: 'Value', label: 'Value' },
                        { value: 'Range', label: 'Range' },
                        { value: 'Options', label: 'Options' },
                    ]}
                    />
                </Form.Item>
                { selectedParameterType=="Range" &&
                <Form.Item label="Lower Bound of range" name="lowerBound" required
                rules={[
                    {
                    required: true,
                    message: 'Please enter lower bound!',
                    },
                ]}
                >
                    <InputNumber
                    style={{ width: 300,fontSize:17 }}
                    />
                </Form.Item>
                }
                { selectedParameterType=="Range" &&
                <Form.Item label="Upper Bound of range" name="upperBound" required
                rules={[
                    {
                    required: true,
                    message: 'Please enter upper bound!',
                    },
                ]}
                >
                    <InputNumber
                    style={{ width: 300,fontSize:17 }}
                    />
                </Form.Item>}
                { selectedParameterType=="Options" && <Form.Item  >
                    <Form.List
                        
                        name="options"
                        rules={[
                        {
                            validator: async (_, names) => {
                            if (!names || names.length < 1) {
                                return Promise.reject(new Error('At least 1 option'));
                            }
                            },
                        },
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                            <Form.Item
                                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                label={index === 0 ? 'Options' : ''}
                                required={false}
                                key={field.key}
                            >
                                <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[
                                    {
                                    required: true,
                                    whitespace: true,
                                    message: "Please input option name or delete this field.",
                                    },
                                ]}
                                noStyle
                                >
                                <Input placeholder="Option name" style={{ width: 300 }} />
                                </Form.Item>
                                {fields.length > 1 ? (
                                <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => remove(field.name)}
                                />
                                ) : null}
                            </Form.Item>
                            ))}
                            <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                style={{ width: 300 }}
                                icon={<PlusOutlined />}
                            >
                                Add field
                            </Button>
                            <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                </Form.Item>
                }

            </Form>
        </Card>
    )
}
export default ParameterEditMode