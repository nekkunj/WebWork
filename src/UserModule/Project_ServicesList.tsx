import { DeleteOutlined, EditOutlined, FolderOpenOutlined, PlusOutlined, ToolOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Modal, Row } from "antd"
import { useEffect, useState } from "react";
import ServiceModal from "./Service_Modal";
import './ServicesList.css'
import AddServiceModal from "./AddServiceModal";
import { IparameterObj } from "../type";
import { deleteAssignedService, fetchUnassignedOrganizationServicesList } from "../state/new actions/projectAction";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import empty from '../png-blue-folder.png'
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect, useToken } from "../utils/getToken";
interface IServiceList{
  assignedServiceObject:any | null,
  cardData:{ name: string; createdOn: string; parameterJsonData: IparameterObj[];url:string }[],
  projectId:string,
  orgId:string,
  prevStep:()=>void,
  nextStep:(value:any)=>void,
  prevStepExists:boolean,
  nextStepExist:boolean,
  userRole:string,
  serviceUnassign_Success:boolean,
  fetchData:()=>void

}


function DateComponent(mongoDbDate:string){
    // Assuming createdAt is a Date object fetched from MongoDB
    const createdAt: Date = new Date(mongoDbDate);

    // Get the local time zone offset in minutes
    const timeZoneOffset: number = new Date().getTimezoneOffset();

    // Apply the offset to get the local time
    const localTime: Date = new Date(createdAt.getTime() - timeZoneOffset * 60000);

    // Convert the local time to a string representation
    //toLocaleString for date and time
    //toLocaleDateString for just date
    const localDateTimeString: string = localTime.toLocaleDateString();

  return(
<div>{localDateTimeString}</div>
  )
}


function ServicesList({cardData,userRole,projectId,orgId,prevStep,nextStep,prevStepExists,nextStepExist,fetchData,...props}:IServiceList){
  
    const [Assignedservices, setAssignedservices] = useState(cardData); // An array containing card data
    const [openIframeModal,setOpenIframeModal]=useState(false)
    const [ServiceListOpen,setServiceListOpen]=useState(false)
    const [addServiceOpen,setAddServiceOpen]=useState(false)
    const [serviceindex,setServiceIndex]=useState<number>(-1)
    const [isServiceAssigned,setIsServiceAssigned]=useState(false)
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
  
    const st = useMsal();
    // Get the local time zone offset in minutes
    const timeZoneOffset: number = new Date().getTimezoneOffset();
    let activeAccount:any;
    let prop:any
    const handleDelete = async (index:number) => {
      const updatedCardData = [...Assignedservices];
      await deleteAssignedService(Assignedservices[index],projectId,getToken(),handleLogoutRedirect)
      updatedCardData.splice(index, 1);
      setAssignedservices(updatedCardData);
      fetchData()

    };
  const handleServiceModelClose=()=>{
    setServiceListOpen(false)
  };
  const handleServiceModelOpen=(id:number)=>{
    setServiceListOpen(true)
    setServiceIndex(id)

  };
  function assignService(){
    setIsServiceAssigned(true)
  }
  const handleIframeOpen=()=>{
    setOpenIframeModal(true)
  }
  const handleCancel=()=>{
    setOpenIframeModal(false)
  }
  const handleIframeModalOpen=(id:number)=>{
    setOpenIframeModal(true)
    setServiceIndex(id)

  }
  const open_AddServiceModel=()=>{
    setAddServiceOpen(true)
  }
  const close_AddServiceModel=()=>{
    setAddServiceOpen(false)
  }
  function previousStep(){
    prevStep()
  }

  useEffect(()=>{
    const fetchingUnassignedServices=async (newData:any)=>{
      await fetchUnassignedOrganizationServicesList(Assignedservices,orgId,getToken(),handleLogoutRedirect)
    }
    if(props.assignedServiceObject && isServiceAssigned && userRole=="OrganizationAdmin")
    {
    const newData=[props.assignedServiceObject,...Assignedservices]
    setAssignedservices(newData)
    fetchingUnassignedServices(newData)
    }
  },[props.assignedServiceObject])

  useEffect(() => {
    // Perform any necessary operations when the value is altered
    const fetchingUnassignedServices=async ()=>{
      await fetchUnassignedOrganizationServicesList(cardData,orgId,getToken(),handleLogoutRedirect)

    }
    if(userRole=="OrganizationAdmin")
      fetchingUnassignedServices()

  }, []);

  useEffect(()=>{
    const fetchingUnassignedServices=async (newData:any)=>{
      await fetchUnassignedOrganizationServicesList(newData,orgId,getToken(),handleLogoutRedirect)
    }
    if(props.assignedServiceObject && isServiceAssigned)
    {
    const newData=[props.assignedServiceObject,...Assignedservices]
    setAssignedservices(newData)
    fetchingUnassignedServices(newData)
    }
  },[props.assignedServiceObject])

  useEffect(()=>{
    if(props.serviceUnassign_Success){
      const fetchingUnassignedServices=async ()=>{
        await fetchUnassignedOrganizationServicesList(cardData,orgId,getToken(),handleLogoutRedirect)

      }
      if(userRole=="OrganizationAdmin")
        fetchingUnassignedServices()
    }
  },[props.serviceUnassign_Success])
  const isDisabled = userRole === 'Reader' || userRole === 'Writer' || userRole== 'ProjectAdmin';

    return(
      <>
        <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',margin:'0 auto',width:'85%'}}>
        <legend style={{fontSize:'20px'}}>Services List</legend>   
        <div key={projectId}>
          {/* <iframe id="inlineFrameExample"
    title="Inline Frame Example"
    width="300"
    height="200" src="https://www.youtube.com/"> </iframe> */}
        <Row justify={'start'}  style={{ height: '65vh', overflow: 'auto',paddingRight:'1vw'}}>
            {!isDisabled && <Col xs={24} lg={22}>
              <div className="add-service-card" onClick={open_AddServiceModel}>
                  <PlusOutlined style={{fontSize:28}}/> 
                  Assign a new service
              </div>
            </Col>}
            <Col xs={24}>
            
            
            </Col>
            {Assignedservices.length==0 &&<Col xs={24} >
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Services Assigned 
                  <br/>
                  Assign a service first to see the results
                </div>
              }
              />
              </Col>}
            {Assignedservices.map((card,index)=>(
                <Col xs={22} sm={20} md={16} lg={11} >
                <Card 
                  key={index} style={{margin:'2%',cursor:'pointer',border:'1px solid lightgray'}} 
                  
                  actions={[
                            <>{DateComponent(card.createdOn)}</>,
                            <EditOutlined data-testid="edit-service" disabled={!isDisabled} key="setting" style={{
                                opacity: isDisabled  ? 0.5: 1, 
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                color:isDisabled?'undefined':'blue'
                              }} 
                                
                              onClick={()=>{isDisabled ? console.log('not-allowed') :handleServiceModelOpen(index)}} />,
                            <DeleteOutlined data-testid="delete-project-service"
                              style={{color:'red',fontSize:17,
                                opacity: isDisabled  ? 0.5: 1, 
                                cursor: isDisabled ? 'not-allowed' : 'pointer' }} 
                              onClick={() => isDisabled ? console.log('not-allowed') :handleDelete(index)}/>
                          ]}  
                >
                  <Row align={'middle'} justify={'center'} style={{display:'flex',minHeight:'190px'}} onClick={()=>{handleIframeModalOpen(index)}}>
                    <Col xs={24} style={{fontSize:'17px'}}><b>{card.name}</b></Col>
                    <Col xs={24} md={4}> <ToolOutlined style={{fontSize:24}}/> </Col>
                    <Col xs={24} md={19}>
                          {!card.parameterJsonData && <p> This service has no parameters</p>}
                          {card.parameterJsonData && card.parameterJsonData.length==0 && <p> This service has no parameters</p>}
                          {card.parameterJsonData && card.parameterJsonData.map((obj)=>(
                            <Row>
                              <Col xs={12}><b>{obj.name}</b></Col>
                              <Col xs={12} style={{textAlign:'left'}}>{obj.value}</Col>
                            </Row>
                          ))}
                          
                    </Col>

                  </Row>
                    
                </Card>
                </Col>
            ))}
            
        </Row>
        <Row justify={'end'}>
                { prevStepExists && <Col xs={4} style={{marginTop:'20px'}}>
                <div style={{ textAlign: 'right' }} >
                    <Button type="primary" htmlType="submit" onClick={previousStep} style={{width:'113px'}}>
                         Prev 
                    </Button> 
                  </div>
                </Col>}
                { nextStepExist && <Col xs={4} style={{marginTop:'20px'}}>
                <div style={{ textAlign: 'right' }} >
                    <Button type="primary" htmlType="submit" onClick={nextStep} style={{width:'113px'}}>
                        Next
                    </Button> 
                  </div>
                </Col>}
            </Row>
        </div>
        </fieldset>
          { ServiceListOpen && <ServiceModal   projectId={projectId} isOpen={ServiceListOpen} document={Assignedservices[serviceindex]} handleClose={handleServiceModelClose} />}
          {addServiceOpen &&  <AddServiceModal assignService={assignService} projectId={projectId} organizationId={orgId} isOpen={addServiceOpen}  handleClose={close_AddServiceModel} />}
          <Modal 
            open={openIframeModal}       
            style={{ top:0 }}
            onCancel={handleCancel}
            width={"98vw"}
            footer={[]}
          >
            {serviceindex==-1 && <div style={{display:'flex',alignContent:'center',alignItems:'center'}}>There is no service URL</div>}
            {serviceindex>-1 &&  Assignedservices.length>0 && <iframe scrolling="no" className="popup-iframe"  src={Assignedservices[serviceindex].url.concat(getToken())}  ></iframe>}
          </Modal>

      </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    assignedServiceObject:state.AssignServicesReducer.assignedServiceObject,
    serviceUnassign_Success:state.AssignServicesReducer.serviceUnassign_Success

  };
};

export default connect(mapStateToProps)(ServicesList)