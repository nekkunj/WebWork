import { Row, Tabs,Col,Button, Breadcrumb, notification, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import ProjectInfo from "./ProjectInfo";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import { useEffect, useMemo, useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import { fetchAllOrganizationNames, fetchAllProjectDetails } from "../state/new actions/projectAction";
import ProjectsListProjectM from './Projects_List_projectM'
import { useMsal } from "@azure/msal-react";
import ContentLoader from "react-content-loader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useLogoutRedirect, useToken } from "../utils/getToken";

interface IOrganizationList{
  organizationList:object[] | null,
  projectsList:object[] | null,
  servicesList:object[] | null,
  usersList:object [] | null,
  organizationNamesFetch_InProgress:boolean,
  organizationNamesFetch_Success:boolean,
  fetchError:string | null,
  deleteProjectSuccess:boolean,
  deleteProjectProgress:boolean,
  deleteProject_Error:string | null,
}
function OrganizationList_InProject({...props}:IOrganizationList){
  const [arrow, setArrow] = useState('Show');
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()
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
  const handleCreateOrganization=()=>{
    window.location.href="/create_organization"
  }

  useEffect( ()=>{
    const fetchData=async()=>{
      console.log("fetching organization names")
      await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
    }
    if(props.fetchError==null) 
      fetchData()

  },[])

  useEffect(()=>{
    const fetchData=async()=>{
      await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
    }
    if(props.deleteProjectSuccess){
      notification.success({
        message: 'Project deleted successfully',
      });
      fetchData()
    }
  },[props.deleteProjectSuccess])

  useEffect(()=>{
    const fetchData=async()=>{
      await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
    }
    if(props.deleteProjectProgress==false && props.deleteProject_Error!=null){
      notification.error({
        message: props.deleteProject_Error,
      });
      fetchData()
    }
  },[props.deleteProjectProgress])

  const fetchData=async()=>{
    await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
  }
  const fetchProjectObj=async(orgId:any)=>{
    await fetchAllProjectDetails(orgId,getToken(),handleLogoutRedirect)
    }
    return(
      <>
      {props.organizationNamesFetch_InProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100%'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
            <rect x="16.5vw" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
            <rect x="30.5vw" y="0" rx="1" ry="1" width="71.5vw" height="14vh" />  
            
            <rect x="36.4vw" y="18vh" rx="8" ry="8" width="54.2vw" height="70vh" /> 

          </ContentLoader>}
      {!props.organizationNamesFetch_InProgress && <Row   style={{ height:'93vh'}}>
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
            <TabPane tab={<div className="tab-heading-div"><b style={{color:'black'}}>Organization</b><PlusCircleOutlined onClick={handleCreateOrganization} style={{fontSize:24}}/></div>} key={"50"} disabled={true} className="tab-heading" />
              {props.organizationList?.map((org:any,index:number)=>(
                <TabPane tab={<div onClick={()=>{fetchProjectObj(org.id)}} className="tab-div"><Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip>
                              </div>} key={index}>
                  <ProjectsListProjectM fetchData={fetchData} orgName={org.name} orgId={org.id} />
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
    servicesList:state.ProjectReducer.servicesList,
    projectsList:state.ProjectReducer.projectsList,
    usersList:state.ProjectReducer.usersList,
    organizationNamesFetch_InProgress:state.ProjectReducer.organizationNamesFetch_InProgress,
    organizationNamesFetch_Success:state.ProjectReducer.organizationNamesFetch_Success,
    fetchError:state.ProjectReducer.fetchError,
    deleteProjectSuccess:state.ProjectReducer.deleteProjectSuccess,
    deleteProjectProgress:state.ProjectReducer.deleteProjectProgress,
    deleteProject_Error:state.ProjectReducer.deleteProject_Error,
  };
};

export default connect(mapStateToProps)(OrganizationList_InProject)