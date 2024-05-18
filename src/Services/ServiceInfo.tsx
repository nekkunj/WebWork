import { Button, Col, Row, Tabs } from "antd"
import type { TabsProps } from 'antd';
import ServiceForm from "./ServiceForm";
import ServicesList from "./ServicesList";
import ServiceUserDefinedForm from "./ServiceUserDefinedForm";




interface IServiceInfo{
    data:any,
}

function ServiceInfo({data}:IServiceInfo){
    const items: TabsProps['items'] = [
        {
          key: '1',
          label: `Service Info`,
          children: <ServiceForm data={data} />,
        },
        {
            key:'2',
            label:'Service Form',
            children: <ServiceUserDefinedForm data={data}/>
        }
    ]
    
    const onChange = (key: string) => {
        console.log(key);
    };

    return(
        <Row  >
            <Col xs={24}  style={{backgroundColor:'	#A7BBCB',justifyContent:"center",display:'flex',padding:'10px 10px 10px 10px',height:'7vh' }}>
                <span style={{marginRight:'40px',fontSize:'24px',color:'#001529'}}><b>{data.name}</b></span>
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

export default ServiceInfo