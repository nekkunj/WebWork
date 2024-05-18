import { DeleteOutlined } from "@ant-design/icons"
import { Card, Col, Row, Tag } from "antd"
import { useState } from "react"
import ParameterEditMode from "./parameterEditMode"
import { IparameterObj } from "../../type"

interface IParameterViewMode{
    jsonObject:IparameterObj,
    index:number,
    deleteParameter:(index:number)=>void,
    updateElementAtIndex:(index: number, updatedValue: IparameterObj)=>void

}

function ParameterViewMode({jsonObject,index,deleteParameter,updateElementAtIndex}:IParameterViewMode){
    const [editMode,setEditMode]=useState<boolean>(false)
    const openEditMode=()=>{
        setEditMode(true)
    }
    const updateParameter=(index: number, updatedValue: IparameterObj)=>{
        updateElementAtIndex(index,updatedValue)
        setEditMode(false)
    }
    const deletePara=()=>{
        setEditMode(false)
        deleteParameter(index)
    }
    return(
        <>
        {!editMode && <Card title={jsonObject.name} 
            // extra={<a href="#">Edit</a>}
            style={{marginTop:'20px',textAlign:'left',borderColor:'lightgrey'}}
            actions={[<a href="#" style={{color:'blue'}} onClick={openEditMode}>Edit</a>,
                      <DeleteOutlined data-testid="delete-icon" style={{color:'red',fontSize:17}} onClick={()=>{deleteParameter(index)}}/>
                    ]}
        >
            <Row>
                <Col xs={6} style={{fontWeight:'bold'}}>Type:</Col>
                <Col xs={12}>{jsonObject.type}</Col>
            </Row>
            {jsonObject.lowerBound && <Row>
                <Col xs={6} style={{fontWeight:'bold'}}>Lower Bound :</Col>
                <Col xs={12}>{jsonObject.lowerBound}</Col>
            </Row>}
            {jsonObject.upperBound && <Row>
                <Col xs={6} style={{fontWeight:'bold'}}>Upper Bound :</Col>
                <Col xs={12}>{jsonObject.upperBound}</Col>
            </Row>}
            {jsonObject.options && jsonObject.options.length>0 && <Row>
                <Col xs={6} style={{fontWeight:'bold'}}>Options:</Col>
                <Col xs={12}>
                    {jsonObject.options.map((op:string)=>{
                return(
                    <Tag color="gray">{op}</Tag>
                    )
                })}
                </Col>
                </Row>
            }

        </Card>}
        {editMode && <ParameterEditMode index={index} 
                                deleteParameter={deletePara} jsonObject={jsonObject}
                                updateElementAtIndex={updateParameter}/>}
        </>
    )
}
export default ParameterViewMode