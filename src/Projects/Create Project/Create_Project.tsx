import Create_Project_Steps from "./Create_Project_Steps"
import {Row, Col, Button, Result} from 'antd'
import { useEffect } from "react";
import { IsOrganizationAdmin } from "../../state/new actions/generalUserAction";
import { useMsal } from '@azure/msal-react';
import { connect } from "react-redux";
import { RootState } from "../../state/reducers";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { useLogoutRedirect,useToken } from "../../utils/getToken";
interface ICreateProject{
    role:string | null,
    roleFetch_Error:string | null,
    userRoleInProgress:boolean,
  }
function Create_Project({...props}:ICreateProject){
    const { instance } = useMsal();
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
    let activeAccount:any;
    let prop:any
    useEffect(()=>{
        async function getData(userId:any,roles:string){
          await IsOrganizationAdmin(userId,roles,getToken(),handleLogoutRedirect)
      }
        if (instance) {
          activeAccount = instance.getActiveAccount();
          prop=instance.getActiveAccount()?.idTokenClaims
          getData(prop.preferred_username,prop.roles)
        }
      },[])
    return(
        <Row justify="center" align="top" style={{height:'93vh',paddingTop:'5vh'
        }}>
            <Col xs={23} sm={21.5} md={16} xl={15}>
                {props.role==null && <><LoadingOutlined style={{fontSize:30}}/></>}
                {props.role=="OrganizationAdmin" && <Create_Project_Steps  userRoleAccess={props.role}/>}
                {props.role=="Super Admin"  && <Create_Project_Steps  userRoleAccess={props.role}/>}
                
                {props.role=="General User" && 
                    <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Link to="/"><Button type="primary" >Back Home</Button></Link>}
                    />
                }
                
            </Col>
            
        </Row>
    )
}
const mapStateToProps = (state: RootState) => {
    return {
        role:state.RoleReducer.role,
        roleFetch_Error:state.RoleReducer.roleFetch_Error,
        userRoleInProgress:state.RoleReducer.userRoleInProgress
    };
  };
  
  export default connect(mapStateToProps)(Create_Project)
