import { Row,Col, Select, Card, Button, Form, Input, DatePicker,FormInstance, InputNumber } from "antd"
import { useEffect, useState } from "react"
import ParameterViewMode from './parameterViewMode'
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import RenderParameterCards from "./renderParameterCards"
import { IparameterObj } from "../../type"
import { RootState } from "../../state/reducers"
import { connect } from 'react-redux';
import { saveServiceParameters } from "../../state/new actions/serviceAction"
import { useLogoutRedirect, useToken } from "../../utils/getToken"
import { useRef } from 'react';



interface IServiceParameterForm{
    prevStep:()=>void,
    nextStep:(value:any)=>void,
    prevStepExists:boolean,
    nextStepExist:boolean,
    initialValues:IparameterObj[] | null,
    serviceId:string | null,
    serviceObj:any,
    serviceParametersSaving:boolean,
    serviceParameters:IparameterObj[] | null
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
function ServiceParameterForm({prevStep,nextStep,initialValues,prevStepExists,nextStepExist,serviceObj,serviceId,...props}:IServiceParameterForm){
    // const jsonArray:IparameterObj[]=[{"name":"Parameter 1","type":"value"},
    //                                 {"name":"Parameter 2","type":"Range","lowerBound":"1000","upperBound":"5000"},
    //                                 {"name":"Parameter 3","type":"Options","options":["first","second","third"]}]
    const [parameterJson,setParameterJson]= useState<IparameterObj[]>(initialValues==null?[]:initialValues)
    const [selectedParameterType,setSelectedParameterType]=useState<string>("Value")
    const [saveEnable,setSaveEnable]=useState(false)
    const [isMounted, setIsMounted] = useState(false);  // State to track if component has mounted
    const [optionNames,setOptionNames]=useState([])
    const [lowerBound,setLowerBound]=useState(null)
    const [upperBound,setUpperBound]=useState(null)

    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()

    // Inside your component function
    const formRef = useRef<FormInstance | null>(null);
    

    const isDuplicate = (target: string): boolean => {
        return parameterJson.some((item) =>  item.name === target);
      };


    async function handleParameterSave(){
        var parameters=parameterJson
        const data={
            serviceId,
            parameters
        }
        await saveServiceParameters(serviceObj,data,getToken(),handleLogoutRedirect)
        setIsMounted(false)
        nextStep(parameters)
    }   
    function previousStep(){
        prevStep()
    }
    const onFinis=(data:any)=>{
        setSaveEnable(true)
        var newObj:IparameterObj={"name":data.name,"type":data.type}
        if(selectedParameterType=="Range")
             newObj={"name":data.name,"type":data.type,"lowerBound":data.lowerBound,"upperBound":data.upperBound}
        else if(selectedParameterType=="Options")
             newObj={"name":data.name,"type":data.type,"options":data.options}
        else
             newObj={"name":data.name,"type":data.type}
        setParameterJson(prevArray=>[newObj,...prevArray])


    // Reset form fields if formRef.current exists
        if (formRef.current) {
            formRef.current.resetFields();
        }
        setSelectedParameterType("Value"); 

    }
    const onChange=(val:any)=>{
        setSelectedParameterType(val)
    }
    const deleteParameter=(index:number)=>{
        const newArray = parameterJson.filter((_, i) => i !== index);
        setParameterJson(newArray);
        setIsMounted(true)
    }
    const updateElementAtIndex = (index: number, updatedValue: IparameterObj) => {
        const newArray = parameterJson.map((element, i) => {
          if (i === index) {
            return updatedValue;
          }
          return element;
        });
        setParameterJson(newArray);
        setIsMounted(true)
      };
    
    const onLowerBoundChange=(lb:any)=>{
        setLowerBound(lb)
        if(upperBound!=null && lb>upperBound)
            return true
        else
            return false
    }
    const onUpperBoundChange=(ub:any)=>{
        setUpperBound(ub)
        if(lowerBound!=null && ub<lowerBound)
            return true
        else
            return false
    }
    
    useEffect(() => {
        if(isMounted)
            handleParameterSave();
    }, [parameterJson]); // Add parameterJson as a dependency
    
    return(
        <div >
            <Row justify={'start'} >
                <Col xs={24} style={{textAlign:'left',fontSize:17,marginBottom:'10px'}}>
                    Create the form by adding your own parameters
                </Col>
            </Row>
            <Row justify={'start'} style={{ height: '54vh', overflow: 'auto',paddingRight:'1vw'}}>
                
                <Col xs={24} >
                    <Card style={{textAlign:'left',borderColor:'gray'}}>
                        <Form  
                            layout="vertical"  
                            ref={formRef}
                            style={{fontSize:17}} 
                            onFinish={(v:any)=>{onFinis(v)}}
                            
                            >
                            <Form.Item label="Parameter Name:" name="name" required 
                             rules={[
                                {
                                  required: true,
                                  message: 'Please enter Parameter Name!',
                                },
                                {
                                    validator: async (_, name) => {
                                        if (isDuplicate(name)) {
                                            return Promise.reject(new Error('The names of parameter cannot be same'));
                                        }
                                        }
                                }
                              ]}
                            > 
                                <Input style={{width:300}}/>
                            </Form.Item>
                            <Form.Item label="Type of parameter:" name="type" required initialValue={"Value"}
                             rules={[
                                {
                                  required: true,
                                  message: 'Please select type of parameter!',
                                },
                              ]}
                            >
                                <Select 
                                
                                
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
                                ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (onLowerBoundChange(value)) {
                                        return Promise.reject('Lower bound cannot be greater than upper bound!');
                                    }
                                    return Promise.resolve();
                                },
                                }),
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
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (onUpperBoundChange(value)) {
                                            return Promise.reject('Upper bound cannot be less than lower bound!');
                                        }
                                        return Promise.resolve();
                                    },
                                    }),
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
                                        setOptionNames(names)
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
                                                {
                                                    validator: async (_, optionName) => {
                                                        const isDuplicate = optionNames.filter((obj:any) => obj === optionName).length > 1;
                                                        if (isDuplicate) {
                                                            return Promise.reject(new Error('Option names must be unique'));
                                                        }
                                                    },
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
                            <Form.Item style={{textAlign:'right'}}>
                                <Button type="primary" htmlType="submit" style={{width:'113px'}}>
                                    Add
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24}>
                            <RenderParameterCards myObject={parameterJson} deleteParameter={deleteParameter} updateElementAtIndex={updateElementAtIndex}/>
                </Col>  
            </Row>
            <Row justify={'end'}>
                { prevStepExists && <Col xs={4} style={{marginTop:'20px'}}>
                <div style={{ textAlign: 'right' }} >
                    <Button type="primary" htmlType="submit" onClick={previousStep} style={{width:'113px'}}>
                         Prev 
                    </Button> 
                  </div>
                </Col>}
                { nextStepExist && <Col xs={4} style={{marginTop:'20px'}}>
                <div style={{ textAlign: 'right' }} >
                    <Button type="primary" htmlType="submit" loading={props.serviceParametersSaving} onClick={handleParameterSave} style={{width:'113px'}}>
                         Next 
                    </Button> 
                  </div>
                </Col>}

                {!nextStepExist  && <Col xs={4} style={{marginTop:'20px'}}>
                {saveEnable && <div style={{ textAlign: 'right' }} >
                     <Button type="primary" htmlType="submit" loading={props.serviceParametersSaving} onClick={handleParameterSave} style={{width:'113px'}}>
                        Save
                    </Button> 
                  </div>}
                </Col>}
            </Row>
        </div>
    )
}
// export default ServiceParameterForm
const mapStateToProps = (state: RootState) => {
    return {
        serviceParametersSaving:state.ServiceReducer.serviceParametersSaving,
        serviceParameters:state.ServiceReducer.serviceParameters,

    };
  };
  
  export default connect(mapStateToProps)(ServiceParameterForm)