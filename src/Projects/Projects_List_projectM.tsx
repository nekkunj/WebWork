
import { Row, Tabs,Col,Button, Breadcrumb, Modal, Empty, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import TabPane from "antd/es/tabs/TabPane";
import  { useMemo } from "react";
import { useEffect, useState } from "react";
import ProjectInfo from "./ProjectInfo";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { deleteProject } from "../state/new actions/projectAction";
import { fetchAllProjectDetails,setProjectDetailsSucessToFalse } from "../state/new actions/projectAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import ContentLoader from "react-content-loader";


interface IProjectsListProjectM{
  orgId:string,
  orgName:string,
  fetchData:()=>void,
  projectsList:object[] | null,
  projectFetchInProgress:boolean,
  projectFetchSuccess:boolean,
  fetchError:string | null,
}

function ProjectsListProjectM({orgId,orgName,fetchData,...props}:IProjectsListProjectM){
  const [projectTabData, setProjectTabData]=useState<any>([])
  const [usersCardData,setUsersCardData]=useState<{ userEmail: string; createdAt: string; userRole: string; }[]>([])
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [projId,setProjId]=useState("")
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
  const handleCreateProject=()=>{
    window.location.href="/create_project"
  }
  const handleDeleteProject=async ()=>{
    await deleteProject(projId,orgId,getToken(),handleLogoutRedirect)
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


  useEffect(()=>{
    const fetch=async()=>{
    await fetchAllProjectDetails(orgId,getToken(),handleLogoutRedirect)
    }
    fetch()
  },[])

  useEffect(()=>{
    if(props.projectFetchSuccess){
        setProjectTabData(props.projectsList)
        // setProjectDetailsSucessToFalse()
    }
},[props.projectFetchSuccess])   
 

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
        {projectTabData.length==0 &&  <Col xs={24} lg={23} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
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
            tabBarGutter={5}
            style={{margin:0,padding:0}}
            // type="card"
            tabBarStyle={{boxShadow:'2px 2px gray',zIndex:'1',height:'93vh',backgroundColor:'white',scrollBehavior: 'smooth',width:'15vw',padding:0,margin:0  }}
            defaultActiveKey="5"
            tabPosition={'left'}
            >
            <TabPane tab={<div className="tab-heading-div"><b style={{color:'black  '}}>Project</b><PlusCircleOutlined onClick={handleCreateProject} style={{fontSize:24}}/></div>} key={"51"} disabled={true} className="tab-heading" />
              {projectTabData?.map((org:any,index:number)=>(
                <TabPane 
                  tab={<div className="tab-body-div"><Tooltip placement="right" title={org.name} arrow={mergedArrow}> {org.name.slice(0,17)} {org.name.length>17 && <>...</>} </Tooltip>
                          <MinusCircleOutlined onClick={()=>{handleOpenAlert(org.id)}} style={{fontSize:24,color:'lightgray'}}/>
                        </div>} 
                  key={`${index +5}`} style={{padding:0}}
                >
                  <ProjectInfo fetchData={fetchData} orgId={orgId} orgName={orgName} projectId={org.id} projectNames={org} serviceNames={org.services} userNames={org.projectUsers} />
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
    projectsList:state.ProjectReducer.projectsList,
    projectFetchSuccess:state.ProjectReducer.projectFetchSuccess,
    projectFetchInProgress:state.ProjectReducer.projectFetchInProgress,
    fetchError:state.ProjectReducer.fetchError,
  };
};

export default connect(mapStateToProps)(ProjectsListProjectM)
