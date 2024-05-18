import { Button, Col, Steps } from "antd"
import { LoginOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { useState } from "react"
import { connect } from 'react-redux';
import { RootState } from "../../state/reducers"
import Project_Form from "./Project_Form"
import Project_Creation_Success from "./Project_Creation_Success"
import Project_Users_List_Card from "../Project_Users_List_Card"
import ServicesList from "../Project_ServicesList"
import { fetchOrganizationDetails_forGeneralUsers } from "../../state/new actions/organizationAction";
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect,useToken } from "../../utils/getToken";
import { fetchOrganizationDetails } from "../../state/new actions/organizationAction";
interface ICreate{
    organizationList:object[] | null,
    organizationId:string | null,
    servicesList:object | null,
    usersList:object | null,
    projectId:string | null,
    documentId:string | null,
    projectName:string | null,
    projectDescription:string | null,
    createProject_InProgress:boolean,
    createProject_Success:boolean,
    createProject_Error:string | null,
    fetchError:string | null,
    userRoleAccess:any,
    role:string | null,

    
}
function Create_Project_Steps({userRoleAccess,...props}:ICreate){
    const [current,setCurrent]=useState(0)
    const [organization_Details,setOrganization_Details]=useState<any>({})
    const [project_Details,setProject_Details]=useState(null)
    const [orgName,setOrgName]=useState("")
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
    let prop:any
    const { instance } = useMsal();

    const onProjectForm=(values:any,orgName:string)=>{
        setOrganization_Details(values)
        setOrgName(orgName)
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
        <Project_Form nextStep={onProjectForm} organizationList={props.organizationList}/>,
        <ServicesList fetchData={()=>{console.log("In create Project")}} prevStepExists={true} nextStepExist={true} prevStep={onPrevStep} nextStep={onFinish_ServiceTab} orgId={organization_Details?.organization} projectId={props.projectId?props.projectId:""} cardData={[]} />,
        <Project_Users_List_Card projectName={organization_Details.project_Name} orgName={orgName} prevStepExists={true} nextStepExist={true} prevStep={onPrevStep} nextStep={onFinish_UsersTab}  organizationId={props.organizationId?props.organizationId:""} projectId={props.projectId?props.projectId:""} cardData={[]}/>,
        <Project_Creation_Success val={organization_Details.projectName}/>
    ]
    useEffect( ()=>{
        const fetchData=async(userEmail:any)=>{
            await fetchOrganizationDetails_forGeneralUsers(userEmail,getToken(),handleLogoutRedirect)
        }
        const fetch_SuperAdminData=async()=>{
            await fetchOrganizationDetails(getToken(),handleLogoutRedirect)
        }
        if(instance && props.organizationList==null && props.fetchError==null){ // To avoid repeatedly database call
            const activeAccount:any = instance.getActiveAccount();
            prop=instance.getActiveAccount()?.idTokenClaims
            if(props.role=="Super Admin")
                fetch_SuperAdminData()
            else
                fetchData(prop.preferred_username)
        }
      })
    return(
        <>
        <Steps onChange={setCurrent} current={current} className="disable-click">
            <Steps.Step title="Create Project"  />
            <Steps.Step title="Add Service"  />
            <Steps.Step title="Add Users"  />
            <Steps.Step title="Success"  />
        </Steps>
        {forms[current]}

        </>

    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationList:state.OrganizationFetchReducer.organizationList,
    servicesList:state.ProjectReducer.servicesList,
    usersList:state.ProjectReducer.usersList,
    projectId:state.CreateProject.projectId,
    documentId:state.CreateProject.documentId,
    projectName:state.CreateProject.projectName,
    projectDescription:state.CreateProject.projectDescription,
    createProject_InProgress:state.CreateProject.createProject_InProgress,
    createProject_Success:state.CreateProject.createProject_Success,
    createProject_Error:state.CreateProject.createProject_Error,
    fetchError:state.OrganizationFetchReducer.fetchError,
    organizationId:state.CreateProject.organizationId,
    role:state.RoleReducer.role,

  };
};

export default connect(mapStateToProps)(Create_Project_Steps)