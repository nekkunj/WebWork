import { Row, Tabs,Col,Button, Breadcrumb, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import ProjectInfo from "./ProjectInfo";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import { useEffect, useMemo, useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import ProjectsListProjectM from './projects_List_projectM'
import ContentLoader from "react-content-loader";
import { fetchGeneralUser_OrganizationDetails, fetchGeneralUser_ProjectDetails, fetchOrganization_Admin_Project_Details } from "../state/new actions/generalUserAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import "./ServicesList.css"
import { useMsal } from "@azure/msal-react";
interface IOrganizationList{
  userId:string,
  userEmail:string,
  allRoles:object[] | null,
  organizationList:object[] | null,
  projectsList:object[] | null,
  organizationNamesFetch_InProgress:boolean,
  organizationNamesFetch_Success:boolean,
  fetchError:string | null
}
function UserModuleProjectDetails({userId,userEmail,...props}:IOrganizationList){

  const [arrow, setArrow] = useState('Show');
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
  function isPaddingZero(orgId:any){
    if(props.projectsList){
      const temp:any=props.projectsList.filter((obj:any) => obj.id === orgId)
      if(temp.length>0)
        return false
      else 
        return true
      }
      else
        return false
  }
  const fetchProjectObj=async(orgId:any)=>{
    if(instance){
    prop=instance.getActiveAccount()?.idTokenClaims
      const organizationAdminEntry = props.allRoles?.find(
        (userObj:any) =>
          userObj.organizationId === orgId && userObj.roleName === "OrganizationAdmin"
      );
      if(organizationAdminEntry){
        await fetchOrganization_Admin_Project_Details(orgId,getToken(),handleLogoutRedirect)
      }
      else{
        await fetchGeneralUser_ProjectDetails(orgId,prop.preferred_username,getToken(),handleLogoutRedirect)
      }
      }
  } 
  const fetchData=async()=>{
    await fetchGeneralUser_OrganizationDetails(userEmail,getToken(),handleLogoutRedirect)
  }
    useEffect(()=>{
      const fetchData=async()=>{
        await fetchGeneralUser_OrganizationDetails(userEmail,getToken(),handleLogoutRedirect)

      }
      // if(props.fetchError==null) // To avoid repeatedly database call
        fetchData()
    },[])
    return(
      <>
      {props.organizationNamesFetch_InProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100%'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
            <rect x="16.1vw" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
            <rect x="31.1vw" y="0" rx="1" ry="1" width="71.5vw" height="14vh" />  
            
            <rect x="36.4vw" y="18vh" rx="8" ry="8" width="53.2vw" height="70vh" /> 

          </ContentLoader>}

      {!props.organizationNamesFetch_InProgress && props.organizationList && props.organizationList.length>0 && <Row   style={{ height:'93vh'}}>
        <Col xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
            <div className="containerbackground">
              Organization
              </div>
            <Tabs
            size="large"
            // style={{height:'86vh'}}
            className="organiationTab"
            tabBarGutter={5}
            // type="card"
            tabBarStyle={{boxShadow:'2px 2px gray',height:'93vh',backgroundColor:'white',scrollBehavior: 'smooth',width:'15vw' }}
            defaultActiveKey="0"
            tabPosition={'left'}
            >
            <TabPane tab={<div className="tab-heading-div"><b style={{color:'black  '}}>Organization</b></div>} key={"51"} disabled={true} className="tab-heading" />
              {props.organizationList?.map((org:any,index:number)=>(
                <TabPane tab={<div onClick={()=>{fetchProjectObj(org.id)}} style={{textAlign:'left'}}>
                              <Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip>
                              </div>}  
                  key={index}>
                  <ProjectsListProjectM fetchData={fetchData} allRoles={props.allRoles}  orgId={org.id} organizationDetails={org}/>
                </TabPane>
              ))
              }
            </Tabs>
        </Col>
      </Row>}
        
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationList:state.ProjectReducer.organizationList,
    projectsList:state.ProjectReducer.projectsList,
    allRoles:state.RoleReducer.allRoles,
    organizationNamesFetch_InProgress:state.ProjectReducer.organizationNamesFetch_InProgress,
    organizationNamesFetch_Success:state.ProjectReducer.organizationNamesFetch_Success,
    fetchError:state.ProjectReducer.fetchError
  };
};

export default connect(mapStateToProps)(UserModuleProjectDetails)