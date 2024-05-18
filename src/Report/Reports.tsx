
import { connect } from 'react-redux';
import { RootState } from '../state/reducers';
import { useMsal } from "@azure/msal-react";
import { Col, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import {models} from 'powerbi-client'
import "./Reports.css"
import { fetchAllOrganizationNames,fetchAllProjectDetails } from '../state/new actions/projectAction';
import { fetchGeneralUser_OrganizationDetails, fetchGeneralUser_ProjectDetails } from '../state/new actions/generalUserAction';
import { useLogoutRedirect } from '../utils/getToken';
const { Option } = Select;


interface IReport{
    fromDashboard:boolean,
    userRole:string | null,
    data:object[],
    buildingNames:any[],
    apartmentNames:any[],
    organizationList:any[] | null,
    servicesList:object[] | null,
    projectsList:object[] | null,
    fetchError:string | null ,
    dataFetch_success:boolean,
    dataFetch_InProgress:boolean,
    organizationNamesFetch_Success:boolean
}
function Report({userRole,fromDashboard,...props}:IReport){
    const [selectedOrganization,setSelectedOrganization]=useState(props.organizationList && props.organizationList .length > 0 ? props.organizationList [0] : null)
    const [selectedOrganizationName,setSelectedOrganizationName]=useState("")
    const [iframeURL,setIframeURL]=useState("")
    const [embedConfig, setEmbedConfig] = useState<any | null>(null);
    const [report,setReport]=useState("")
    const handleLogoutRedirect=useLogoutRedirect()
    const { instance,accounts } = useMsal();

    let activeAccount:any;
    let prop:any
    function getToken(){
      if(instance){
        activeAccount = instance.getActiveAccount();
        prop=instance.getActiveAccount()?.idTokenClaims
        const homeAccId:string=activeAccount.homeAccountId 
        const tenantId:string=activeAccount.tenantId
        const aud:string=prop.aud
        const sId=homeAccId.concat("-login.windows.net-idtoken-").concat(aud).concat("-").concat(tenantId).concat("---")
        const sessionValue:any=sessionStorage.getItem(sId)
        const jsonObj=JSON.parse(sessionValue)
        const token=jsonObj.secret
        return token
      }
      else{
        return ""
      }
    }

    
    const handleModalOrganizationSelect=(org:any)=>{
        if(props.organizationList)
        {
            const selectedOrg = props.organizationList.find(obj => obj.id=== org.value);
            setSelectedOrganization(selectedOrg)
            setSelectedOrganizationName(org.label) 
        }
    }

    const handleReportSelect=(val:any)=>{
        setReport(val)
        setIframeURL(`https://app.powerbi.com/reportEmbed?reportId=7d356e6c-d713-45a9-a21f-8507b16c631a&autoAuth=true&ctid=4507ae57-9a7b-4236-ba38-2189a5328f71`)
    }   
    useEffect(()=>{
        const fetchData=async(userEmail:any)=>{
          if(userRole=="Super Admin")
          await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
        else 
          await fetchGeneralUser_OrganizationDetails(userEmail,getToken(),handleLogoutRedirect)
        }
        if (instance) {
            setReport("Report 1")
            setIframeURL(`https://app.powerbi.com/reportEmbed?reportId=7d356e6c-d713-45a9-a21f-8507b16c631a&autoAuth=true&ctid=4507ae57-9a7b-4236-ba38-2189a5328f71`)
            if(props.organizationList==null && props.fetchError==null && activeAccount.localAccountId) // To avoid repeatedly database call
              {
                prop=instance.getActiveAccount()?.idTokenClaims
                fetchData(prop.preferred_username)
              }
        }
      },[])


 useEffect(()=>{
  const fetchProjectData=async(orgId:any)=>{
    prop=instance.getActiveAccount()?.idTokenClaims
      if(userRole=="Super Admin")
        await fetchAllProjectDetails(orgId,getToken(),handleLogoutRedirect)
      else
        await fetchGeneralUser_ProjectDetails(orgId,prop.preferred_username,getToken(),handleLogoutRedirect)
  }

    if(props.organizationList){
      setSelectedOrganization(props.organizationList[0])
      setSelectedOrganizationName(props.organizationList[0].name)
      const orgId=props.organizationList[0].id
      fetchProjectData(orgId)
    }
  },[props.organizationList,props.organizationNamesFetch_Success])

return(
    <Row style={{height:'92vh',backgroundColor:'white'}}>
    <Col xs={24} style={{height:"8vh",borderBottom:'1px solid black'}}>   
      <Row align={"middle"} style={{height:"100%"}}>
        <Col xs={fromDashboard?5:3}><b>Select Organization</b></Col>
        {props.organizationList && selectedOrganization && <Col xs={fromDashboard?6:5}>
          <Select style={{width:'100%' , textAlign:'left'}} 
            onSelect={handleModalOrganizationSelect}
            value={selectedOrganization.id} labelInValue
            >
              {props.organizationList?.map((op:any,index:number)=>{
              return(
              <Option key={op.name} label={op.name} value={op.id} props style={{}}>
              {op.name}
              </Option>
              )
              })}  
          </Select>
        </Col>}
        <Col xs={fromDashboard?5:3}><b>Select Report</b></Col>
        <Col xs={fromDashboard?6:5}>
            <Select style={{width:'100%' , textAlign:'left'}} 
                onSelect={handleReportSelect} 
                value={report} labelInValue 
            >
                <Option key={"Report 1"} value={"Report 1"} props style={{}} >Report 1</Option>
                <Option key={"Report 2"} value={"Report 2"} props style={{}} >Report 2</Option>

            </Select>
        </Col>
      </Row>
    </Col>
    <Col xs={24} style={{height:"84vh"}} id="abc">
      {/* <PowerBIEmbed 
          embedConfig={{
            type: 'report',
            id: '7d356e6c-d713-45a9-a21f-8507b16c631a', // Replace with your Power BI report ID
            embedUrl: "https://app.powerbi.com/reportEmbed", // Replace with your Power BI report's embed URL
            accessToken: getToken(), // Replace with your Power BI access token
            tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
            settings: {
              panes: {
                filters: {
                  expanded: true,
                  visible: false
                }
              },
              background: models.BackgroundType.Transparent,
            }
          }}
          eventHandlers={
            new Map([
              ['loaded', function () { console.log('Report loaded'); }],
              ['rendered', function () { console.log('Report rendered'); }],
              ['error', function (event:any) { console.log(event.detail); }]
            ])
          }

          cssClassName={"Embed-container"}

          // getEmbeddedComponent={(embeddedReport) => {
          //   this.report = embeddedReport as models.Report;
          // }}
        /> */}
        <iframe
            title="Power BI Report"
            style={{width: "100%",height: "100%"}}
            src={iframeURL}
            scrolling='no'
            frameBorder="0"
            >
        </iframe>

    </Col>
  </Row>
)
}

const mapStateToProps = (state: RootState) => {
    return {
        data:state.DashboardReducer.data,
        dataFetch_success:state.DashboardReducer.dataFetch_success,
        organizationList:state.ProjectReducer.organizationList,
        organizationNamesFetch_Success:state.ProjectReducer.organizationNamesFetch_Success,
        fetchError:state.ProjectReducer.fetchError,
        servicesList:state.ProjectReducer.servicesList,
        projectsList:state.ProjectReducer.projectsList,
        buildingNames:state.DashboardReducer.buildingNames,
        dataFetch_InProgress:state.DashboardReducer.dataFetch_InProgress,
        apartmentNames:state.DashboardReducer.apartmentNames
    };
  };

export default connect(mapStateToProps)(Report)