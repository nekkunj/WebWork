import React, { useEffect,useState, useRef } from 'react';
import 'chartjs-adapter-date-fns';
import { connect } from 'react-redux';
import "./UserDashboard.css"
import { RootState } from '../state/reducers';
import { useMsal } from "@azure/msal-react";
import Report from "../Report/Reports"
import { fetchApartmentNames, fetchBuildingNames, fetchDasboardSensorData } from '../state/new actions/dashboardAPI';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HCExporting from "highcharts/modules/exporting";
import type { MenuProps } from 'antd';
import { Button, Col, Collapse, DatePicker, Divider, Dropdown, Empty, Menu, Modal, Row, Select, Tooltip } from 'antd';
import { fetchAllProjectDetails } from '../state/new actions/projectAction';
import { CaretDownOutlined, CaretRightOutlined, DatabaseFilled, FullscreenOutlined, LineChartOutlined, LoadingOutlined, MenuOutlined, PlayCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import 'split-pane-react/esm/themes/default.css'
import MySplitPane from './MySplitPane';
import { fetchAllOrganizationNames } from '../state/new actions/projectAction';
import { useLogoutRedirect, useToken } from '../utils/getToken';
import { fetchGeneralUser_OrganizationDetails, fetchGeneralUser_ProjectDetails, fetchProject_ServiceDetails } from '../state/new actions/generalUserAction';
const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
// Initialize exporting module
HCExporting(Highcharts);

interface IDashboard{
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
    organizationNamesFetch_Success:boolean,
    projectFetchSuccess:boolean
} 
const config = {
  title: 'Warning!',
  content: (
    <>
      We are not able to update graph due to incomplete information from unreal.
    </>
  ),
};

const sensortType_Temperature:any[]=[
  {value:"",label:"All"},
  { value: 'RoomTemp', label: 'RoomTemp' },
  { value: 'AptReturnTemp', label: 'AptReturnTemp' },
  { value: 'AvgTemp', label: 'AvgTemp' },
  { value: 'Ventilation_SupplyTemp', label: 'Ventilation_SupplyTemp' },
  { value: 'Ventilation_ReturnTemp', label: 'Ventilation_ReturnTemp' },
  { value: 'CPump_SupplyTemp', label: 'CPump_SupplyTemp' },
]

const sensortType_Power:any[]=[
  {value:"",label:"All"},
  { value: 'TenantUsage', label: 'TenantUsage' },
  { value: 'WaterHeater', label: 'WaterHeater' },
  { value: 'ElectricBoiler_Power', label: 'ElectricBoiler_Power' },
  { value: 'Ventilation_Power', label: 'Ventilation_Power' },
  { value: 'ElectricBox_Power', label: 'ElectricBox_Power' },
  { value: 'ExteriorLighting', label: 'ExteriorLighting' },
]
const sensortType_Energy:any[]=[
  {value:"",label:"All"},
  { value: 'TenantUsage', label: 'TenantUsage' },
  { value: 'WaterHeater', label: 'WaterHeater' },
  { value: 'ElectricBoiler_Power', label: 'ElectricBoiler_Power' },
  { value: 'Ventilation_Power', label: 'Ventilation_Power' },
  { value: 'ElectricBox_Power', label: 'ElectricBox_Power' },
  { value: 'ExteriorLighting', label: 'ExteriorLighting' },
]
const sensortType_Volume:any[]=[
  {value:"",label:"All"},
  { value: 'CPump_Flow', label: 'CPump_Flow' },
]
const sensorType_Obj:any={
  'Temperature':sensortType_Temperature,
  'Power':sensortType_Power,
  'Energy':sensortType_Energy,
  'VolumeRate':sensortType_Volume
}

  function DateComponent(timestamp:string){
    const date = new Date(timestamp);
    const swedenTimeOffset = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const swedenDate = new Date(date.getTime() + swedenTimeOffset);
  
    const MM = String(swedenDate.getUTCMonth() + 1).padStart(2, '0');
    const DD = String(swedenDate.getUTCDate()).padStart(2, '0');
    const YYYY = swedenDate.getUTCFullYear();
    const hh = String(swedenDate.getUTCHours()).padStart(2, '0');
    const mm = String(swedenDate.getUTCMinutes()).padStart(2, '0');

    return `${MM}-${DD}-${YYYY} ${hh}:${mm}`;
  }

interface CustomCollapsiblePanelProps {
  header: React.ReactNode;
  children: JSX.Element;
  isOpen: boolean;
  onClick: () => void;
}
const CustomCollapsiblePanel: React.FC<CustomCollapsiblePanelProps> = ({ header, children ,isOpen,onClick}) => {


  return (
    <div>
      {!isOpen && <Row justify={'space-evenly'} onClick={onClick} className={"custom-panel-header"} >
        <Col xs={1} ><CaretRightOutlined /></Col>
        <Col xs={23} >{header}</Col>
      </Row>}
      {isOpen && <Row justify={'space-evenly'}  className={"custom-panel-content"}>
      <Col xs={1} onClick={onClick}  className={"custom-panel-content-toggler"}><CaretDownOutlined /></Col>
      <Col xs={23}>{children}</Col>
      </Row>}
    </div>
  );
};






function Dashboard({userRole,...props}:IDashboard){
  const [selectedCategory,setSelectedCategory]=useState("Temperature")
  const [modelOpenBI, setmodelOpenBI] = useState(false);
  const [sensortType_Options,setSensortType_Options]=useState<any[]>(sensorType_Obj['Temperature'])
  const [selectedSensortType,setselectedSensortType]=useState(sensorType_Obj['Temperature'][1].value)
  const [projectService,setProjectService]=useState<any>({})
  const [selectedOrganization,setSelectedOrganization]=useState(props.organizationList && props.organizationList .length > 0 ? props.organizationList [0] : null)
  const [selectedOrganizationName,setSelectedOrganizationName]=useState("") 
  const [selectedBuilding,setSelectedBuilding]=useState("")
  const [selectedApartment,setSelectedApartment]=useState("")
  const [selectedProject,setSelectedProject]=useState<any| null>(null)
  const [projectsList_Options,setProjectsList_Options]=useState<object[]>([])
  const [accessToken,setAccessToken]=useState("")
  const [timeSpan,setTimeSpan]=useState("")
  const [timeSpanLabel,setTimeSpanLabel]=useState("")
  const [openPanels, setOpenPanels] = useState<number[]>([]);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [isStreamingFullscreen, setIsStreamingFullscreen] = useState(false);
  const [loadIframe,setLoadIframe]=useState(false)
  const [column1Size, setColumn1Size] = useState(60);
  const [reportView,setReportView]=useState(false)
  const [rangePicker,setRangePicker]=useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startTime,setStartTime]=useState("")
  const [endTime,setEndTime]=useState("")
  const graphDivRef = useRef<any>();
  const chartRef = useRef<any | null>(null);
  const iframeRef = useRef<any | null>(null);
  const streamingDivRef = useRef<any>();  
  const [colorId,setColorId]=useState<any| null>(null)
  const [modal, contextHolder] = Modal.useModal();
  const [dateRange,setDateRange]=useState()
  const [filterPanelOpen,setFilterPanelOpen]=useState(true)
  const [selectedHeading,setselectedHeading]=useState("")
  const handleLogoutRedirect=useLogoutRedirect()


  const buttonRef = useRef<HTMLButtonElement | null>(null);
  // const windowSize=20
  // const smoothedData = [];
  // for (let i = 0; i < props.data.length; i++) {
  //   const startIndex = Math.max(0, i - windowSize + 1);
  //   const endIndex = i + 1;
  //   const windowData = props.data.slice(startIndex, endIndex);
  //   const sum = windowData.reduce((acc:any, item:any) => acc + item.Value, 0);
  //   const average = sum / windowData.length;
  //   smoothedData.push({ ...props.data[i], smoothedValue: average });
  // }
  const groupedData: { [id: string]: any } = props.data?.reduce(
    (acc:any, item:any) => {
      if (!acc[item.Id]) {
        acc[item.Id] = [];
      }
      acc[item.Id].push(item);
      return acc;
    },
    {} as { [id: string]: any } // Explicitly type groupedData
  );   

  const series: Highcharts.SeriesOptionsType[] = Object.entries(
    groupedData
  ).map(([id, items]) => ({
    type: "line", // Add type property for line series
    name: id,
    color:getRandomHexColor(id),
    data: items.map((item:any) => ({
      x: new Date(item.TimeStamp).getTime(),
      y: item.Value,
    })),
  }));
  const sortByx=(a:any,b:any)=>a.x-b.x
  const sortedSeries=(series:any)=>{
    series.forEach((item:any)=>{
      item.data.sort(sortByx)
    })
  }
  sortedSeries(series)
  const options:any={
    chart: {
      type: "line",
      zoomType: "x"
    }as Highcharts.Options["chart"],
    exporting: {
      enabled: false, // Disable exporting options including context menu
    },
    title: {
      text: `${selectedBuilding.toLowerCase() === "all" ? selectedCategory.toLocaleLowerCase() === "temperature"? "Temperature of all buildings": selectedCategory + " of all buildings" : selectedCategory + " of " +selectedBuilding}`,
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Timestamp",
        style: {
          fontWeight: "bold", 
        }
      },
      labels: {
        style: {
            fontWeight: "bold",
        }
      }
    },
    yAxis: {
      title: {
        text: `${selectedBuilding.toLowerCase() === "all" && selectedApartment.toLowerCase() === "" ? selectedCategory.toLocaleLowerCase() === "temperature"? "Average temperature "+ "Value(" + getUnits(selectedCategory) +")": "Value(" + getUnits(selectedCategory) +")" :  "Value(" + getUnits(selectedCategory) +")"}`,
        style: {
          fontWeight: "bold", 
        }
      },
      labels: {
        style: {
            fontWeight: "bold", 
        }
      }
    },
    series
  };
  options.title = null;
  options.chart = { ...options.chart, ...{ title: null } };
  
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
  const eventHandler = (event:any) => {
    if (!event.data.type)
    {
      try {
        const parsedData = JSON.parse(event.data);
        if(parsedData.Type == "ProjectInfoRequest")
        {
          console.log("got first time obbject")
          if (buttonRef.current) {
            buttonRef.current.click();
          }
        }
        else if(parsedData.Type == "TwinData")
        {
          console.log("Data from unreal",parsedData);
          // const descriptor1 = {
          //   Type: "TwinData",
          //   Organization: "Norden Estates",
          //   Project: "Sosdala",
          //   Building: "Sosdala_House2",
          //   Apartment: "Sosdala_House2_42D",
          //   Category: "Temperature",
          //   Sensor: "RoomTemp",
          //   TimeSpan: "1h",
          //   dtId: [
          //     {
          //     "name": "Sosdala_House2_42D_RoomTemp",
          //     "seriesColor": "#8fa191"
          //     }
          //   ]
          // };      
          HandleResponseFromUE4(parsedData)
        }
      } catch (err:any) {}
        
    }
  }

  async function  HandleResponseFromUE4(jsonObj:any)
  {    
    if(Object.keys(jsonObj).length > 0)
    {
      if(jsonObj.dtId.length>0){
        setColorId(jsonObj.dtId)
      }
      if(jsonObj.Organization !== "" && jsonObj.Project !== "" && jsonObj.Building !== "" && jsonObj.Apartment !== "" && jsonObj.Category !== "" && jsonObj.Sensor !== "")
      {
        // setSelectedOrganization(jsonObj.Organization)
        // setSelectedOrganizationName(jsonObj.Organization)
        const foundProjectObject:any=projectsList_Options?.find((obj:any) => obj.name === jsonObj.Project);
        if(foundProjectObject)
          setSelectedProject(foundProjectObject);
        setSelectedBuilding(jsonObj.Building);
        //fetchApartmentNames(getToken(),jsonObj.Building,handleLogoutRedirect)
        if(jsonObj.Apartment !== "All")
        {
          setSelectedApartment(jsonObj.Apartment);
          setSelectedCategory(jsonObj.Category);
          setselectedSensortType(jsonObj.Sensor);
          setselectedHeading(getHeadingText(jsonObj.Building,jsonObj.Apartment === ""? "All":jsonObj.Apartment,jsonObj.Category,jsonObj.Sensor))
          await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,jsonObj.Building,jsonObj.Apartment,jsonObj.Category,jsonObj.Sensor,"24h","","",handleLogoutRedirect)
        
        }
        else
        {
          setSelectedApartment("");
          setSelectedCategory(jsonObj.Category);
          setselectedSensortType(jsonObj.Sensor);
          setselectedHeading(getHeadingText(jsonObj.Building,jsonObj.Apartment === ""? "All":jsonObj.Apartment,jsonObj.Category,jsonObj.Sensor))
          await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,jsonObj.Building,"",jsonObj.Category,jsonObj.Sensor,"24h","","",handleLogoutRedirect)

        }  
      }
      else
        modal.warning(config)
    }
    else{
      modal.warning(config)
    }
  }
 
  async function getBuildingNames(accessToken:any,projectName:any){
      await fetchBuildingNames(accessToken,selectedOrganization.id,projectName,handleLogoutRedirect)
  }
  useEffect(()=>{
    setSensortType_Options(sensortType_Temperature)
    const fetchData=async(userEmail:any)=>{

      if(userRole=="Super Admin")
        await fetchAllOrganizationNames(getToken(),handleLogoutRedirect)
      else 
        await fetchGeneralUser_OrganizationDetails(userEmail,getToken(),handleLogoutRedirect)
    }
    if (instance) { 
        setAccessToken(getToken())
        if(props.organizationList==null && props.fetchError==null) // To avoid repeatedly database call
          fetchData(prop.preferred_username)
    }
  },[])
 useEffect(()=>{
  const fetchProjectData=async(orgId:any,userEmail:string)=>{
      if(userRole=="Super Admin")
        await fetchAllProjectDetails(orgId,getToken(),handleLogoutRedirect)
      else
        await fetchGeneralUser_ProjectDetails(orgId,userEmail,getToken(),handleLogoutRedirect)
  }

    if(props.organizationList){
      setSelectedOrganization(props.organizationList[0])
      setSelectedOrganizationName(props.organizationList[0].name)
      const orgId=props.organizationList[0].id
      if(instance){
        prop=instance.getActiveAccount()?.idTokenClaims
        fetchProjectData(orgId,prop.preferred_username)
      }
    }
  },[props.organizationList])


  useEffect(()=>{
    async function ChangeOrganizatinList(){
      if(props.organizationList){
        // setSelectedOrganization(props.organizationList[0])
        // setSelectedOrganizationName(props.organizationList[0].name)
        // const orgId=props.organizationList[0].id
        if(props.projectsList){
          const t:any[]=props.projectsList
          if(t.length==0) {
            setSelectedProject(null) 
            setProjectService(null)
            if(instance){
              getBuildingNames(getToken(),null)
            }
          }
          else{
            setProjectsList_Options(t)
            setSelectedProject(t[0])
            await fetchProject_ServiceDetails(t[0].id,getToken(),handleLogoutRedirect)

            if(instance){
              getBuildingNames(getToken(),t[0].name)
            }
            // if("services" in props.projectsList[0]){
            //   const ser:any=props.projectsList[0].services
            //   setProjectService(ser[0])
            // }
          }
        } 
      }
    }
    ChangeOrganizatinList()
  },[props.projectsList])

useEffect(()=>{
if(props.servicesList){
  const ser:any=props.servicesList
  setProjectService(ser[0])
}
},[props.servicesList])


  useEffect(()=>{
    async function getData(accessToken:any,buildingName:any){
      fetchApartmentNames(accessToken,selectedOrganization.id,buildingName.toLowerCase()== "all" ? "" : buildingName,selectedProject.name,handleLogoutRedirect)
      setSelectedBuilding(buildingName)
      setTimeSpan("24h")
      setTimeSpanLabel("Last 24 hour")
      setselectedHeading(getHeadingText(buildingName,selectedApartment == "" ? "All":selectedApartment,selectedCategory,selectedSensortType))
      await fetchDasboardSensorData(accessToken,selectedOrganization.id,selectedProject.name,buildingName.toLowerCase()== "all" ? "" : buildingName,selectedApartment,selectedCategory,selectedSensortType,"24h",startTime,endTime,handleLogoutRedirect)
  }
    if(props.buildingNames.length>0 && instance)
    {
        const token=getToken()
        setAccessToken(token)
        if(selectedProject && selectedProject.name=="Sosdala")
          setSelectedBuilding(props.buildingNames[1])
        else
          setSelectedBuilding(props.buildingNames[0])

        getData(token,props.buildingNames[1])
    }
    if(props.buildingNames.length==0){
      setSelectedBuilding("")
      fetchApartmentNames(getToken(),selectedOrganization?.id,"","",handleLogoutRedirect)
    }

    
  },[props.buildingNames])

  useEffect(()=>{
    if(props.apartmentNames.length>0){
      setSelectedApartment("")
    }
    else{
      setSelectedApartment("")
    }
  },[props.apartmentNames])

const handleBuildingSelect=async(opt:any)=>{
  //console.log("buildingName", opt)
  setSelectedBuilding(opt)
  fetchApartmentNames(getToken(),selectedOrganization.id,opt,selectedProject.name,handleLogoutRedirect)
  setselectedHeading(getHeadingText(opt,"All",selectedCategory,selectedSensortType))
  await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedOrganization.id,opt.toLowerCase()=="all"?"":opt,"",selectedCategory,selectedSensortType,timeSpan,startTime,endTime,handleLogoutRedirect)
  
}
const callAPI=async(opt:any)=>{
    setselectedHeading(getHeadingText(selectedBuilding,selectedApartment,selectedCategory,selectedSensortType))  
    await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,selectedBuilding.toLowerCase()=="all"?"":selectedBuilding,selectedApartment,selectedCategory,selectedSensortType,opt,"","",handleLogoutRedirect)
  }
useEffect(() => {
  toggledropdown(rangePicker);
}, [rangePicker]);
const handleTimeSpanSelect=(opt:any)=>{
  setTimeSpan(opt)
  if(opt=="custom")
  {
    setRangePicker(true)
    setTimeSpanLabel("Custom")
    setIsDropdownOpen(true)
  }
  else{
  setStartTime("")
  setEndTime("")
  setRangePicker(false)
  setIsDropdownOpen(false)
  }

  if(opt=="30m")
    setTimeSpanLabel("Last 30 minutes")
  else if(opt=="1h")
    setTimeSpanLabel("Last 1 hour")
  else if(opt=="6h")
    setTimeSpanLabel("Last 6 hours")
  else if(opt=="24h")
    setTimeSpanLabel("Last 24 hours")
  else if(opt=="7d")
    setTimeSpanLabel("Last week")
  else if(opt=="14d")
    setTimeSpanLabel("Last 2 weeks")
  else if(opt=="30d")
    setTimeSpanLabel("Last month")

  if(opt!="custom")
    callAPI(opt)
}


const handleSensorTypeSelect=async(sType:any)=>{
  setselectedSensortType(sType)
  setselectedHeading(getHeadingText(selectedBuilding,selectedApartment == "" ? "All":selectedApartment,selectedCategory,sType))
  await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,selectedBuilding.toLowerCase()=="all"?"":selectedBuilding,selectedApartment,selectedCategory,sType,timeSpan,startTime,endTime,handleLogoutRedirect)
}
const handleCatoryOnSelect=async(category:any)=>{
  setSelectedCategory(category)
  setSensortType_Options(sensorType_Obj[category])
  setselectedSensortType(sensorType_Obj[category][1].value)  
  setselectedHeading(getHeadingText(selectedBuilding,selectedApartment == "" ? "All":selectedApartment,category,sensorType_Obj[category][1].value))
  await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,selectedBuilding.toLowerCase()=="all"?"":selectedBuilding,selectedApartment,category,sensorType_Obj[category][1].value,timeSpan,startTime,endTime,handleLogoutRedirect)
}
const handleModalOrganizationSelect=(org:any)=>{
  if(props.organizationList)
  {
    const selectedOrg = props.organizationList.find(obj => obj.id=== org.value);
    setSelectedOrganization(selectedOrg)
    setSelectedOrganizationName(org.label) 
  }
}
const handleSelectedOrganization=async (org:any)=>{
  if(props.organizationList)
  {
    const selectedOrg = props.organizationList.find(obj => obj.id=== org.value);
    setSelectedOrganization(selectedOrg)
    setSelectedOrganizationName(org.label) 
    if(instance){
      prop=instance.getActiveAccount()?.idTokenClaims
      if(userRole=="Super Admin")
        await fetchAllProjectDetails(org.value,getToken(),handleLogoutRedirect)
      else
        await fetchGeneralUser_ProjectDetails(org.value,prop.preferred_username,getToken(),handleLogoutRedirect)
    }
  }
}
const handleSelectProjectName=async (proj:any)=>{
  if(projectsList_Options){
    const selectedProj:any = projectsList_Options.find((obj:any) => obj.id=== proj.value);
    setSelectedProject(selectedProj)
    const ser:any[]=selectedProj.services
    setProjectService(null)
    await fetchProject_ServiceDetails(selectedProj.id,getToken(),handleLogoutRedirect)

  //   if(ser.length==0)
  //   setProjectService(null)
  // else 
  //   setProjectService(ser[0])
  }
  getBuildingNames(getToken(),proj.label)
}
const handleApartmentSelect=async(aprt:any)=>{
  setSelectedApartment(aprt)
  setselectedHeading(getHeadingText(selectedBuilding,aprt == "" ? "All":aprt,selectedCategory,selectedSensortType))
  await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,selectedBuilding.toLowerCase()=="all"?"":selectedBuilding,aprt,selectedCategory,selectedSensortType,timeSpan,startTime,endTime,handleLogoutRedirect)
}
const handlePanelClick = (panelIndex: number) => {
  if (openPanels.includes(panelIndex)) {
    setOpenPanels([]);
  } else {
    setOpenPanels([panelIndex]);
  }
};

const handleLoadIframe=()=>{
  setLoadIframe(true)
  setColumn1Size(40);
}
const toggleGraphFullscreen = () => {
  const graphDiv = graphDivRef.current;

  if (graphDiv) {
    if (!isGraphFullscreen) {
      graphDiv.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsGraphFullscreen(!isGraphFullscreen);
  }
};
const toggleStreamingFullscreen = () => {
  const streamingDiv = streamingDivRef.current;

  if (streamingDiv) {
    if (!isStreamingFullscreen) {
      streamingDiv.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsStreamingFullscreen(!isGraphFullscreen);
  }
};
const handleIframeLoad = () => {
  // The iframe has loaded, and you can now interact with it
  if (iframeRef.current) {
    // Focus on the iframe
    iframeRef.current.focus();
    // Send a message to the iframe
    iframeRef.current.contentWindow?.postMessage('Hello from parent!', '*');
  }
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isGraphFullscreen==true) {
    setIsGraphFullscreen(false); //exit full screen
  }
  if (event.key === 'Escape' && isStreamingFullscreen==true) {
    setIsStreamingFullscreen(false); //exit full screen
  }

};
const handleFullscreenChange = () => {
  if (!document.fullscreenElement && isGraphFullscreen==true) {
    setIsGraphFullscreen(false);//exit full screen
  }
  if (!document.fullscreenElement && isStreamingFullscreen==true) {
    setIsStreamingFullscreen(false);//exit full screen
  }
};

const btnSendcommand= (event:any) => {
  event.stopPropagation();  // Prevent the click event from propagating to the parent  
  if(series.length>0)
  {
    const seriesNames: {name:any; seriesColor:any}[] = series.map((item, index) => ({
      name: selectedApartment === "" && selectedBuilding ==="" ?  item.name: selectedApartment === "" && selectedBuilding !== "" ? selectedBuilding + "_" + item.name : selectedApartment +"_" + item.name,
      seriesColor: options.series[index].color,
    }));
    configureStreamAndSendMessage(selectedOrganization.name, selectedProject.name, selectedBuilding, selectedApartment, selectedCategory, selectedSensortType, timeSpan, seriesNames)  
  }
  else
  {
    configureStreamAndSendMessage(selectedOrganization.name, selectedProject.name, "", "", "", "", "", "")
  }
};

const graphDownloadSVG=async ()=>{
  if (chartRef && chartRef.current && chartRef.current.chart) {
    chartRef.current.chart.exportChart({
      type: 'image/svg+xml',
      filename: `${selectedBuilding}`
    }, {
      subtitle: {
        text: ''
      }
    });
  }
}

const graphDownloadJPEG=async ()=>{
  if (chartRef && chartRef.current && chartRef.current.chart) {
    chartRef.current.chart.exportChart({
      type: 'image/jpeg',
      filename: `${selectedBuilding}`
    }, {
      subtitle: {
        text: ''
      }
    });
  }
}

const graphDownloadPNG=async ()=>{
  if (chartRef && chartRef.current && chartRef.current.chart) {
    chartRef.current.chart.exportChart({
      type: 'image/png',
      filename: `${selectedBuilding}`
    }, {
      subtitle: {
        text: ''
      }
    });
  }
}

const graphDownloadCSV=async ()=>{
  if (chartRef && chartRef.current && chartRef.current.chart ) {

    const title=Object.keys(props.data[0]).join(',')
    const csvContent = 'data:text/csv;charset=utf-8,' + title +"\n"+ props.data.map((row:any) => Object.values(row).join(',')).join('\n');

    // Create a temporary download link for the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'chart_data.csv';

    // Trigger a click event on the anchor element to initiate the download
    link.click();
  }
}
const graphDownloadJSON=async()=>{
  if (chartRef && chartRef.current && chartRef.current.chart ) {
    const jsonData = JSON.stringify(props.data, null, 2);
    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a URL for the Blob
    const blobURL = URL.createObjectURL(blob);


    // Create a temporary download link for the CSV file
    const link = document.createElement('a');
    link.style.display = "none";
    link.href = blobURL;
    link.download = 'chart_data.json';
    document.body.appendChild(link);
    // Trigger a click event on the anchor element to initiate the download
    link.click();
    document.body.removeChild(link);
    // Revoke the Blob URL to free up resources
    URL.revokeObjectURL(blobURL);

  }
}
const menu = (
  <Menu style={{width:'175px',textAlign:'left'}} >
    <Menu.Item key="1" onClick={toggleGraphFullscreen} >{isGraphFullscreen?"Exit Full Screen":"Enter Full Screen"}</Menu.Item>
    <Menu.Item key="2"  onClick={graphDownloadSVG} >Download svg image</Menu.Item>
    <Menu.Item key="3"  onClick={graphDownloadJPEG} >Download jpeg image</Menu.Item>
    <Menu.Item key="4"  onClick={graphDownloadPNG} >Download png image</Menu.Item>
    <Menu.Item key="5" onClick={graphDownloadCSV}>Download csv</Menu.Item>
    <Menu.Item key="6" onClick={graphDownloadJSON}>Download json</Menu.Item>
  </Menu>
);

async function  handleCustomTime(range:any){
  setIsDropdownOpen(false)
  const [start, end] = range;
  const formattedStart = start.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  const formattedEnd = end.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  setStartTime(formattedStart)
  setEndTime(formattedEnd)
  setselectedHeading(getHeadingText(selectedBuilding,selectedApartment == "" ? "All":selectedApartment,selectedCategory,selectedSensortType))
  await fetchDasboardSensorData(getToken(),selectedOrganization.id,selectedProject.name,selectedBuilding.toLowerCase()=="all"?"":selectedBuilding,selectedApartment,selectedCategory,selectedSensortType,timeSpan,formattedStart,formattedEnd,handleLogoutRedirect)
}
function toggledropdown(abc:any){
  if(rangePicker)
    setIsDropdownOpen(true)
  else
    setIsDropdownOpen(abc)
}

function getRandomHexColor(id:string): string {

  if(colorId){
    const foundObject = colorId.find((item:any) => item.name === id);
    if (foundObject) 
      return foundObject.seriesColor;
  
  }
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

  return `#${red}${green}${blue}`;
}
const changeRangePicker=(d:any)=>{
  setDateRange(d) 
  setIsDropdownOpen(true)
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
window.addEventListener('keydown', handleEscape);

useEffect(() => {
  // add event listener
  window.addEventListener('message', eventHandler);

  // cleanup, remove event listener
  return () => {
    window.removeEventListener('message', eventHandler);
  };
}, []);

// window.addEventListener('message', eventHandler);


    return(
      <div style={{backgroundColor:'white'}}>
        <Row justify={'space-evenly'} style={{height:'93vh'}}>
          <MySplitPane column1Size={column1Size}>
            <Col xs={24} lg={24} style={{fontSize:'17px',backgroundColor:'white',height:'100%'}} id="content" className={` ${isGraphFullscreen ? 'graph-fullscreen' : ''}`} ref={graphDivRef}>
                {reportView && <Row justify={'space-evenly'} style={{position:'relative'}} >
                  <Col xs={24} className='popup-fullscreen-button-div'>
                      <LineChartOutlined  onClick={()=>{setReportView(false)}} style={{fontSize:'26px',marginRight:'7px'}}/>
                      <Tooltip title={isGraphFullscreen?"Exit Full Screen":"Enter Full Screen"} placement="left">
                        <FullscreenOutlined  style={{fontSize:'24px',color:'black'}}/>
                      </Tooltip>

                  </Col>
                  <Col xs={isGraphFullscreen?12:24} >
                    <Report userRole={userRole}  fromDashboard={true}/>
                  </Col>
                </Row>}
                {!reportView && <Row justify={'space-evenly'} style={{position:'relative'}} >
                {selectedBuilding!="" && <Col xs={24} className='left-top-align'>
                    {!filterPanelOpen && <Button size='small' type="primary" onClick={()=>{setFilterPanelOpen(true)}}>Show filters</Button>}
                    {filterPanelOpen && <Button size='small' type="primary" onClick={()=>{setFilterPanelOpen(false)}}>Hide filters</Button>}
                  </Col>}
                  <Col xs={24} className='popup-fullscreen-button-div'>
                    <ProfileOutlined onClick={()=>{setReportView(true)}} style={{fontSize:'26px',marginRight:'7px'}}/>
                    <Dropdown overlay={menu} placement="bottomLeft" arrow getPopupContainer={(node:any) =>  node.parentNode}>
                      <MenuOutlined style={{fontSize:'24px'}}/>
                    </Dropdown>
                    {/* <Tooltip title={isGraphFullscreen?"Exit Full Screen":"Enter Full Screen"} placement="left">
                      <FullscreenOutlined  style={{fontSize:'24px'}}/>
                    </Tooltip> */}
                  </Col>
                  <Col xs={24} >
                    <h3 style={{marginTop:'1vh'}}>
                      {selectedHeading}
                      {/* {selectedBuilding.toLowerCase() === "all" && selectedApartment.toLowerCase()==="all" ? selectedCategory.toLocaleLowerCase() === "temperature"? "Temperature of all buildings(" + `${selectedSensortType === ""? "All sensor)" : "Sensor:" +selectedSensortType +")"}`: selectedCategory + " of all buildings(" + `${selectedSensortType === ""? "All sensor)": "Sensor:" +selectedSensortType +")"}` : selectedCategory + " of " + selectedBuilding + `${selectedSensortType === ""? "(All sensor)" : "(Sensor:" +selectedSensortType +")"}`} */}
                    </h3>
                  </Col>
                  {filterPanelOpen && <Col xs={isGraphFullscreen?12:24} >
                      <CustomCollapsiblePanel header={
                                                      <Row justify={'space-evenly'}> 

                                                        <Col xs={12} >
                                                          <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                              <b>Organization</b>
                                                            </Col> 
                                                            <Col xs={24} style={{textAlign:'left'}}> 
                                                              {selectedOrganizationName}
                                                            </Col>
                                                          </Row>
                                                        </Col> 
                                                        <Col xs={11}>
                                                          <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                              <b>Project</b> 
                                                            </Col>
                                                            {selectedProject==null &&  <Col xs={24} style={{textAlign:'left'}}>
                                                                No Projects
                                                            </Col>} 
                                                            {props.projectsList && selectedProject && 
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                            {selectedProject.name}
                                                            </Col>}
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    }
                                                    isOpen={openPanels.includes(1)}
                                                    onClick={() => handlePanelClick(1)}
                                                    >
                        
                        <Row justify={'space-evenly'}>
                                
                                {props.organizationList && selectedOrganization && <Col xs={12}>
                                  <Row justify={'space-around'}  align={'middle'} >
                                    <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(1)}>
                                      <b>Organization</b>
                                    </Col>
                                    <Col xs={24} style={{marginTop:'2px'}}>
                                      <Select style={{width:'100%' , textAlign:'left'}} 
                                        onSelect={handleSelectedOrganization}
                                        value={selectedOrganization.id} labelInValue
                                        getPopupContainer={node => node.parentNode}
                                        >
                                          {props.organizationList?.map((op:any,index:number)=>{
                                          return(
                                          <Option key={op.name} label={op.name} value={op.id} props style={{}}>
                                          {op.name}
                                          </Option>
                                          )
                                          })}  
                                      </Select>
                                    </Col>
                                  </Row>
                                </Col>}
                                 <Col xs={11}>
                                  <Row justify={'space-around'} align={'middle'}   >
                                    <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(1)}>
                                      <b>Project</b>
                                    </Col>
                                    {selectedProject==null && <Col xs={24} style={{marginTop:'2px',textAlign:'left'}}>No Project Assigned</Col>}
                                    {props.projectsList && selectedProject && <Col xs={24} style={{marginTop:'2px'}}>
                                      <Select style={{width:'100%' , textAlign:'left'}} 
                                        onSelect={handleSelectProjectName} 
                                        value={selectedProject.id} labelInValue
                                        getPopupContainer={node => node.parentNode}
                                        >
                                          {projectsList_Options?.map((proj:any,index:number)=>{
                                          return(
                                          <Option key={proj.name} label={proj.name} value={proj.id} props>
                                          {proj.name}
                                          </Option>
                                          )
                                          })}  
                                      </Select>
                                    </Col>}
                                  </Row>
                                </Col>
                        </Row>
                      </CustomCollapsiblePanel>
                  </Col>}
                  {filterPanelOpen && <Col xs={isGraphFullscreen?12:24} >
                  <CustomCollapsiblePanel header={
                    <Row justify={'space-evenly'}> 
                      <Col xs={12} >
                        <Row justify={'space-around'}  align={'middle'} >
                          <Col xs={24} style={{textAlign:'left'}}>
                            <b>Building</b>
                          </Col> 

                          {props.buildingNames.length==0 && <Col xs={24} style={{marginTop:'2px',textAlign:'left'}}>No Buildings</Col>}

                          {selectedProject!=null && <Col xs={24} style={{textAlign:'left'}}> 
                            {selectedBuilding}
                          </Col>}
                        </Row>
                      </Col> 
                      <Col xs={11}>
                        <Row justify={'space-around'}  align={'middle'} >
                          <Col xs={24} style={{textAlign:'left'}}>
                            <b>Apartment</b> 
                          </Col>
                          {props.apartmentNames.length==0 && <Col xs={24} style={{textAlign:'left'}}>
                            No Apartment
                          </Col>}
                          {props.apartmentNames.length>0 && <Col xs={24} style={{textAlign:'left'}}>
                          {selectedApartment==""?"All" :selectedApartment}
                          </Col> }
                        </Row>
                      </Col>
                    </Row>
                  } isOpen={openPanels.includes(2)} onClick={() => handlePanelClick(2)}>
                  <Row justify={'space-evenly'}>                    
                    <Col xs={12}>
                      <Row justify={'space-around'} align={'middle'}  >
                        <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(2)}>
                          <b>Building</b>
                        </Col>
                        <Col xs={24} style={{marginTop:'2px'}}>
                        {props.buildingNames.length>0 && selectedProject!=null &&<Select style={{width:'100%' , textAlign:'left'}} 
                                                            onSelect={handleBuildingSelect} value={selectedBuilding} 
                                                            loading={props.dataFetch_InProgress} 
                                                            getPopupContainer={node => node.parentNode}>
                            <Option key={"all"} label={"All"} value={"All"} props>
                            All
                            </Option>
                            {props.buildingNames?.map((op:any,index:number)=>{
                            return(
                            <Option key={op} label={op} value={op} props>
                            {op}
                            </Option>
                            )
                            })} 
                        </Select>}
                        {props.buildingNames.length==0 && <Col xs={24} style={{marginTop:'2px',textAlign:'left'}}>No Buildings</Col>}
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={11}>
                    <Row justify={'space-around'} align={'middle'}   >
                        <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(2)}>
                          <b>Apartment</b>
                        </Col>
                        <Col xs={24} style={{marginTop:'2px'}}>
                        {props.apartmentNames.length==0  && <Col xs={24} style={{textAlign:'left'}}>No Apartment</Col>}
                        {props.apartmentNames.length>0  && <Select style={{width:'100%' , textAlign:'left'}} 
                                                              onSelect={handleApartmentSelect} value={selectedApartment} 
                                                              loading={props.dataFetch_InProgress} 
                                                              getPopupContainer={node => node.parentNode}>
                            <Option key={"all"} label={"All"} value={""} props>
                            All
                            </Option>
                            {props.apartmentNames?.map((op:any,index:number)=>{
                            return(
                            <Option key={op} label={op} value={op} props>
                            {op}
                            </Option>
                            )
                            })} 
                        </Select>}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  </CustomCollapsiblePanel>
                  </Col>}
                  {filterPanelOpen && <Col xs={isGraphFullscreen?12:24} >
                    <CustomCollapsiblePanel header={
                                                      <Row justify={'space-evenly'}> 
                                                        <Col xs={12} >
                                                          <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                              <b>Category</b>
                                                            </Col> 
                                                            <Col xs={24} style={{textAlign:'left'}}> 
                                                              {selectedCategory}
                                                            </Col>
                                                          </Row>
                                                        </Col> 
                                                        <Col xs={11}>
                                                          <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                              <b>Sensor</b> 
                                                            </Col>
                                                            <Col xs={24} style={{textAlign:'left'}}>
                                                            {selectedSensortType==""?"All" :selectedSensortType}
                                                            </Col>
                                                          </Row>
                                                        </Col>
                                                      </Row>
                                                    }
                                                    isOpen={openPanels.includes(3)}
                                                    onClick={() => handlePanelClick(3)}
                                                    >
                    <Row justify={'space-evenly'}>  
                    <Col xs={12} >
                        <Row justify={'space-around'} align={'middle'}  >
                          <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(3)}>
                            <b> Category</b>
                          </Col>
                        <Col xs={24} style={{marginTop:'2px'}}>
                          <Select style={{width:'100%' , textAlign:'left'}} 
                            onSelect={handleCatoryOnSelect} value={selectedCategory}
                            getPopupContainer={node => node.parentNode}
                          >
                            <Option key='Temperature' label="Temperature" value="Temperature" props>Temperature</Option>
                            <Option key='Power' label="Power" value="Power" props>Power</Option>
                            <Option key='Energy' label="Energy" value="Energy" props>Energy</Option>
                            <Option key='VolumeRate' label="VolumeRate" value="VolumeRate" props>VolumeRate</Option>
                          </Select>
                        </Col>
                      </Row>
                    </Col>
                    
                    <Col xs={11} >
                        <Row justify={'space-around'} align={'middle'}  >
                          <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(3)}>
                            <b> Sensor</b>
                          </Col>
                        <Col xs={24} style={{marginTop:'2px'}}>
                          <Select style={{width:'100%' , textAlign:'left'}} 
                            onSelect={handleSensorTypeSelect} 
                            value={selectedSensortType} 
                            options={sensortType_Options}
                            getPopupContainer={node => node.parentNode}/>
                        </Col>
                      </Row>
                    </Col>
                    </Row>
                    </CustomCollapsiblePanel>
                  </Col>}
                  {filterPanelOpen && <Col xs={isGraphFullscreen?12:24}>
                    <CustomCollapsiblePanel header={
                                                      <Row justify={'space-evenly'}> 
                                                        <Col xs={12} >
                                                          <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(4)}>
                                                              <b>Time Span</b>
                                                            </Col> 
                                                            <Col xs={24} style={{textAlign:'left'}}> 
                                                              {timeSpanLabel}
                                                              {startTime!="" &&  <span style={{marginLeft:'3px'}}>{DateComponent(startTime)} - {DateComponent(endTime)}</span>}
                                                            </Col>
                                                          </Row>
                                                        </Col> 
                                                        <Col xs={11} >
                                                        <Row justify={'space-around'}  align={'middle'} >
                                                            <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(4)}>
                                                              <b>Send command to 3D</b>
                                                            </Col> 
                                                            <Col xs={24} style={{textAlign:'left'}}> 
                                                              {/* <a ref={buttonRef} style={{color:'#1677ff'}} onClick={btnSendcommand}>Sync to 3D</a> */}
                                                              <Button ref={buttonRef} size='small' type="primary" style={{backgroundColor:'#1677ff'}} onClick={btnSendcommand}>Sync to 3D</Button>
                                                            </Col>
                                                          </Row>
                                                        </Col>
                                                         
                                                      </Row>
                                                    }
                                                    isOpen={openPanels.includes(4)}
                                                    onClick={() => handlePanelClick(4)}
                                                    >
                    <Row justify={'space-evenly'}>  

                    <Col xs={12} >
                        <Row justify={'space-around'} align={'middle'}  >
                          <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(4)}>
                            <b> Time Span</b>
                          </Col>
                        <Col xs={24} style={{marginTop:'2px'}}>
                          <Select style={{width:'100%' , textAlign:'left'}} 
                            onChange={handleTimeSpanSelect} value={timeSpan}
                            open={isDropdownOpen}
                            onDropdownVisibleChange={open => toggledropdown(open)}
                            getPopupContainer={node => node.parentNode}
                            dropdownRender={(menu)=>(
                              <>
                              <Row>
                                <Col xs={rangePicker?12:24}>{menu}</Col>
                                {rangePicker && <Col xs={12}>
                                  <Row>
                                    <Col xs={24}>Select Custom Time</Col>
                                    <Col xs={24} id="datepicker-container">
                                      <RangePicker style={{zIndex:'100'}}  size='small' onOk={handleCustomTime} value={dateRange} onChange={changeRangePicker} showTime /> 
                                    </Col>
                                    {/* <Col xs={24}>End Date</Col> */}
                                    {/* <Col xs={24}><DatePicker onChange={()=>{setIsDropdownOpen(true)}} showTime /> </Col> */}
                                  </Row>
                                </Col>}
                              </Row>
                              </>
                            )}
                            >
                            <Option key='30m' label="30m" value="30m" props>Last 30 minutes</Option>
                            <Option key='1h' label="1h" value="1h" props>Last 1 hour</Option>
                            <Option key='6h' label="6h" value="6h" props>Last 6 hours</Option>
                            <Option key='24h' label="24h" value="24h" props>Last 24 hours</Option>
                            <Option key='7d' label="7d" value="7d" props>Last week</Option>
                            <Option key='14d' label="14d" value="14d" props>Last 2 weeks</Option>
                            <Option key='30d' label="30d" value="30d" props>Last month</Option>
                            <Option key='custom' label="custom" value="custom" props>
                              Custom
                              {startTime!="" &&  <span style={{marginLeft:'3px'}}>{DateComponent(startTime)} - {DateComponent(endTime)}</span>}
                            </Option>
                          </Select>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={11}>
                      <Row justify={'space-around'} align={'middle'}  >
                      <Col xs={24} style={{textAlign:'left'}} onClick={() => handlePanelClick(4)}>
                            <b> Send command to 3D</b>
                      </Col>
                      <Col xs={24} style={{marginTop:'2px',textAlign:'left'}}>
                        <Button ref={buttonRef} size='small' type="primary" style={{backgroundColor:'#1677ff'}} onClick={btnSendcommand}>Sync to 3D</Button>
                      </Col>
                      </Row>
                    </Col> 
                    </Row>
                    </CustomCollapsiblePanel>
                  </Col>}

                    <Col xs={24} style={{marginTop:'2vh'}}>
                    {props.dataFetch_InProgress && <div style={{height:'57vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <LoadingOutlined style={{fontSize:30,color:'#001529'}}/>
                        </div>}
                    {props.dataFetch_success && props.data.length==0 &&
                      <div style={{height:'57vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Empty 
                      // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
                      imageStyle={{ height: 70 }}
                      style={{fontSize:'17px'}}
                      description={
                        <div>
                          There is no data for the selected parameters
                          <br/>
                        </div>
                      }
                      />
                      </div>
                      }
                    {props.data.length>0 &&
                    <HighchartsReact 
                      containerProps={{ style: { height: filterPanelOpen?"57vh":"80vh" } }}  
                      ref={chartRef}
                      className="highchart"
                      highcharts={Highcharts} 
                      options={options} />
                    }

                    </Col>  
                </Row>}

            </Col>
            <Col xs={24} lg={24} style={{height:'100%',position:'relative'}} id='overlay' ref={streamingDivRef}>
              <div className='popup-fullscreen-button-div' onClick={toggleStreamingFullscreen}>
                    <Tooltip title={isGraphFullscreen?"Exit Full Screen":"Enter Full Screen"} placement="left">
                      <FullscreenOutlined  style={{fontSize:'24px',color:'white'}}/>
                    </Tooltip>
              </div>

            {projectService==null && <Col xs={24} style={{height:'100%',borderLeft:'1px solid lightgray',display:'flex',alignItems:'center', justifyContent:'center'}}>
              <Empty 
              // image={<><FolderOpenOutlined style={{fontSize:70,color:'#1677ff'}}/></>}
              imageStyle={{ height: 70 }}
              style={{fontSize:'20px'}}
              description={
                <div>
                  No Streaming URL
                  <br/>
                  Please assign service to project first
                  <br/>
                </div>
              }
              />
            </Col>}

   
            {projectService!=null && projectService.url && !loadIframe && 
            <div style={{position:'relative',height:'100%'}}>
            <div className='streaming-background'></div>
            <div className='start-streaming-div'>
              <PlayCircleOutlined style={{color: "#6ac468",fontSize:'80px'}} onClick={handleLoadIframe}/>
              <h2>Start Streaming</h2>
            </div>
            </div>}
            {projectService!=null && projectService.url &&  loadIframe && <iframe ref={iframeRef} scrolling="no" className="dashboard-iframe" onLoad={handleIframeLoad}  src={projectService.url.concat(getToken())}  ></iframe>}
            </Col>
          </MySplitPane>
        </Row>
        {contextHolder}
    </div>
    
    )
    
}

const mapStateToProps = (state: RootState) => {
    return {
        data:state.DashboardReducer.data,
        dataFetch_success:state.DashboardReducer.dataFetch_success,
        organizationList:state.ProjectReducer.organizationList,
        fetchError:state.ProjectReducer.fetchError,
        servicesList:state.ProjectReducer.servicesList,
        projectsList:state.ProjectReducer.projectsList,
        buildingNames:state.DashboardReducer.buildingNames,
        dataFetch_InProgress:state.DashboardReducer.dataFetch_InProgress,
        apartmentNames:state.DashboardReducer.apartmentNames,
        organizationNamesFetch_Success:state.ProjectReducer.organizationNamesFetch_Success,
        projectFetchSuccess:state.ProjectReducer.projectFetchSuccess
    };
  };



function configureStreamAndSendMessage(organization:any, project:any, buildingName:any,selectedApartment:any,selectedCategory:any,selectedSensortType:any,timeSpan:any,seriesNamesId:any) {
  const descriptor = {
    Type: "TwinData",
    Organization: organization,
    Project: project,
    Building: buildingName,
    Apartment: selectedApartment == "" ? "All" : selectedApartment ,
    Category: selectedCategory,
    Sensor: selectedSensortType == "" ? "All" : selectedSensortType ,
    TimeSpan: timeSpan,
    dtId: seriesNamesId
  };
  console.log("descriptor, send to unreal", descriptor)
  const obj = {
    cmd: "sendToUe4",
    value: descriptor
  };
  sendToMainPage(obj);
}

function sendToMainPage(obj: any) {
  const origin = '*';
  const iframeElements = document.getElementsByClassName('dashboard-iframe');
  for (let i = 0; i < iframeElements.length; i++) {
    const myIframe = iframeElements[i] as HTMLIFrameElement;
    myIframe.contentWindow?.postMessage(JSON.stringify(obj), origin);
  }
}

function getUnits(category:any)
{
    if (category == "Temperature")
    {
      return "Celsius";
    }
    else if (category == "Power")
    {
      return "W";
    }
    else if (category == "Energy")
    {
      return "kWh";
    }
    else if (category == "VolumeRate")
    {
      return "m3/h";
    }
    else
    {
      return "";
    }
}
 function getHeadingText(buildingName:any,apartment:any,category:any,sensorType:any)
 {
  if(buildingName.toLowerCase() === "Sosdala_TeckBuilding")
  {
    return category + " of " + buildingName + " " + (sensorType === "" ? "(All sensor)" : "(Sensor:" + sensorType + ")");
  }
  else if (buildingName.toLowerCase() === "all" && apartment.toLowerCase() === "all") {    
      return  category + " of all buildings (" + (sensorType === "" ? "All sensor)" : "Sensor:" + sensorType + ")");
  }
  else if (buildingName.toLowerCase() !== "all" && apartment.toLowerCase() === "all") {    
    return  category + " of "+ buildingName +" (" + (sensorType === "" ? "All sensor)" : "Sensor:" + sensorType + ")");
  }
  else {
    return category + " of " + apartment + " " +(sensorType === "" ? "(All sensor)" : "(Sensor:" + sensorType + ")");
  }
 }






  
export default connect(mapStateToProps)(Dashboard)
