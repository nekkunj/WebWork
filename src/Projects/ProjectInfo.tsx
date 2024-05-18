import { Button, Col, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import Organization_Info_Form from "../Orgnization/Organization_Info_Form";
import ServicesList from "./Project_ServicesList";
import Users_List_Card from "../Orgnization/Users_List_Card";
import Project_Users_List_Card from "./Project_Users_List_Card";
import ProjectForm from "./ProjectForm";
import { useEffect, useState } from "react";


interface IProjectInfo{
    orgId:string,
    orgName:string,
    projectNames:any,
    serviceNames:any,
    userNames:any,
    projectId:string,
    fetchData:()=>void
}

function ProjectInfo({orgId,orgName,projectNames,serviceNames,userNames,projectId,fetchData}:IProjectInfo){

    const [servicesTabData, setServicesTabData]=useState<any>()
    useEffect(()=>{
      if(serviceNames){
        let temp = serviceNames.map((data: any) => {
          if (typeof data.parameterJsonData === 'string') {
              const correctedJsonString = data.parameterJsonData.replace(/'/g, '"');
              return {
                  ...data,
                  parameterJsonData: correctedJsonString === "" ? null : JSON.parse(correctedJsonString)
              };
          }
          return data;
      });
      setServicesTabData(temp);
        // setServicesTabData(serviceNames.filter((obj:any) => obj.projectId === projectNames.projectId))
      }

    },[])


    const items: TabsProps['items'] = [
        {
          key: '1',
          label: `Project Info`,
          children: <ProjectForm orgId={orgId} projectId={projectId} data={projectNames}/>,
        },
        {
            key: '2',
            label: `Services`,
            children: <ServicesList fetchData={fetchData}  prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false}  orgId={orgId} cardData={servicesTabData} projectId={projectId}/>,
        },
        {
            key: '3',
            label: `Users`,
            children: <Project_Users_List_Card organizationId={orgId} projectName={projectNames.name} orgName={orgName} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} cardData={userNames} projectId={projectId}/>,
          }]
        const onChange = (key: string) => {
            // console.log(key);
          };

    return(
        <Row  >
            
            <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"center",display:'flex',padding:'10px 10px 10px 10px',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{projectNames.name}</b></span>
            </Col>

            <Col xs={24} style={{height:'75vh'}}>
                <Tabs  defaultActiveKey="1"
                onChange={onChange}
                tabBarStyle={{backgroundColor:'	#A7BBCB',paddingLeft:'5%',color:'#001529'}}
                size="large"
                tabPosition={'top'}
                style={{ maxHeight: 300}} 
                items={items} />
            </Col>
        </Row> 
        
    )
}

export default ProjectInfo