import { useEffect } from "react";
import Create_Organization_Steps from "./Create_Organization_Steps"
import {Row, Col, Button, Empty, Result} from 'antd'
import { fetchUserRole } from "../../state/new actions/generalUserAction";
import { useMsal } from '@azure/msal-react';
import { connect } from "react-redux";
import { RootState } from "../../state/reducers";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
interface IVerticalMenu{
    role:string | null,
    roleFetch_Error:string | null,
    userRoleInProgress:boolean,
  }
function Create_Organization({...props}:IVerticalMenu){
    const { instance } = useMsal();

    let activeAccount:any;
    let prop:any
    useEffect(()=>{
        async function getData(userEmail:any,accessToken:any){
          await fetchUserRole(userEmail)
      }
        if (instance) {
          activeAccount = instance.getActiveAccount();
          prop=instance.getActiveAccount()?.idTokenClaims
          const homeAccId:string=activeAccount.homeAccountId 
          const tenantId:string=activeAccount.tenantId
          const aud:string=prop.aud
          const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
          const sessionValue:any=sessionStorage.getItem(sId)
          const jsonObj=JSON.parse(sessionValue)
          const token=jsonObj.secret
          getData(prop.roles,token)
        }
      },[])
    
    return(
        <Row justify="center" align="top" style={{height:'93vh',paddingTop:'7vh'}}>
            <Col xs={23} sm={21.5} md={16} xl={15}>
                {props.role==null&& <><LoadingOutlined style={{fontSize:30}}/></>}
                {props.role=="Super Admin" && <Create_Organization_Steps />}
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
  
  export default connect(mapStateToProps)(Create_Organization)
