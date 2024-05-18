import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusCircleOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Select, Spin } from "antd"
import { useEffect, useState } from "react";
import '../Orgnization/Users_List_Card.css'
import Projects_AddUserModal from "./Projects_AddUserModal";
import {deleteProjectAdmin,setProjectAdminDuplicacyToNull} from "../state/new actions/projectAction"
import { RootState } from "../state/reducers";
import { connect } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect, useToken } from "../utils/getToken";

interface IUsers_List_Card{
  projectUpdateInProgress:boolean,
  projectUpdateSuccess:boolean,
  orgName:string,
  projectName:string,
  projectId:string,
  organizationId:string,
  cardData:{ userEmail: string; createdOn: string; roleName: string; }[],
  prevStep:()=>void,
  nextStep:(value:any)=>void,
  prevStepExists:boolean,
  nextStepExist:boolean,
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
function Project_Users_List_Card({cardData,organizationId,orgName,projectName,projectId,prevStep,nextStep,prevStepExists,nextStepExist,...props}:IUsers_List_Card){
    const [AssignedUsers, setAssignedusers] = useState(cardData); // An array containing card data
    const [addUserDialog_isOpen,setAddUserDialog_isOpen]=useState(false)
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()

    const handleAddUser=(userEmail:string)=>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    // today = mm + '-' + dd + '-' + yyyy;
      const obj:{ userEmail: string; createdOn: string; roleName: string; }={
        userEmail:userEmail,
        createdOn:String(today),
        roleName:'ProjectAdmin'
      }
      const newData=[obj,...AssignedUsers]
      setAssignedusers(newData)
    }
    const handleDelete = async(index:number) => {
      const updatedCardData = [...AssignedUsers];
      await deleteProjectAdmin(AssignedUsers[index],orgName,projectName,getToken(),handleLogoutRedirect)
      updatedCardData.splice(index, 1);
      setAssignedusers(updatedCardData);
    };
    function previousStep(){
      prevStep()
    }
    const handleAddUserDialogOpen=()=>{
      setAddUserDialog_isOpen(true)
      setProjectAdminDuplicacyToNull()

    };
    const handleAddUserDialogClose=()=>{
      setAddUserDialog_isOpen(false)
    };

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
    useEffect(()=>{
      if(cardData){
        setAssignedusers(cardData.filter((obj:any) => obj.roleName === "ProjectAdmin"))
      }

    },[])
    return(
      <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',margin:'0 auto',width:'85%'}}>
        <legend style={{fontSize:'20px'}}>Users List</legend>
        <Row justify={"start"} align={'top'} style={{ display:'flex',alignItems:'flex-start',alignContent:'flex-start', height: '65vh', overflow: 'auto',paddingRight:'1vw'}}>
              <Col xs={24} style={{textAlign:'left'}}>
                <h3>Project Admins</h3>
              </Col>
                <Col xs={24} lg={22} >
                  <div className="add-service-card" onClick={handleAddUserDialogOpen}>
                    <PlusOutlined style={{fontSize:24}}/>
                    Add new Project Admin
                  </div>
                </Col>
                <Col xs={24}>
            
            
            </Col>
            {AssignedUsers.length==0 && <Col xs={24} lg={22} style={{marginTop:'13vh'}} >
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Project Admin
                  <br/>
                  Add a Project Admin first to see the results
                </div>
              }
              />
              </Col>}
            {props.projectUpdateInProgress==true && <Col xs={24} lg={22}><Spin indicator={antIcon}/></Col>}
            {props.projectUpdateInProgress==false && AssignedUsers.map((card,index)=>(
                <Col xs={24} lg={22}>
                <Card key={index} style={{marginBottom:'5px',padding:'0px',border:'1px solid lightgray'}} >
                    <Row justify={"start"} align={"middle"}>
                        <Col xs={2} lg={2}><UserOutlined /></Col>
                        <Col xs={24} md={14}  style={{fontSize:15,textAlign:'left'}}> <b>{card.userEmail}</b></Col>
                        <Col xs={24} md={8} lg={6}>{DateComponent(card.createdOn)}</Col>
                        <Col xs={1} md={1} style={{marginLeft:'auto'}}>
                            <DeleteOutlined data-testid="delete-user-0" style={{color:'red',fontSize:'20px',marginRight:'5px'}} onClick={() => handleDelete(index)}/>
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
        {addUserDialog_isOpen && <Projects_AddUserModal handleAddUser={handleAddUser} projectName={projectName}  usersList={AssignedUsers} isOpen={addUserDialog_isOpen} handleClose={handleAddUserDialogClose} orgName={orgName}/>}
        </fieldset>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    projectUpdateInProgress:state.ProjectReducer.projectUpdateInProgress,
    projectUpdateSuccess:state.ProjectReducer.projectUpdateSuccess
  };
};

export default connect(mapStateToProps)(Project_Users_List_Card)
// export default Project_Users_List_Card