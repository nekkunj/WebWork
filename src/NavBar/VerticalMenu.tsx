import { ContainerOutlined, DesktopOutlined,HomeOutlined, LineChartOutlined, MenuOutlined, PieChartOutlined, ProfileOutlined, ProjectOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Col, Menu, MenuProps, Row } from "antd";
import { useEffect, useState } from "react";
import Report from "../Report/Reports"
import ServicesList from  '../Services/ServicesList'
import OrganizationList from "../Orgnization/OrganizationList";
import OrganizationList_InProject from "../Projects/OrganizationList_InProject";
import Organization_List_UserM from "../Updated User Management/Organization_List_UserM";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import Dashboard from "../Dashboard/Dashboard";
import { fetchUserRole } from "../state/new actions/generalUserAction";
import UserModuleProjectDetails from "../UserModule/UserModuleProjectDetails";
import OrganizationAdmin_OrganizationList from "../UserModule/Organization Admin/OrganizationAdmin_OrganizationList";
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }
  



interface IVerticalMenu{
  role:string | null,
  roleFetch_Error:string | null,
  userRoleInProgress:boolean,
  menuItemNumber:number
}
function VerticalMenu({menuItemNumber,...props}:IVerticalMenu){
  const { instance } = useMsal();

  let activeAccount:any;
  let prop:any

  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const [disableActiveStyle,setDisableActiveStyle]=useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState<number>(menuItemNumber);
  const [collapseClick,setCollapseClick]=useState<boolean|undefined>(true)

  // const dispatch=useAppDispatch()
  const MenuComponent=[
    <Dashboard userRole={props.role} />,
    <Report userRole={props.role} fromDashboard={false}/>,
    <OrganizationList />,
    <ServicesList />,
    <OrganizationList_InProject />,
    <Organization_List_UserM />,
]
  const UserModuleMenuComponent=[
    <Dashboard userRole={props.role} />,
    <Report userRole={props.role} fromDashboard={false}/>,
    // <OrganizationAdmin_OrganizationList userId={userId} userEmail={userEmail}/>,
    <UserModuleProjectDetails userId={userId} userEmail={userEmail}/>,
  ]
  const handleMenuClick = (e: any) => {
    // dispatch()
    if (Number(e.key)==1){
      handleCollapseClick() 
      setDisableActiveStyle(true)
    }
    else
    {
      setActiveMenuItem(Number(e.key));
      setDisableActiveStyle(false)
    }
  };
  const handleCollapseClick=()=>{
    setCollapseClick(!collapseClick)
  }
  const superAdminItems: MenuItem[] = [
    getItem('', '1', <MenuOutlined   />),
    getItem('Dashboard', '2', <HomeOutlined  />),
    getItem("Reports","3",<ProfileOutlined />),
    getItem('Organization', '4', <DesktopOutlined />),
    getItem('Services', '5', <ContainerOutlined />),
    getItem('Project', '6', <ProjectOutlined />),
    getItem('User Management', '7', <UserSwitchOutlined   />),
  ]
  const userModuleItems: MenuItem[] = [
    getItem('', '1', <MenuOutlined   />),
    getItem('Dashboard', '2', <HomeOutlined  />),
    getItem("Reports","3",<ProfileOutlined />),
    getItem('Project', '4', <ProjectOutlined />),

  ]
  useEffect(()=>{
    async function getData(role:any){
      await fetchUserRole(role)
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
      if(prop){
        getData(prop.roles)
        setUserId(activeAccount.localAccountId)
        setUserEmail(prop.preferred_username)
      }
    }
  },[])

    return (
      <>
       {props.role !=null && <Row  justify={"start"}  style={{minHeight:'93vh'}}>
          <Col xs={24}  lg={collapseClick==true?1:3}  style={{minHeight:'93vh'}}>  
            <Menu
              style={{ flex:'auto',height:'100%',minHeight:'93vh',width:'100%'}}
              onClick={handleMenuClick}
              defaultSelectedKeys={[`${props.role!="Super Admin" && menuItemNumber>4 ?  4:menuItemNumber}`]}
              defaultOpenKeys={['sub1']}
              inlineCollapsed={collapseClick}
              mode="inline"
              theme="dark"
              items={props.role=="Super Admin"?superAdminItems:userModuleItems}
            />
          </Col>
          
          { props.role=="Super Admin" && <Col className="transition-col" xs={24} lg={collapseClick==true?23:21}>
            {MenuComponent[activeMenuItem-2]}  {/*  ActiveMenuItem starts from 2 as key=1 is the icon */}
            
          </Col> }

          { props.role=="General User" && <Col className="transition-col" xs={24} lg={collapseClick==true?23:21}>
            {UserModuleMenuComponent[activeMenuItem-2]}  {/*  ActiveMenuItem starts from 2 as key=1 is the icon */}
          </Col> }
        </Row>}
        
      </>

      );
    
}
const mapStateToProps = (state: RootState) => {
  return {
      role:state.RoleReducer.role,
      roleFetch_Error:state.RoleReducer.roleFetch_Error,
      userRoleInProgress:state.RoleReducer.userRoleInProgress
  };
};

export default connect(mapStateToProps)(VerticalMenu)
// export default VerticalMenu