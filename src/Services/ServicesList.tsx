import { Breadcrumb, Button, Col, Empty, Modal, Row, Tabs, Tooltip, notification } from "antd";
import type { TabsProps } from 'antd';
import ServiceInfo from "./ServiceInfo";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useMemo, useState } from "react";
import { deleteService } from "../state/new actions/serviceAction";
import { fetchAllServiceDetails } from "../state/new actions/serviceAction";

import { useMsal } from "@azure/msal-react";
import ContentLoader from "react-content-loader";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useToken, useLogoutRedirect } from "../utils/getToken";




interface IServicesList{
  serviceList:object[] | null,
  fetchingDetails_InProgress:boolean,
  fetchingDetails_Success:boolean,
  fetchingDetails_Error:string | null,
  updateService_Progress:boolean,
  updateService_Success:boolean,
  updateService_Error:string | null,
  deleteServiceSuccess:boolean,
  deleteServiceProgress:boolean,
  deleteService_Error:string | null,
}
function ServicesList({...props}:IServicesList){
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [serviceId,setServiceId]=useState("")
  const [arrow, setArrow] = useState('Show');
  const getToken = useToken();
  const handleLogoutRedirect = useLogoutRedirect();

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
  const handleDeleteService=async ()=>{
    await deleteService(serviceId,getToken(),handleLogoutRedirect)
  }
  const handleOpenAlert=(sId:any)=>{
    setServiceId(sId) 
    console.log(sId)
    setIsModalOpen(true)
  }
  const hideModal = () => {
    setIsModalOpen(false);
  };
  const onOk=()=>{
    handleDeleteService()
    setIsModalOpen(false);
  }
  const handleCreateService=()=>{
    window.location.href="/create_Service_Steps"
  }





  useEffect(()=>{
    const fetchData=async()=>{
      await fetchAllServiceDetails(getToken(),handleLogoutRedirect)
    }
    if(props.fetchingDetails_Error==null) 
      fetchData()
  },[])

  useEffect(()=>{
    const fetchData=async()=>{
      await fetchAllServiceDetails(getToken(),handleLogoutRedirect)
    }
    if(props.deleteServiceSuccess){
      notification.success({
        message: 'Service deleted successfully',
      });
      fetchData()
    }
  },[props.deleteServiceSuccess])
  
  useEffect(()=>{
    const fetchData=async()=>{
      await fetchAllServiceDetails(getToken(),handleLogoutRedirect)
    }
    if(props.deleteServiceSuccess==false && props.deleteService_Error!=null){
      notification.error({
        message: props.deleteService_Error,
      });
      fetchData()
    }
  },[props.deleteServiceSuccess])
  


    return(
      <>
      {props.fetchingDetails_InProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100%'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="3" ry="3" width="16vw" height="100vh" /> 
            <rect x="16vw" y="0" rx="1" ry="1" width="84vw" height="14vh" />  
            
            <rect x="23.4vw" y="18vh" rx="8" ry="8" width="67.2vw" height="70vh" /> 
          </ContentLoader>}
      <Row   style={{ height:'93vh'}}>
          {props.serviceList && props.serviceList.length==0 &&  <Col xs={24} lg={23} style={{alignSelf:'flex-end',position:'relative'}}>
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Service
                  <br/>
                  There is no services created yet
                  <br/>
                  <Button href="/create_Service_Steps" type="primary">Create Service</Button>
                </div>
              }
              />
              </Col>}
            {props.serviceList && props.serviceList.length>0 && <Col  xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
            <div className="containerbackground">
              Service
              </div>
                <Tabs
                size="large"
                // tabBarGutter={17}
                className="organiationTab"           
                style={{margin:0,padding:0}}
                tabBarStyle={{boxShadow:'2px 2px gray',height:'93vh',zIndex:'1',
                              backgroundColor:'white',scrollBehavior: 'smooth',width:'16vw',margin:0,padding:0
                            }}
                defaultActiveKey="0"
                tabPosition={'left'}
                >
                  <TabPane tab={<div className="tab-heading-div"><b style={{color:'black'}}>Services</b><PlusCircleOutlined onClick={handleCreateService} style={{fontSize:24}}/></div>} key={"51"} disabled={true} className="tab-heading" />

                  {props.serviceList?.map((ser:any,index:number)=>(
                    <TabPane tab={<div className="tab-body-div"><Tooltip placement="right" title={ser.name} arrow={mergedArrow}> {ser.name.slice(0,17)} {ser.name.length>17 && <>...</>} </Tooltip>
                    <MinusCircleOutlined onClick={()=>{handleOpenAlert(ser.id)}} style={{fontSize:24,color:'lightgray'}}/>
                  </div>}  key={index} style={{padding:0}}>
                      {/* <OrganiztionInfo orgId={org.organizationId} documentId={org.documentId} serviceDetails={props.servicesList} organizationDetails={org} userDetails={props.usersList}/> */}
                      <ServiceInfo  data={ser}/>
                    </TabPane>
                  ))
                  }
                </Tabs>
            </Col>
          }
            
        </Row>
        <Modal open={isModalOpen} title="Alert" onOk={onOk} onCancel={hideModal} >
          Are you sure you want to delete this service
      </Modal>
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    serviceList:state.FetchServiceReducer.serviceList,
    fetchingDetails_InProgress:state.FetchServiceReducer.fetchingDetails_InProgress,
    fetchingDetails_Success:state.FetchServiceReducer.fetchingDetails_Success,
    fetchingDetails_Error:state.FetchServiceReducer.fetchingDetails_Error,
    updateService_Progress:state.FetchServiceReducer.updateService_Progress,
    updateService_Success:state.FetchServiceReducer.updateService_Success,
    updateService_Error:state.FetchServiceReducer.updateService_Error,
    deleteServiceSuccess:state.FetchServiceReducer.deleteServiceSuccess,
    deleteServiceProgress:state.FetchServiceReducer.deleteServiceProgress,
    deleteService_Error:state.FetchServiceReducer.deleteService_Error,
  };
};

export default connect(mapStateToProps)(ServicesList)  
// export default ServicesList