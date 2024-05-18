import { Button, Col, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import ServiceForm from "../../Orgnization/Organization_Info_Form";
import Organization_Info_Form from "../../Orgnization/Organization_Info_Form";
import ServicesList from "../../Orgnization/ServicesList";
import Users_List_Card from "./Users_List_Card";
import { useEffect, useState } from "react";
import { IparameterObj } from "../../type";
import { RootState } from "../../state/reducers";
import { connect } from "react-redux";
import { useLogoutRedirect, useToken } from "../../utils/getToken";
import {  setOrganizationDetailsSucessToFalse } from "../../state/new actions/organizationAction";
import { fetchOrganization_Admin_AssignedService_Details } from "../../state/new actions/generalUserAction";
import ContentLoader from "react-content-loader";



interface IOrganizationInfo{
    orgId:string,
    servicesList:object[] | null,
    organizationList:object[] | null,
    orgName:string,
    usersList:object [] | null,
    allRoles:any[] | null,
    fetchData:()=>void,
    service_User_DetailsFetchInProgress:boolean,
    service_User_DetailsFetchInSuccess:boolean,
}



function OrganizationInfo({orgId,orgName,allRoles,fetchData,...props }:IOrganizationInfo){
    const [serviceCardData, setServiceCardData]=useState<any>([])
    const [usersCardData,setUsersCardData]=useState<any>([])
    const getToken=useToken()
    const handleLogoutRedirect=useLogoutRedirect()
  
    useEffect(()=>{
        console.log('asdasdasd')
        const fetch=async()=>{
            await fetchOrganization_Admin_AssignedService_Details(orgId,getToken(),handleLogoutRedirect)
        }
        fetch()
    },[])   

    useEffect(()=>{
        if(props.service_User_DetailsFetchInSuccess){
            if(props.servicesList!=null){
                let temp = props.servicesList.map((data: any) => {
                    console.log(typeof data.parameterJsonData)
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
          children: <Organization_Info_Form fetchData={fetchData} orgId={orgId} organizationDetails={props.organizationList} />,
        },{
            key:'2',
            label:'Services',
            children:<ServicesList fetchData={fetchData} assignedServices={serviceCardData} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} orgId={orgId} cardData={serviceCardData}/>
        },{
            key:'3',
            label:'Users',
            children:<Users_List_Card prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} cardData={usersCardData} orgName={orgName} orgId={orgId} />
        }]
        const onChange = (key: string) => { 
            console.log(key);
          };

    return(
        <>
            {props.service_User_DetailsFetchInProgress &&   <ContentLoader 
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
            viewBox="0 0 380 200"
            >
            <rect x="0" y="0" rx="1" ry="1" width="378" height="32" />  
            
            <rect x="30" y="45" rx="3" ry="3" width="250" height="180" /> 
            </ContentLoader>}

        {!props.service_User_DetailsFetchInProgress && <Row className="organizationInfo" >
            {/* <Col xs={24} style={{justifyContent:'flex-end',padding:'10px',display:'flex'}}>
                <Button href="/create_organization" type="primary" >
                    Create Organization
                </Button>
            </Col> */}

            <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"space-between",display:'flex',padding:'10px 10px 10px 5%',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{orgName}</b></span>
                <span style={{fontSize:18}}>Access Role: <b>Organization Admin</b></span>
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



const mapStateToProps = (state: RootState) => {
    return {
        organizationFetchSuccess:state.OrganizationFetchReducer.organizationFetchSuccess,
        servicesList:state.OrganizationFetchReducer.servicesList,
        usersList:state.OrganizationFetchReducer.usersList,
        organizationList:state.OrganizationFetchReducer.organizationList,
        service_User_DetailsFetchInProgress:state.OrganizationFetchReducer.service_User_DetailsFetchInProgress,
        service_User_DetailsFetchInSuccess:state.OrganizationFetchReducer.service_User_DetailsFetchInSuccess,
    };
  };
export default connect(mapStateToProps)(OrganizationInfo)
  