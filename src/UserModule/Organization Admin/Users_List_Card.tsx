import { DeleteOutlined, EditOutlined, Loading3QuartersOutlined, LoadingOutlined, PlusCircleOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, Row, Select, Spin,notification } from "antd"
import { useEffect, useState } from "react";
import './Users_List_Card.css'
import { deleteOrganizationAdmin, setOrganizationAdminDuplicacyToNull } from "../../state/new actions/organizationAction";
import { RootState } from "../../state/reducers";
import { connect } from "react-redux";
import { useMsal } from "@azure/msal-react";
import { useLogoutRedirect, useToken } from "../../utils/getToken";
interface IUsers_List_Card{
  cardData:{ userEmail: string; createdOn: string; roleName: string; }[],
  usersList:object[] | null,
  orgId:string,
  orgName:string,
  prevStep:()=>void,
  nextStep:(value:any)=>void,
  prevStepExists:boolean,
  nextStepExist:boolean,
  organizationUpdateSuccess:boolean,
  organizationUpdateInProgress:boolean,
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


function Users_List_Card({cardData,orgName,orgId,prevStep,nextStep,prevStepExists,nextStepExist,...props}:IUsers_List_Card){
    const [accessToken,setAccessToken]=useState("")
    const [AssignedUsers, setAssignedusers] = useState(cardData); // An array containing card data
    const [addUserDialog_isOpen,setAddUserDialog_isOpen]=useState(false)
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
  

    const st = useMsal();

    let activeAccount:any;
    let prop:any
  

    const handleDelete = async(index:number) => {
      const updatedCardData = [...AssignedUsers];
      await deleteOrganizationAdmin(AssignedUsers[index],orgName,getToken(),handleLogoutRedirect)
      updatedCardData.splice(index, 1);
      setAssignedusers(updatedCardData);
      
    };
    function previousStep(){
      prevStep()
    }

    const handleAddUserDialogOpen=()=>{
      setAddUserDialog_isOpen(true)
    };
    const handleAddUserDialogClose=()=>{
      setAddUserDialog_isOpen(false)
    };

    useEffect(()=>{
      if (st) {
        const {instance} = st
        activeAccount = instance.getActiveAccount();
        prop=instance.getActiveAccount()?.idTokenClaims
        const homeAccId:string=activeAccount.homeAccountId 
        const tenantId:string=activeAccount.tenantId
        const aud:string=prop.aud
        const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
        const sessionValue:any=sessionStorage.getItem(sId)
        const jsonObj=JSON.parse(sessionValue)
        const token=jsonObj.secret
        setAccessToken(token)
    }
    },[])
    useEffect(()=>{
      if(props.organizationUpdateSuccess){
        notification.success({
          message: 'Changes done Successfully',
        });
      }
    },[props.organizationUpdateSuccess])

    



    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin /> 
    return(
        <fieldset style={{backgroundColor:'white',borderRadius:'10px',padding:'10px',margin:'0 auto',width:'80%'}}>
          <legend style={{fontSize:'20px'}}>Users List</legend>
        <Row justify={"center"} align={'top'} style={{ display:'flex',alignItems:'flex-start',alignContent:'flex-start', height: '65vh', overflow: 'auto',paddingRight:'1vw'}}>
              <Col xs={24} style={{textAlign:'left'}}>
                <h3>Organization Admins</h3>
              </Col>
                {AssignedUsers.length==0 && <Col xs={24} lg={20} style={{marginTop:'13vh'}} >
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Organization Admin
                  <br/>
                  Assign a Organization Admin first to see the results
                </div>
              }
              />
              </Col>}
            {props.organizationUpdateInProgress==true && <Col xs={24} lg={20}><Spin indicator={antIcon}/></Col>}
            {props.organizationUpdateInProgress==false && AssignedUsers.map((card,index)=>(
                <Col xs={24} lg={20} > 
                <Card key={index} style={{marginBottom:'5px',padding:'0px',border:'1px solid lightgray'}} >
                    <Row justify={"start"} align={"middle"} >
                        <Col xs={2} lg={2}><UserOutlined /></Col>
                        <Col xs={24} md={14}  style={{fontSize:15,textAlign:'left'}}> <b>{card.userEmail}</b></Col>
                        <Col xs={24} md={8} lg={6}>{DateComponent(card.createdOn)}</Col>
                        <Col xs={1} md={1} style={{marginLeft:'auto'}}>
                            <DeleteOutlined data-testid="delete-user-0" onClick={()=>{handleDelete(index)}}
                              style={{color:'red',fontSize:'20px',marginRight:'5px',opacity: 0.5,cursor: 'not-allowed'}}
                            />
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
                    <Button type="primary"  href="/?id=4" style={{width:'113px'}}>
                        Close
                    </Button> 
                  </div>
                </Col>}
            </Row>
        </fieldset>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    organizationUpdateInProgress:state.OrganizationFetchReducer.organizationUpdateInProgress,
    organizationUpdateSuccess:state.OrganizationFetchReducer.organizationUpdateSuccess,
    usersList:state.OrganizationFetchReducer.usersList,
  };
};

export default connect(mapStateToProps)(Users_List_Card)
// export default Users_List_Card