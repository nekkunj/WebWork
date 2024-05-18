import { Row, Tabs,Col,Button, Breadcrumb, Modal,notification, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import OrganiztionInfo from "./OrganizationInfo";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import { Component, useEffect, useMemo, useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import { LoadingOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useMsal } from "@azure/msal-react";
import ContentLoader from "react-content-loader";
import "./ServicesList.css"
import { deleteOrganization, fetchOrganizationDetails, fetchOrganization_Admin_AssignedService_Details } from "../state/new actions/organizationAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";


interface IOrganizationList{
  organizationList:any,
  organizationFetchInProgress:boolean,
  organizationFetchSuccess:boolean,
  deletorganizationProgress:boolean,
  deletorganizationSuccess:boolean,
  fetchError:string | null,
  deletorganization_Error:null | string
}

function OrganizationList({...props}:IOrganizationList){
    const [isModalOpen,setIsModalOpen]=useState(false)
    const [orgId,setOrgId]=useState("")
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
    useEffect( ()=>{
      const fetchData=async()=>{
        await fetchOrganizationDetails(getToken(),handleLogoutRedirect)
      }
      if(props.fetchError==null ) 
        {
          fetchData()
        } 
  },[])
  const handleCreateOrganization=()=>{
    window.location.href="/create_organization"
  }
const handleDeleteOrganization=async ()=>{
  await deleteOrganization(orgId,getToken(),handleLogoutRedirect)
}
const handleOpenAlert=(orgId:any)=>{
  setOrgId(orgId)
  setIsModalOpen(true)
}
const hideModal = () => {
  setIsModalOpen(false);
};
const onOk=()=>{
  handleDeleteOrganization()
  setIsModalOpen(false);
}

useEffect(()=>{
  const fetchData=async()=>{
    await fetchOrganizationDetails(getToken(),handleLogoutRedirect)
  }
  if(props.deletorganizationSuccess){
    notification.success({
      message: 'Organization deleted successfully',
    });
    fetchData()
  }
},[props.deletorganizationSuccess])
const fetchD=async()=>{
  await fetchOrganizationDetails(getToken(),handleLogoutRedirect)

}
const fetch_OrganizationId=async(orgId:any)=>{
  await fetchOrganization_Admin_AssignedService_Details(orgId,getToken(),handleLogoutRedirect)
  }
useEffect(()=>{
  
  const fetchData=async()=>{
    await fetchOrganizationDetails(getToken(),handleLogoutRedirect)

  }
  if(props.deletorganizationProgress==false && props.deletorganization_Error!=null){
    notification.error({
      message: props.deletorganization_Error,
    });
    fetchData()
  }
},[props.deletorganizationProgress])
useEffect(()=>{
if(props.organizationList && props.organizationList.length>0 ) {
  fetch_OrganizationId(props.organizationList[0].id)
}
},[props.organizationList])
    return(
      <>
        {props.organizationFetchInProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100%'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="3" ry="3" width="16vw" height="100vh" /> 
            <rect x="16vw" y="0" rx="1" ry="1" width="84vw" height="14vh" />  
            
            <rect x="23.4vw" y="18vh" rx="8" ry="8" width="67.2vw" height="55vh" /> 
          </ContentLoader>}
      {!props.organizationFetchInProgress && <Row   style={{ height:'93vh'}}>
        {/* <Col xs={24}>
          {props.organizationFetchInProgress && <LoadingOutlined />}
        </Col> */}
        <Col xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
        <div className="containerbackground">
              Organization
              </div>
            <Tabs
              size="large"
              // style={{height:'86vh'}}
              className="organiationTab"
              tabBarGutter={7}
              style={{margin:0,padding:0}}
              // type="card"
              tabBarStyle={{boxShadow:'2px 2px gray',zIndex:'1',height:'93vh',backgroundColor:'#f3f3f3',scrollBehavior: 'smooth',width:'16vw',margin:0,padding:0 }}
              defaultActiveKey={'0'}  
              tabPosition={'left'}
            > 
            <TabPane tab={<div className="tab-heading-div"><b style={{color:'black'}}>Organization</b><PlusCircleOutlined onClick={handleCreateOrganization} style={{fontSize:24}}/></div>} key={50} disabled={true} className="tab-heading" />
            {props.organizationList?.map((org:any,index:number)=>(
              <TabPane  tab={<div className="tab-body-div" onClick={()=>{fetch_OrganizationId(org.id)}}>
                                <Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip> 
                                <MinusCircleOutlined onClick={()=>{handleOpenAlert(org.id)}}  style={{fontSize:24,color:'lightgray'}}/>
                             </div>} key={`${index}`} style={{padding:0}} >
                <OrganiztionInfo orgId={org.id} orgName={org.name}  organizationDetails={org}  fetchData={fetchD}/>
              </TabPane>
            ))
            }
            </Tabs>
        </Col>
      </Row>}
        <Modal open={isModalOpen} title="Alert" onOk={onOk} onCancel={hideModal} >
          Are you sure you want to delete this organization
        </Modal>
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationList:state.OrganizationFetchReducer.organizationList,
    organizationFetchInProgress:state.OrganizationFetchReducer.organizationFetchInProgress,
    organizationFetchSuccess:state.OrganizationFetchReducer.organizationFetchSuccess,
    deletorganizationProgress:state.OrganizationFetchReducer.deletorganizationProgress,
    deletorganizationSuccess:state.OrganizationFetchReducer.deletorganizationSuccess,
    fetchError:state.OrganizationFetchReducer.fetchError,
    deletorganization_Error:state.OrganizationFetchReducer.deletorganization_Error
  };
};

export default connect(mapStateToProps)(OrganizationList)