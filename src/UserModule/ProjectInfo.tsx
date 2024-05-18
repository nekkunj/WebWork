import { Button, Col, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import Organization_Info_Form from "../Orgnization/Organization_Info_Form";
import ServicesList from "./Project_ServicesList";
import Users_List_Card from "../Orgnization/Users_List_Card";
import Project_Users_List_Card from "./Project_Users_List_Card";
import ProjectForm from "./ProjectForm";
import { useEffect, useState } from "react";
import UserManagementUsersListCard from "./Users_List_Card_UserM"
import GeneralUser_Organization_Info_Form from "./GeneralUser_Organization_Info_Form";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import { fetchProject_ServiceDetails } from "../state/new actions/generalUserAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import ContentLoader from "react-content-loader";

interface IProjectInfo{
    projectObj:any,
    orgId:string,
    projectId:string, 
    organizationDetails:any,
    organizationObj:any,
    servicesList:object[] | null,
    usersList:any,
    userRole:string,
    fetchData:()=>void,
    fetchingProjectDetailsSuccess:boolean,
    projectFetchSuccess:boolean
}

function ProjectInfo({orgId,projectId,userRole,organizationDetails,servicesList,usersList,fetchData,...props}:IProjectInfo){

    const [servicesTabData, setServicesTabData]=useState<any>()
    const [usersCardData,setUsersCardData]=useState<{ userEmail: string; createdOn: string; roleName: string; }[]>([])
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()


    useEffect(()=>{
      if(servicesList){
        let temp = servicesList.map((data: any) => {
          if (typeof data.parameterJsonData === 'string') {
              const correctedJsonString = data.parameterJsonData.replace(/'/g, '"');
              return {
                  ...data,
                  parameterJsonData: correctedJsonString === "" ? null : JSON.parse(correctedJsonString)
              };
          }
          return data;
      });
      setServicesTabData(temp);
      setUsersCardData(usersList)
        // setServicesTabData(serviceNames.filter((obj:any) => obj.projectId === projectNames.projectId))
      }
    },[servicesList])
    useEffect(()=>{
      const fetchServiceD=async()=>{
        await fetchProject_ServiceDetails(projectId,getToken(),handleLogoutRedirect)
      }
      fetchServiceD()
    },[])
    const projectItems:TabsProps['items']=[
      {
        key: '1',
        label: `Project Info`,
        children: <ProjectForm orgId={orgId} projectId={projectId} data={props.projectObj} userRole={userRole}/>,
      },
      {
          key: '2',
          label: `Services`,
          children: <ServicesList fetchData={fetchData} projectId={projectId} userRole={userRole} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false}   orgId={orgId} cardData={servicesTabData} />,
      },
      {
          key: '3',
          label: `Users`,
          children: <UserManagementUsersListCard projectName={props.projectObj?.name} orgName={organizationDetails.name} organizationId={orgId} userRole={userRole} projectId={props.projectObj?.id} cardData={usersCardData}/>,
        }]
        const organizationItems:TabsProps['items']=[
          {
            key:'1',
            label:'Organization Info',
            children:props.organizationObj && <GeneralUser_Organization_Info_Form orgId={orgId} userRole={userRole} organizationDetails={props.organizationObj} />
          },
          {
            key: '2',
            label: `Project Info`,
            children: <ProjectForm orgId={orgId} projectId={projectId} data={props.projectObj} userRole={userRole}/>,
          },
          {
              key: '3',
              label: `Services`,
              children: <ServicesList fetchData={fetchData} projectId={projectId} userRole={userRole} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false}   orgId={orgId} cardData={servicesTabData} />,
          },
          {
              key: '4',
              label: `Users`,
              children: <UserManagementUsersListCard projectName={props.projectObj?.name} orgName={organizationDetails.name} organizationId={orgId} userRole={userRole} projectId={props.projectObj?.id} cardData={usersCardData}/>,
            }]
        const onChange = (key: string) => {
            // console.log(key);
          };
  const isDisabled = userRole === 'Reader' || userRole === 'Writer' || userRole === 'ProjectAdmin';
    return(
      <>
      {!props.fetchingProjectDetailsSuccess &&<ContentLoader 
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{width:'100%',height:'100vh'}}
        viewBox="0 0 100% 100%"
      >
        <rect x="0vw" y="0" rx="1" ry="1" width="85vw" height="14vh" />  
        
        <rect x="4vw" y="18vh" rx="8" ry="8" width="55.2vw" height="60vh" /> 

      </ContentLoader>}
      {props.fetchingProjectDetailsSuccess && props.projectObj!=null && <Row >
        <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"space-between",display:'flex',padding:'10px 10px 10px 5%',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{organizationDetails.name}</b></span>
                <span style={{fontSize:18}}>Access Role: <b>{userRole}</b></span>
          </Col>
            <Col xs={24} style={{height:'75vh'}}>
                <Tabs  defaultActiveKey="1"
                onChange={onChange}
                tabBarStyle={{backgroundColor:'	#A7BBCB',paddingLeft:'5%',color:'#001529'}}
                size="large"
                tabPosition={'top'}
                style={{ maxHeight: 300}} 
                items={userRole=="OrganizationAdmin"?organizationItems:projectItems} />
            </Col>
            
        </Row> }
        </>
        
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    projectObj:state.ProjectReducer.projectObj,
    organizationObj:state.ProjectReducer.organizationObj,
    projectFetchSuccess:state.ProjectReducer.projectFetchSuccess,
    fetchingProjectDetailsSuccess:state.ProjectReducer.fetchingProjectDetailsSuccess,
    servicesList:state.ProjectReducer.servicesList,
    usersList:state.ProjectReducer.usersList,
  };
};

export default connect(mapStateToProps)(ProjectInfo)