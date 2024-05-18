import { DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Input, Modal, Row,Select,Table,notification } from "antd";
import { useEffect, useState } from "react";
import { changeUserRole, setUserDuplicacyToNull } from "../state/new actions/userManagementAction";
import {fetchingUsers_UserManagement,deleteUser, deleteOrganizationAdmin_UserManagement} from "../state/new actions/userManagementAction"
import { connect } from "react-redux";
import { RootState } from "../state/reducers";
import UserManagement_AddUserModal from "./AddUserModal_UserM";
import "./Users_List_Card.css"
import { useLogoutRedirect, useToken } from "../utils/getToken";
import ContentLoader from "react-content-loader";
type NotificationType = 'success' | 'info' | 'warning' | 'error';
const { Option } = Select;


interface IProjectList{
    projectNames:object[] | null,
    userNames:object[] | null,
    orgId:string,
    organizationName:any,
    updateUser_Success:boolean,
    deleteUser_Success:boolean,
    updateUser_Error:string | null,
    duplicacy:boolean | null,
    fetchingDetails_Success:boolean,
    fetchingDetails_InProgress:boolean
  }
  const allUserRoles:any[]=[
    { value: 'OrganizationAdmin', label: 'Organization Admin' },
    { value: 'ProjectAdmin', label: 'Project Admin' },
    { value: 'Writer', label: 'Writer' },
    { value: 'Reader', label: 'Reader' },
  ]
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
function UserTable({orgId,organizationName,...props}:IProjectList){
    // const [api, contextHolder] = notification.useNotification();
    const [addUserDialog_isOpen,setAddUserDialog_isOpen]=useState(false)
    const [projectTabData, setProjectTabData]=useState<object[]>([])
    const [selectedProjectId,setSelectedProjectId]=useState(undefined)
    const [usersCardData,setUsersCardData]=useState<any[]>([])
    const [newRole,setNewRole]=useState<string>("")
    const [modalOpen,setModalOpen]=useState(false)
    const [projectId,setProjectId]=useState("")
    const [projectName,setProjectName]=useState("")
    const [selectedUserCard,setSelectedUserCard]=useState(null)
    const[filter_userEmail,setFilter_userEmail]=useState('')
    const [deleteSuccessHandled, setDeleteSuccessHandled] = useState(false);
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
    
    let idx:number=-1
  
    const handleDelete = async(index:number) => {
      const updatedCardData = [...usersCardData];
      if(usersCardData[index].roleName=="OrganizationAdmin")
        await deleteOrganizationAdmin_UserManagement(usersCardData[index],getToken(),handleLogoutRedirect)
      else
        await deleteUser(usersCardData[index],getToken(),handleLogoutRedirect)
      updatedCardData.splice(index, 1);
      setUsersCardData(updatedCardData);
    };
    useEffect(()=>{
        setProjectId("")
        const fetch=async()=>{
            await fetchingUsers_UserManagement(orgId,getToken(),handleLogoutRedirect)
        }
        fetch()
    },[])
    const handleAddUserDialogOpen=()=>{
        setAddUserDialog_isOpen(true)
        setUserDuplicacyToNull()
      };
      const handleAddUserDialogClose=()=>{
        setAddUserDialog_isOpen(false)
      };
      const handleAddUser=async(userEmail:string,userRole:string)=>{
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
    
        // today = mm + '-' + dd + '-' + yyyy;
          // const obj:{ documentId:string,userEmail: string; createdAt: string; userRole: string; }={
          //   userEmail:userEmail,
          //   createdAt:String(today),
          //   userRole:userRole
          // }
          // const newData=[obj,...AssignedUsers]
          // setAssignedusers(newData)
          await fetchingUsers_UserManagement(orgId,getToken(),handleLogoutRedirect)
        }
        const handleChangeUserRole=async(cardData:any,index:number,newUserRole:string,oldUserRole:string)=>{
            const obj:any={...cardData}
            obj.userRole=oldUserRole   // Because cardData.userRole is changing is role, so old userRole is changing, hence getting it back
            //Condition 1: Organization to Project Admin/Reader/Writer
            // Condition 2:Project Admin/Reader/Writer to Organization Admin 
            // Condition 3:Project Admin/Reader/Writer to Project Admin/Reader/Writer 
            setDeleteSuccessHandled(false);
            
            
            if(newUserRole!="OrganizationAdmin" ){ //Condition 1 
                idx=index
                setNewRole(newUserRole)
                setSelectedUserCard(obj)
                setModalOpen(true)
            }
            else if(newUserRole=="OrganizationAdmin"){ //condition 2
                const updatedCardData = [...usersCardData];
                await changeUserRole(obj,newUserRole,"",orgId,"",organizationName,getToken(),handleLogoutRedirect)
                updatedCardData[index].roleName=newUserRole;
                setUsersCardData(updatedCardData);
                }
            // else{ //condition 3
            //     const updatedCardData = [...usersCardData];
            //     await changeUserRole(obj,newUserRole,obj.projectId,orgId,getToken(),handleLogoutRedirect)
            //     updatedCardData[index].roleName=newUserRole;
            //     setUsersCardData(updatedCardData);
            // }
           
          }
          function filterById(item:any,projectId:any){
            if(item.projectName){
            const projectObj:any=props.projectNames?.filter((oj:any)=>oj.id==projectId)

                if(item.projectName==projectObj[0].name )
                    return true
                else
                    return false
            }
            else
                return false
          }
        const setFilter=(projectId:any,email:any)=>{
            if(props.userNames!=null){
                const temp=props.userNames
                if(projectId==""){
                    setUsersCardData(temp.filter((obj:any) => {return(obj.userEmail.includes(email))}))
                }
                else if(projectId=="All"){
                    setUsersCardData(temp.filter((obj:any) => {return(obj.userEmail.includes(email))}))
                }
                else if(projectId){
                    const abc=temp.filter((user:any)=>filterById(user,projectId))
                    setUsersCardData(abc.filter((obj:any) => {return(obj.userEmail.includes(email))}))
                }
            }
        }

        const handleSelectProject=(proId:any)=>{
            setSelectedProjectId(proId)
            setFilter(proId,filter_userEmail)       
        }
        const handleEmailChange=(email:any)=>{
            setFilter_userEmail(email)
            setFilter(selectedProjectId,email)
        }

        const onOk=async ()=>{
            setModalOpen(false)
            const updatedCardData = [...usersCardData];
            if(selectedUserCard)
            {   
                await changeUserRole(selectedUserCard,newRole,projectId,orgId,projectName,organizationName,getToken(),handleLogoutRedirect)
            }
            // updatedCardData[idx].userRole=newRole;
            setUsersCardData(updatedCardData);
            setProjectId("")
            setSelectedUserCard(null)
            
        }
        const onCancel=()=>{
            setModalOpen(false)
            setProjectId("")
            setSelectedUserCard(null)
        }
        const handleChangeProject=(obj:any)=>{
            setProjectName(obj.label)
            setProjectId(obj.value)
        }
        const columns = [
            {
              title: 'User Email',
              dataIndex: 'userEmail',
              key: 'userEmail',
            //   filters: usersCardData.map((item) => ({ text: item.userEmail, value: item.userEmail })),
            //   onFilter: (value:any, record:any) => record.userEmail.includes(value),
            },
            {
              title: 'Project',
              dataIndex: 'project',
              key: 'project',
              render: (text:any, record:any) => (
                record.projectName ? record.projectName: 'NA'
              ),
            //   filters: usersCardData.map((item) => ({ text: item.projectId?getProjectName(item.projectId):'NA', value: item.projectId?getProjectName(item.projectId):'NA' })),
            //   onFilter: (value:any, record:any) => record.project.includes(value),
            },
            {
              title: 'Created At',
              dataIndex: 'createdOn',
              key: 'createdAt',
              render: (text:any, record:any) => (
                <>{DateComponent(text)}</>
              ),
            },
            {
                title: 'User Role',
                dataIndex: 'roleName',
                key: 'userRole',
                render: (text:any, record:any,index:number) => (
                    <Select options={allUserRoles} onChange={(v:any)=>handleChangeUserRole(record,index,v,record.roleName)} style={{width:'100%'}} value={record.roleName}/>
                ),
            },
            {
              title: 'Action',
              key: 'action',
              render: (_:any, record:any,index:number) => (
                <DeleteOutlined style={{color:'red',fontSize:'20px',marginRight:'5px'}} onClick={() => handleDelete(index)}/>
              ),
            },
          ];


    const fetchData=async ()=>{
        await fetchingUsers_UserManagement(orgId,getToken(),handleLogoutRedirect)
    }


    useEffect(()=>{

        if(props.userNames!=null)
            setUsersCardData(props.userNames)

        if( props.projectNames!=null){
             setProjectTabData(props.projectNames)
        }

    },[props.fetchingDetails_Success, props.userNames, props.projectNames])

    useEffect(()=>{
        if(props.duplicacy==true){
            notification.error({
                message: 'User already present with different role in this organization!',
                });
            fetchData()
        }
    },[props.duplicacy])

    useEffect(()=>{
        
        if(props.updateUser_Success==true){
            notification.success({
                message: 'User Added Successfully',
                });
            fetchData()
        }
    },[props.updateUser_Success])

    useEffect(()=>{
        
        if(props.deleteUser_Success==true && !deleteSuccessHandled){

            notification.success({
                message: 'User Deleted Successfully',
                });
            fetchData()
            setDeleteSuccessHandled(true);
        }
    },[props.deleteUser_Success])

    useEffect(()=>{
        if(props.updateUser_Error!=null){
            notification.error({
                message:props.updateUser_Error,
                });
        }
    },[props.updateUser_Error])
    return(
        <>
        {props.fetchingDetails_InProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100vh'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="1" ry="1" width="84vw" height="7vh" />  
            <rect x="2.5vw" y="8vh" rx="8" ry="8" width="76vw" height="55vh" />  
      </ContentLoader>}
      {!props.fetchingDetails_InProgress && <Row  style={{ maxHeight:'93vh'}}>
            <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"center",display:'flex',padding:'10px 10px 10px 10px',height:'7vh' }}>
                <span data-testid="test-abc-name-span" style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{organizationName}</b></span>
            </Col>
            <Col xs={24}>
            <Row justify={"center"} align={"top"}  >
                    <Col xs={24} lg={23} style={{backgroundColor:'white',height:'9vh',borderRadius:'10px',padding:'10px',margin:'0 auto',width:'90%',marginTop:'7px',marginBottom:'7px'}}>
                        <div key={0} className="user-filter">
                            <Row justify={'space-between'} align={"top"}>
                                <Col xs={3} style={{textAlign:"left"}}>
                                    <b style={{fontSize:'20px',textAlign:'left'}}>Users List</b>
                                </Col>
                                <Col xs={8}>
                                    <Input
                                    placeholder="Search User Email"
                                    value={filter_userEmail}
                                    onChange={(e) => handleEmailChange( e.target.value)}
                                    />
                                </Col>
                                <Col xs={5}>
                                    <Select style={{width:'100%',textAlign:'left'}}
                                        showSearch
                                        placeholder="Select Project"
                                        onChange={handleSelectProject}
                                        getPopupContainer={node => node.parentNode}
                                        value={selectedProjectId} 
                                    >
                                            <Option key={"All"} label={"All"} value={"All"} props>
                                                All
                                            </Option>
                                        {projectTabData.map((pro:any)=>{
                                            return(
                                                <Option key={pro.name} label={pro.name} value={pro.id} props >
                                                    {pro.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                </Col>
                                <Col xs={4}>
                                    <Button type="primary"  style={{width:'113px'}}onClick={handleAddUserDialogOpen}>Add New User</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    {usersCardData.length==0 && <Col xs={24} lg={23} >
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

                   {usersCardData.length>0 && <Col xs={24} lg={23} >
                        <Table 
                            columns={columns} 
                            dataSource={usersCardData} 
                            pagination={{ pageSize: 7 }}
                        />

                    </Col>}

{/*                     
                    {usersCardData.map((card,index)=>(
                        <Col xs={24} lg={23}>
                        <Card key={index+1} style={{marginBottom:'5px',padding:'0px',border:'1px solid lightgray'}} >
                            <Row justify={"start"} align={"middle"}>
                                <Col xs={2} lg={2}><UserOutlined /></Col>
                                <Col xs={24} md={11} lg={11} style={{fontSize:15,textAlign:'left'}}> <b>{card.userEmail}</b></Col>
                                {card.projectId && <Col xs={24} md={4} lg={4} style={{fontSize:15,textAlign:'left'}}>{getProjectName(card.projectId)}</Col>}
                                {!card.projectId && <Col xs={24} md={4} lg={4} style={{fontSize:15,textAlign:'left'}}>NA</Col>}
                                <Col xs={24} md={7} lg={5}>
                                <Select options={allUserRoles} onChange={(v:any)=>handleChangeUserRole(card,index,v,card.userRole)} style={{width:'100%'}} value={card.userRole}/>
                                </Col>  
                                <Col xs={1} md={1} style={{marginLeft:'auto'}}>
                                    <DeleteOutlined style={{color:'red',fontSize:'20px',marginRight:'5px'}} onClick={() => handleDelete(index)}/>
                                </Col>
                            </Row>
                            
                        </Card>
                        </Col>
                    ))} */}
                    
                </Row>
            </Col>
                    {/* {contextHolder} */}

                    
        {addUserDialog_isOpen && <UserManagement_AddUserModal 
                                  orgName={organizationName}
                                  usersList={usersCardData}
                                  isOpen={addUserDialog_isOpen} 
                                  handleClose={handleAddUserDialogClose} 
                                  projectNames={projectTabData}
                                  handleAddUser={handleAddUser}
                                  organizationId={orgId}
                                  />}
        <Modal title="Select Project" open={modalOpen} onOk={onOk} onCancel={onCancel}>
          Select Project <br/>
          <Select 
            onChange={handleChangeProject}
            value={projectId} labelInValue
            getPopupContainer={node => node.parentNode}
            style={{width:'25vw'}}
          >
            {projectTabData.map((pro:any)=>{
                return(
                    <Option key={pro.name} label={pro.name} value={pro.id} props >
                        {pro.name}
                    </Option>
                )
            })}
        </Select>
        </Modal> 

        </Row>
        }
        </>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
      organizationUpdateInProgress:state.OrganizationFetchReducer.organizationUpdateInProgress,
      fetchingDetails_Success:state.UserManagementReducer.fetchingDetails_Success,
      fetchingDetails_InProgress:state.UserManagementReducer.fetchingDetails_InProgress,
      updateUser_Progress:state.UserManagementReducer.updateUser_Progress,
      updateUser_Success:state.UserManagementReducer.updateUser_Success,
      updateUser_Error:state.UserManagementReducer.updateUser_Error,
      duplicacy:state.UserManagementReducer.duplicacy,
      deleteUser_Success:state.UserManagementReducer.deleteUser_Success,
      projectNames:state.UserManagementReducer.projectNames,
      userNames:state.UserManagementReducer.userNames,
    };
  };
  
  export default connect(mapStateToProps)(UserTable)