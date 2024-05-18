import { Button, Col, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import ServiceForm from "./Organization_Info_Form";
import Organization_Info_Form from "./Organization_Info_Form";
import ServicesList from "./ServicesList";
import Users_List_Card from "./Users_List_Card";
import { useEffect, useState } from "react";
import { IparameterObj } from "../type";
import { fetchOrganization_Admin_AssignedService_Details, setOrganizationDetailsSucessToFalse } from "../state/new actions/organizationAction";
import { useLogoutRedirect, useToken } from "../utils/getToken";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import ContentLoader from "react-content-loader";

interface IOrganizationInfo{
    orgId:string,
    organizationDetails:any | null,
    organizationList:any | null,
    fetchData:()=>void,
    orgName:string,
    organizationFetchSuccess:boolean,
    servicesList:object[] | null,
    usersList:object [] | null,
    service_User_DetailsFetchInProgress:boolean,
    service_User_DetailsFetchInSuccess:boolean,
}



function OrganizationInfo({orgId,organizationDetails,orgName,fetchData,...props }:IOrganizationInfo){
    const [serviceCardData, setServiceCardData]=useState<any>([])
    const [usersCardData,setUsersCardData]=useState<any>([])
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
  

    useEffect(()=>{
        if(props.service_User_DetailsFetchInSuccess){
            if(props.servicesList!=null){
                let temp = props.servicesList.map((data: any) => {
                    if (typeof data.parameterJsonData === 'string') {
                        const correctedJsonString = data.parameterJsonData.replace(/'/g, '"');
                        return {
                            ...data,
                            parameterJsonData: correctedJsonString === "" ? null : JSON.parse(correctedJsonString)
                        };
                    }
                    return data;
                });
                setServiceCardData(temp);
            }
            else
                setServiceCardData(props.servicesList)
            setUsersCardData(props.usersList)
            setOrganizationDetailsSucessToFalse()
        }
    },[props.service_User_DetailsFetchInSuccess])   

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
    <span>{localDateTimeString}</span>
    )
    }
    const items: TabsProps['items'] = [
        {
          key: '1',
          label: `Organization Info`,
          children: <Organization_Info_Form orgId={orgId} organizationDetails={organizationDetails} fetchData={fetchData}/>,
        },{
            key:'2',
            label:'Services',
            children:<ServicesList orgId={orgId} assignedServices={serviceCardData} fetchData={fetchData} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false}  cardData={serviceCardData}/>
        },{
            key:'3',
            label:'Users',
            children:<Users_List_Card orgName={orgName} orgId={orgId} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} cardData={usersCardData}  />
        }]
        const onChange = (key: string) => {
            // console.log(key);
          };

    return(
        <>
            {props.service_User_DetailsFetchInProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            style={{width:'100%',height:'100vh'}}
            viewBox="0 0 100% 100%"
          >
            <rect x="0" y="0" rx="1" ry="1" width="84vw" height="14vh" />  
            
            <rect x="7.4vw" y="18vh" rx="8" ry="8" width="67.2vw" height="55vh" /> 
          </ContentLoader>}

        {!props.service_User_DetailsFetchInProgress && <Row className="organizationInfo" >
            {/* <Col xs={24} style={{justifyContent:'flex-end',padding:'10px',display:'flex'}}>
                <Button href="/create_organization" type="primary" >
                    Create Organization
                </Button>
            </Col> */}
            <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"center",display:'flex',padding:'10px 10px 10px 10px',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{organizationDetails.name}</b></span>
            </Col>

            <Col xs={24} style={{height:'75vh'}}>
                <Tabs  defaultActiveKey="1"
                tabBarStyle={{backgroundColor:'	#A7BBCB',paddingLeft:'5%',color:'#001529'}}
                onChange={onChange}
                size="large"
                tabPosition={'top'}
                style={{ maxHeight: 300 }} 
                items={items} />
            </Col>
        </Row> }
        </>
    )
}

// export default OrganizationInfo

const mapStateToProps = (state: RootState) => {
    return {
        organizationFetchSuccess:state.OrganizationFetchReducer.organizationFetchSuccess,
        servicesList:state.OrganizationFetchReducer.servicesList,
        organizationList:state.OrganizationFetchReducer.organizationList,
        usersList:state.OrganizationFetchReducer.usersList,
        service_User_DetailsFetchInProgress:state.OrganizationFetchReducer.service_User_DetailsFetchInProgress,
        service_User_DetailsFetchInSuccess:state.OrganizationFetchReducer.service_User_DetailsFetchInSuccess,
    };
  };
  
  export default connect(mapStateToProps)(OrganizationInfo)
