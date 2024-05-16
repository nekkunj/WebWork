import React, { useEffect } from 'react';
import { Button, Card, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './Profile.css';
import { useMsal } from '@azure/msal-react';
import { RootState } from '../state/reducers';
import { connect } from 'react-redux';
import { fetchUserRole } from '../state/new actions/generalUserAction';
interface IVerticalMenu{
  role:string | null,
  roleFetch_Error:string | null,
  userRoleInProgress:boolean
}
function Profile({...prp}:IVerticalMenu)  {

  const { instance } = useMsal();

  let activeAccount:any;
  let props:any

  if (instance) {
   activeAccount = instance.getActiveAccount();
   props=instance.getActiveAccount()?.idTokenClaims
  //  getData(activeAccount.localAccountId)
  }
  const handleResetPassword = () => {
    // Implement your reset password logic here
    console.log('Reset password clicked');
  };

  useEffect(()=>{
    async function getData(roles:any,accessToken:any){
      await fetchUserRole(roles)
  }
    if (instance) {
      activeAccount = instance.getActiveAccount();
      props=instance.getActiveAccount()?.idTokenClaims
      const homeAccId:string=activeAccount.homeAccountId 
      const tenantId:string=activeAccount.tenantId
      const aud:string=props.aud
      const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
      const sessionValue:any=sessionStorage.getItem(sId)
      const jsonObj=JSON.parse(sessionValue)
      const token=jsonObj.secret
      getData(props.roles,token)
    }
  },[])
  return (
    <div className="Profile">
      <Card title="User Profile" className="profile-card" headStyle={{fontSize:'22px'}}>
        <div className="welcome-message">
          <p>User Role: {prp.role}</p>
        </div>
        <div className="profile-field">
          <label>First Name:</label>
          <Input value={props.name.split(' ')[0]} disabled prefix={<UserOutlined />} />
        </div>
        <div className="profile-field">
          <label>Last Name:</label>
          <Input value={props.name.split(' ')[1]} disabled prefix={<UserOutlined />} />
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <Input value={props.preferred_username} disabled prefix={<UserOutlined />} />
        </div>
        <div className="profile-field">
          <Button type="primary" onClick={handleResetPassword} icon={<LockOutlined />}>
            Reset Password
          </Button>
        </div>

      </Card>
    </div>
  );
};
const mapStateToProps = (state: RootState) => {
  return {
      role:state.RoleReducer.role,
      roleFetch_Error:state.RoleReducer.roleFetch_Error,
      userRoleInProgress:state.RoleReducer.userRoleInProgress
  };
};

export default connect(mapStateToProps)(Profile)
// export default Profile
