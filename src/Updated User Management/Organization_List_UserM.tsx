
import { Row, Tabs,Col,Button, Breadcrumb, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import UserTable from "./UserTable";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useMemo, useState } from "react";
import ContentLoader from "react-content-loader";
import './Users_List_Card.css'
import { PlusCircleOutlined } from "@ant-design/icons";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import { fetchingOrganizationNames_UserManagement, fetchingUsers_UserManagement } from "../state/new actions/userManagementAction";


interface IOrganizationList{
    organizationNames:object[] | null,
    fetchingOrganizationNames_InProgress:boolean,
    fetchingOrganizationNames_Success:boolean,
    fetchingDetails_Error:string | null,
    fetchingDetails_Success:boolean,
    projectNames:object[] | null,
    userNames:object[] | null,
}



function Organization_List_UserM({...props}:IOrganizationList){
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
  useEffect(()=>{
    const fetchData=async()=>{
      await fetchingOrganizationNames_UserManagement(getToken(),handleLogoutRedirect)
    }

    if(props.fetchingDetails_Error==null) 
      fetchData()

    
  },[])
  const handleCreateOrganization=()=>{
    window.location.href="/create_organization"
  }
  const fetchUserObj=async(orgId:any)=>{
    await fetchingUsers_UserManagement(orgId,getToken(),handleLogoutRedirect)
}
    return(
      <>
      {props.fetchingOrganizationNames_InProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100%'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="3" ry="3" width="15vw" height="100vh" /> 
            <rect x="15vw" y="0" rx="1" ry="1" width="84vw" height="7vh" />  
            
            <rect x="17.5vw" y="8vh" rx="8" ry="8" width="76vw" height="55vh" />  
      </ContentLoader>}
      <Row   style={{height:'93vh'}}>
        {/* <Col xs={24} style={{alignSelf:'flex-start'}}>
          <Breadcrumb  items={[{title:'Organization'}]} />
        </Col> */}
        <Col xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
            <div className="containerbackground">
              Organization
              </div>
            {props.organizationNames && props.organizationNames.length>0 && <Tabs //need to set condition .length>0 to start defaultactivekey correctly
            size="large"
            // style={{height:'86vh'}}
            className="organiationTab"
            tabBarGutter={7}
            style={{margin:0,padding:0}}
            // type="card"
            tabBarStyle={{boxShadow:'2px 2px gray',height:'93vh',backgroundColor:'white',scrollBehavior: 'smooth',width:'15vw' }}
            defaultActiveKey={'0'}
            tabPosition={'left'}
            >
              <TabPane tab={<div className="tab-heading-div"><b style={{color:'black'}}>Organization</b><PlusCircleOutlined onClick={handleCreateOrganization} style={{fontSize:24}}/></div>} key={50} disabled={true} className="tab-heading" />
              {props.organizationNames.map((org:any,index:number)=>(
                <TabPane tab={<div onClick={()=>{fetchUserObj(org.id)}} className="tab-div"><Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip></div>} key={`${index}`} style={{padding:0}}>
                  {/* <OrganiztionInfo orgId={org.organizationId} documentId={org.documentId} serviceDetails={props.servicesList} organizationDetails={org} userDetails={props.usersList}/> */}
                  <UserTable orgId={org.id}  organizationName={org.name} />
                </TabPane>
              ))
              } 
            </Tabs>}
        </Col>
      </Row>
        
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationNames:state.UserManagementReducer.organizationNames,
    fetchingDetails_Success:state.UserManagementReducer.fetchingDetails_Success,
    fetchingOrganizationNames_InProgress:state.UserManagementReducer.fetchingOrganizationNames_InProgress,
    fetchingOrganizationNames_Success:state.UserManagementReducer.fetchingOrganizationNames_Success,
    fetchingDetails_Error:state.UserManagementReducer.fetchingDetails_Error,
    projectNames:state.UserManagementReducer.projectNames,
    userNames:state.UserManagementReducer.userNames,
  };
};

// export default CreateServiceForm
export default connect(mapStateToProps)(Organization_List_UserM)  