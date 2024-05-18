import { Row, Tabs,Col,Button, Breadcrumb, Tooltip, Empty } from "antd";
import type { TabsProps } from 'antd';
import { connect } from 'react-redux';
import { RootState } from "../../state/reducers";
import { useEffect, useMemo, useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
// import ProjectsListProjectM from './projects_List_projectM'
import { fetchGeneraOrganizationDetails } from "../../state/new actions/generalUserAction";
import ContentLoader from "react-content-loader";
import OrganizationInfo from "./OrganizationInfo";
import { useLogoutRedirect, useToken } from "../../utils/getToken";


interface IOrganizationList{
  userId:string,
  userEmail:string,
  allRoles:object[] | null,
  organizationList:object[] | null,
  fetchError:string | null,
  organizationFetchInProgress:boolean,
  organizationFetchSuccess:boolean,
}
function OrganizationAdmin_OrganizationList({userId,userEmail,...props}:IOrganizationList){

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
    const fetchGeneralData=async()=>{
      await fetchGeneraOrganizationDetails(userEmail,getToken(),handleLogoutRedirect)
    }
    useEffect(()=>{
      const fetchData=async()=>{
        await fetchGeneraOrganizationDetails(userEmail,getToken(),handleLogoutRedirect)
      }
      if(props.fetchError==null) // To avoid repeatedly database call
        fetchData()
    },[])
    console.log(props.organizationList)
    return(
      <>
      {props.organizationFetchInProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
            viewBox="0 0 380 200"
          >
             <rect x="0" y="0" rx="3" ry="3" style={{width:'16%'}} height="200" /> 
            <rect x="63" y="0" rx="3" ry="3" style={{width:'16%'}} height="200" /> 

            <rect x="124" y="0" rx="1" ry="1" width="257" height="32" />  
            
            <rect x="137" y="45" rx="3" ry="3" width="190" height="120" /> 


          </ContentLoader>}
      
      {props.organizationList && <Row   style={{ height:'93vh'}}>
        {props.organizationList.length==0 &&  <Col xs={24}>
        <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Organization
                  <br/>
                  There is no organizations assigned to you as organization admin. 
                  <br/>
                  Go to projects section to see all organizations
                  <br/>
                </div>
              }
              />
        </Col>}
        {props.organizationList.length>0 && <Col xs={24} style={{alignSelf:'flex-end',position:'relative'}}>
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
                <TabPane style={{padding:0}} tab={<div style={{textAlign:'left'}}><Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,19)} {org.name.length>19 && <>...</>} </Tooltip></div>}  key={index}>
                  <OrganizationInfo allRoles={props.allRoles} orgId={org.id} orgName={org.name} fetchData={fetchGeneralData}/>
                </TabPane>
              ))
              }
            </Tabs>
        </Col>}
      </Row>}
        
      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    allRoles:state.RoleReducer.allRoles,
    organizationList:state.OrganizationFetchReducer.organizationList,
    organizationFetchInProgress:state.OrganizationFetchReducer.organizationFetchInProgress,
    fetchError:state.OrganizationFetchReducer.fetchError,
    organizationFetchSuccess:state.OrganizationFetchReducer.organizationFetchSuccess,
  };
};

export default connect(mapStateToProps)(OrganizationAdmin_OrganizationList)