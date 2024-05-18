
import { Row, Tabs,Col,Button, Breadcrumb, Tooltip, Empty, Modal } from "antd";
import type { TabsProps } from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import ProjectInfo from "./ProjectInfo";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Organization_menu from "./No Project/Organization_menu";
import { deleteProject } from "../state/new actions/projectAction";
import { RootState } from "../state/reducers";
import { connect } from "react-redux";
import { setProjectDetailsSucessToFalse } from "../state/new actions/projectAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import { fetchGeneralUser_ProjectDetails, fetchOrganization_Admin_AssignedService_Details, fetchOrganization_Admin_Project_Details, fetchProject_ServiceDetails } from "../state/new actions/generalUserAction";
import { useMsal } from "@azure/msal-react";
import ContentLoader from "react-content-loader";

interface IProjectsListProjectM{
  projectsList:any,
  servicesList:object[] | null,
  organizationDetails:object[] | null,
  allRoles:any[] | null,
  usersList:any | null,
  projectObj:any,
  orgId:string,
  fetchData:()=>void,
  projectFetchSuccess:boolean,
  projectFetchInProgress:boolean,
  organizationObj:any
}

function ProjectsListProjectM({orgId,organizationDetails,allRoles,fetchData,...props}:IProjectsListProjectM){
  const [projectTabData, setProjectTabData]=useState<any>([])
  const [usersCardData,setUsersCardData]=useState<{ userEmail: string; createdAt: string; userRole: string; }[]>([])
  const [arrow, setArrow] = useState('Show');
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [projId,setProjId]=useState("")
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()
  const { instance,accounts } = useMsal();

  let activeAccount:any;
  let prop:any

    const mergedArrow = useMemo(() => {
      if (arrow === 'Hide') {
        return false;
      }
  
      if (arrow === 'Show') {
        return true;
      }
  
      return {
        pointAtCenter: true,
      };
    }, [arrow]);
    useEffect(()=>{
      const fetch=async()=>{
        if(instance){
        prop=instance.getActiveAccount()?.idTokenClaims
          const organizationAdminEntry = allRoles?.find(
            (userObj) =>
              userObj.organizationId === orgId && userObj.roleName === "OrganizationAdmin"
          );
          if(prop){
          if(organizationAdminEntry){
            await fetchOrganization_Admin_Project_Details(orgId,getToken(),handleLogoutRedirect)
          }
          else{
            await fetchGeneralUser_ProjectDetails(orgId,prop.preferred_username,getToken(),handleLogoutRedirect)
          }
        }
          }
      } 
      fetch()
    },[])
    useEffect(()=>{

      const fetchServiceData=async(proId:string)=>{
          await fetchProject_ServiceDetails(proId,getToken(),handleLogoutRedirect)
      }
      if(props.projectFetchSuccess){
          setProjectTabData(props.projectsList)
          setProjectDetailsSucessToFalse()
          if(props.projectsList && props.projectsList.length>0)
            fetchServiceData(props.projectsList[0].id)
      }
  },[props.projectsList])   

  

    
  function findUserRole(projectObj:any){
    const organizationAdminEntry = allRoles?.find(
      (userObj) =>
        userObj.organizationId === orgId && userObj.roleName === "OrganizationAdmin"
    );
  
    if (organizationAdminEntry) {
      return "OrganizationAdmin";
    } // If there's no "Organization Admin" entry, try to find the userRole based on the given projectId and organizationId
    else{
      const projectUserRoleEntry = allRoles?.find(
        (userObj) =>
          userObj.organizationId === orgId &&
          userObj.projectId === projectObj.id &&
          userObj.roleName !== "OrganizationAdmin"
      );
  
      if (projectUserRoleEntry) {
        return projectUserRoleEntry.roleName;
      }
    }
  
    // If no matching entry is found, return undefined
    return undefined;
  
  }
  const handleDeleteProject=async ()=>{
    await deleteProject(projId,orgId,getToken(),handleLogoutRedirect)
  }
  const handleCreateProject=()=>{
    window.location.href="/create_project"
  }
  const handleOpenAlert=(projectId:any)=>{
    setProjId(projectId)
    setIsModalOpen(true)
  }
  const hideModal = () => {
    setIsModalOpen(false);
  };
  const onOk=()=>{
    handleDeleteProject()
    setIsModalOpen(false);
  }
  const fetchServiceData=async(proId:string)=>{
      await fetchProject_ServiceDetails(proId,getToken(),handleLogoutRedirect)
  }
    return(
      <>
        {props.projectFetchInProgress &&   <ContentLoader 
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        style={{width:'100%',height:'100vh'}}
        viewBox="0 0 100% 100%"
      >
        <rect x="0" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
        <rect x="15vw" y="0" rx="1" ry="1" width="85vw" height="14vh" />  
        
        <rect x="19vw" y="18vh" rx="8" ry="8" width="55.2vw" height="70vh" /> 

      </ContentLoader>}
      {!props.projectFetchInProgress && <Row   style={{ height:'93vh'}}>
        {/* <Col xs={24} style={{alignSelf:'flex-start'}}>
          <Breadcrumb  items={[{title:'Organization'}]} />
        </Col> */}
        {projectTabData.length==0 && findUserRole("")=="OrganizationAdmin" && <Col xs={24}>
            <Organization_menu orgId={orgId}  userRole={"OrganizationAdmin"}  />
        </Col>}
        {projectTabData.length>0 && 
          <Col xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
              <div className="containerbackground">
                    Project
              </div>
              <Tabs
              size="large"
              // style={{height:'86vh'}}
              className="organiationTab"
              style={{margin:0,padding:0}}
              tabBarGutter={5}
              // type="card" 
              tabBarStyle={{boxShadow:'2px 2px gray',zIndex:'1',height:'93vh',backgroundColor:'white',scrollBehavior: 'smooth',width:'15vw',padding:0,margin:0  }}
              defaultActiveKey="0"  
              tabPosition={'left'}
              >
              <TabPane tab={<div className="tab-heading-div"><b style={{color:'black'}}>Project</b><PlusCircleOutlined onClick={handleCreateProject} style={{fontSize:24}}/></div>} key={"51"} disabled={true} className="tab-heading" />
                {projectTabData?.map((org:any,index:number)=>(
                  <TabPane tab={<div className="tab-body-div" onClick={()=>{fetchServiceData(org.id)}}>
                    <Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip>
                    {findUserRole(org)=="OrganizationAdmin" && <MinusCircleOutlined onClick={()=>{handleOpenAlert(org.id)}} style={{fontSize:24,color:'lightgray'}}/>}
                    </div>}  key={index} style={{padding:0}}>
                    {/* <OrganiztionInfo orgId={org.organizationId} documentId={org.documentId} serviceDetails={props.servicesList} organizationDetails={org} userDetails={props.usersList}/> */}
                    {/* <UserManagementUsersListCard cardData={usersCardData} documentId={org.documentId} projectId={org.projectId} organizationId={org.organizationId}/> */}
                    <ProjectInfo fetchData={fetchData} orgId={orgId} projectId={org.id} organizationDetails={organizationDetails} userRole={findUserRole(org)} />
                  </TabPane>
                ))
                }
              </Tabs>
          </Col>
        }
      </Row>}
      <Modal open={isModalOpen} title="Alert" onOk={onOk} onCancel={hideModal} >
          Are you sure you want to delete this project
      </Modal>
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationObj:state.ProjectReducer.organizationObj,
    projectsList:state.ProjectReducer.projectsList,
    servicesList:state.ProjectReducer.servicesList,
    usersList:state.ProjectReducer.usersList,
    projectFetchSuccess:state.ProjectReducer.projectFetchSuccess,
    projectFetchInProgress:state.ProjectReducer.projectFetchInProgress,
    fetchError:state.ProjectReducer.fetchError,
    projectObj:state.ProjectReducer.projectObj,
  };
};

export default connect(mapStateToProps)(ProjectsListProjectM)