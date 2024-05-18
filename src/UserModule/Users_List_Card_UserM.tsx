import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusCircleOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Select, Spin } from "antd"
import { useEffect, useState } from "react";
import './Users_List_Card.css'
import UserManagementAddUserModal from "./addUserModal_UserM";
import { deleteUser, setUserDuplicacyToNull,fetchingUsers_UserManagement } from "../state/new actions/userManagementAction";
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect, useToken } from "../utils/getToken";
interface IUsers_List_Card{
  updateUser_Progress:boolean,
  organizationUpdateInProgress:boolean,
  cardData:{ userEmail: string; createdOn: string; roleName: string; }[] ,
  organizationId:any,
  projectId:any,
  userRole:string,
  projectName:string
  orgName:string
}

function UserManagementUsersListCard({cardData,projectName,orgName,organizationId,projectId,userRole,...props}:IUsers_List_Card){
    const [AssignedUsers, setAssignedusers] = useState(cardData); // An array containing card data
    const [addUserDialog_isOpen,setAddUserDialog_isOpen]=useState(false)
    const [selfEmail,setSelfEmail]=useState("")
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
    const handleDelete = async(index:number) => {
      const updatedCardData = [...AssignedUsers];
      await deleteUser(AssignedUsers[index],getToken(),handleLogoutRedirect)
      updatedCardData.splice(index, 1);
      setAssignedusers(updatedCardData);
      
    };
    const handleAddUser=async (userEmail:string,userRole:string)=>{
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
  
      // today = mm + '-' + dd + '-' + yyyy;
        const obj:{ userEmail: string; createdOn: string; roleName: string; }={
          userEmail:userEmail,
          createdOn:String(today),
          roleName:userRole
        }
        const newData=[obj,...AssignedUsers]
        setAssignedusers(newData)
        await fetchingUsers_UserManagement(organizationId,getToken(),handleLogoutRedirect)
        
      }

    const handleAddUserDialogOpen=()=>{
      setAddUserDialog_isOpen(true)
      setUserDuplicacyToNull()
    };
    const handleAddUserDialogClose=()=>{
      setAddUserDialog_isOpen(false)
    };
    function checkUserRoleDeleteAccess(userRole:any,delete_userRole:any){
      if(userRole=="Reader" || userRole=="Writer")
        return true
      if(userRole=="OrganizationAdmin" && delete_userRole=="OrganizationAdmin")
        return true
      if(userRole=="ProjectAdmin" && delete_userRole=="OrganizationAdmin")
        return true
      if(userRole=="ProjectAdmin" && delete_userRole=="ProjectAdmin")
        return true
      else 
        return false
    }
  useEffect(()=>{
    if(cardData){
      setAssignedusers(cardData)
    }
  },[])
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />
  const isDisabled = userRole === 'Reader' || userRole === 'Writer';

    return(
      <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',margin:'0 auto',width:'85%'}}>
      <legend style={{fontSize:'20px'}}>Users List</legend>
        <div style={{ height: '65vh',overflow: 'auto' }}>
        <Row justify={"center"} >
              <Col xs={24} style={{textAlign:'left'}}>
                <h3>Users List</h3>
              </Col>
                {!isDisabled && <Col xs={24} lg={23 }>
                  <div className="add-card" onClick={handleAddUserDialogOpen}>
                    <PlusOutlined style={{fontSize:24}}/>
                    Add new User
                  </div>
                </Col> }
            {AssignedUsers.length==0 && <Col xs={24} lg={23} style={{marginTop:'13vh'}} >
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Users
                  <br/>
                  Add a user first to see the results
                </div>
              }
              />
              </Col>}
            {AssignedUsers.map((card,index)=>(
                <Col xs={24} lg={23}>
                <Card key={index} style={{marginBottom:'5px',padding:'0px',border:'1px solid lightgray'}} >
                    <Row justify={"start"} align={"middle"}>
                        <Col xs={2} lg={2}><UserOutlined /></Col>
                        <Col xs={24} md={11} lg={11} style={{fontSize:15}}> <b>{card.userEmail}</b></Col>
                        <Col xs={24} md={8} lg={10}>{card.roleName}</Col>
                        <Col xs={1} md={1} style={{marginLeft:'auto'}}>
                            <DeleteOutlined data-testid="delete-user-0"
                              style={{color:'red',fontSize:'20px',marginRight:'5px',
                              opacity: isDisabled || checkUserRoleDeleteAccess(userRole,card.roleName) || card.userEmail==selfEmail ? 0.5: 1, 
                              cursor: isDisabled || checkUserRoleDeleteAccess(userRole,card.roleName) || card.userEmail==selfEmail? 'not-allowed' : 'pointer' }}  
                              onClick={() => isDisabled || checkUserRoleDeleteAccess(userRole,card.roleName) || card.userEmail==selfEmail?console.log("Not Allowed"):handleDelete(index)}/> 
                        </Col> 
                    </Row>
                    
                </Card>
                </Col>
            ))}
        </Row>
        {addUserDialog_isOpen && <UserManagementAddUserModal 
                                  usersList={AssignedUsers}
                                  isOpen={addUserDialog_isOpen} 
                                  handleClose={handleAddUserDialogClose} 
                                  projectId={projectId}
                                  userRole={userRole}
                                  handleAddUser={handleAddUser}
                                  organizationId={organizationId}
                                  projectName={projectName}
                                  orgName={orgName}
                                  />}
        </div>
        </fieldset>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationUpdateInProgress:state.OrganizationFetchReducer.organizationUpdateInProgress,
    updateUser_Progress:state.UserManagementReducer.updateUser_Progress
    
  };
};

export default connect(mapStateToProps)(UserManagementUsersListCard)
// export default UserManagementUsersListCard