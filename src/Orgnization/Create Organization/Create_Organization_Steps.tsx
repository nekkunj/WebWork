import { Button, Col, Steps } from "antd"
import { LoginOutlined } from "@ant-design/icons"
import { useState } from "react"
import { connect } from 'react-redux';
import { RootState } from "../../state/reducers"
import Organization_Form from "./Organization_Form"
import Organization_Creation_Success from "./Organization_Creation_Success"
import Users_List_Card from "../Users_List_Card"
import ServicesList from "../ServicesList"
interface ICreate{
    servicesList:object | null,
    usersList:object | null,
    organizationId:string | null,
    documentId:string | null, //organizationId and documentId are same as per new SQL database, there is no such documentId.
    organizationName:string | null,
    organizationDescription:string | null,
    createOrganization_InProgress:boolean,
    createOrganization_Success:boolean,
    createOrganization_Error:string | null,
}
function Create_Organization_Steps({...props}:ICreate){
    const [current,setCurrent]=useState(0)
    const [organization_Details,setOrganization_Details]=useState<any>({})
    const [project_Details,setProject_Details]=useState(null)
    const onFinishOrganizationForm=(values:any)=>{
        setOrganization_Details(values)
        setCurrent(1)
    }
    const onFinish_ServiceTab=()=>{
        setCurrent(2)
    }
    const onFinish_UsersTab=()=>{
        setCurrent(3)
    }
    const onPrevStep=()=>{
        const temp=current
        setCurrent(temp - 1)
    }
    const forms=[
        <Organization_Form nextStep={onFinishOrganizationForm}/>,
        <ServicesList fetchData={()=>{console.log("Service Deleted")}} prevStepExists={true} nextStepExist={true} prevStep={onPrevStep} nextStep={onFinish_ServiceTab} orgId={props.documentId?props.documentId:""} assignedServices={[]} cardData={[]} />,
        <Users_List_Card prevStepExists={true} nextStepExist={true} prevStep={onPrevStep} nextStep={onFinish_UsersTab} orgId={props.documentId?props.documentId:""} orgName={organization_Details.organization_Name} cardData={[]}/>,
        // <Organization_Creation_Success val={organization_Details?.organiaationName}/>
    ]
    return(
        <>
        <Steps onChange={setCurrent} current={current} className="disable-click">
            <Steps.Step title="Create An Organization"  />
            <Steps.Step title="Add Service"  />
            <Steps.Step title="Add Users"  />
            {/* <Steps.Step title="Success"  /> */}
        </Steps>
        {forms[current]}

        </>

    )
}
const mapStateToProps = (state: RootState) => {
  return {
    servicesList:state.OrganizationFetchReducer.servicesList,
    usersList:state.OrganizationFetchReducer.usersList,
    organizationId:state.CreateOrganization.organizationId,
    documentId:state.CreateOrganization.documentId,
    organizationName:state.CreateOrganization.organizationName,
    organizationDescription:state.CreateOrganization.organizationDescription,
    createOrganization_InProgress:state.CreateOrganization.createOrganization_InProgress,
    createOrganization_Success:state.CreateOrganization.createOrganization_Success,
    createOrganization_Error:state.CreateOrganization.createOrganization_Error
  };
};

export default connect(mapStateToProps)(Create_Organization_Steps)