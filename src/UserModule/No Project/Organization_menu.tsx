import { Button, Col, Empty, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import ServicesList from "../Project_ServicesList";
import ProjectForm from "../ProjectForm";
import { useEffect, useState } from "react";
import UserManagementUsersListCard from "./users_List_Card_UserM"
import GeneralUser_Organization_Info_Form from "../GeneralUser_Organization_Info_Form";
import { RootState } from "../../state/reducers";
import { connect } from "react-redux";

interface IProjectInfo{
    orgId:string,
    userRole:string,
    organizationObj:any,
    usersList:any,
    projectFetchSuccess:boolean
}
function EmptyProject(){
    return(
        <>
            <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Project
                  <br/>
                  There is no project in this organization
                  <br/>
                  <Button href="/create_project" type="primary">Create Project</Button>
                </div>
              }
              />
        </>
    )
}
function Organization_menu({orgId,userRole,...props}:IProjectInfo){

    const [servicesTabData, setServicesTabData]=useState<any>()
    const [usersCardData,setUsersCardData]=useState<{ userEmail: string; createdOn: string; roleName: string; }[]>([])
    useEffect(()=>{
      if(props.usersList){
        setUsersCardData(props.usersList)
      }

    },[])

    const items: TabsProps['items'] = [
        {
          key:'1',
          label:'Organization Info',
          children:props.organizationObj && <GeneralUser_Organization_Info_Form orgId={orgId} userRole={userRole} organizationDetails={props.organizationObj} />
        },  
        {
            key: '2',
            label: `Project`,
            children: <EmptyProject />,
        },
        {
            key: '3',
            label: `Users`,
            children: <UserManagementUsersListCard organizationId={orgId} userRole={userRole} cardData={usersCardData} />,
        }]
        const onChange = (key: string) => {
            // console.log(key);
          };
    return(    
        <Row >
        <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"space-between",display:'flex',padding:'10px 10px 10px 5%',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{props.organizationObj?.name}</b></span>
                <span style={{fontSize:18}}>Access Role: <b>{userRole}</b></span>
          </Col>
            <Col xs={24} style={{height:'75vh'}}>
                <Tabs  defaultActiveKey="1"
                onChange={onChange}
                tabBarStyle={{backgroundColor:'	#A7BBCB',paddingLeft:'5%',color:'#001529'}}
                size="large"
                tabPosition={'top'}
                style={{ maxHeight: 300}} 
                items={items} />
            </Col>
        </Row> 
        
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    projectObj:state.ProjectReducer.projectObj,
    organizationObj:state.ProjectReducer.organizationObj,
    projectFetchSuccess:state.ProjectReducer.projectFetchSuccess,
    servicesList:state.ProjectReducer.servicesList,
    usersList:state.ProjectReducer.usersList,
  };
};

export default connect(mapStateToProps)(Organization_menu)