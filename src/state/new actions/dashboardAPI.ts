import axios from "axios";
import React from 'react';
import { store } from '../index';

export const fetchDasboardSensorData=async(accessToken:string,organizationId:any,projectName:any,buildingName:any,apartment:any,category:any,sensorType:any,timeSpan:any,startDate:any,endDate:any,logout:any)=>{
    store.dispatch({type:'FetchingDashboardData_InProgress'})
    // axios.post("/api/addInDatabase").then((a)=>{}).catch((e:any)=>{})
    // const sessionValue:any=sessionStorage.getItem(sessionKey)
    // const jsonObj=JSON.parse(sessionValue)
    // const accessToken=jsonObj.secret
    let body={}
    if(buildingName == "" && apartment == "")
    {
      if(startDate=="" && endDate==""){
        body={
          "organizationId":organizationId,
          "projectName": projectName,
          "category":category,
          "SensorType":sensorType,
          "time": timeSpan,
        }
      }
      else{
        body={
          "organizationId":organizationId,
          "projectName": projectName,
          "category":category,
          "SensorType":sensorType,
          "time": "",
          "startDate":startDate,
          "endDate":endDate
        }
      }
      try {
      const response = await fetch( '${process.env.REACT_APP_DATABASE_API}/api/ADXFn/GetAllBuildingData', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'          
        },
        body:JSON.stringify(body)
      });
  
      if (response.ok) {
        const dt = await response.json();
      store.dispatch({type:'FetchingDashboardData_Success',payload:dt})

      } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
          logout()
        store.dispatch({type:'FetchingDashboardData_Fail',payload:"USER DOES NOT EXIST"})
      }
      } catch (error:any) {
        console.error('Error calling API:', error);
        store.dispatch({type:'FetchingDashboardData_Fail',payload:error.message})
      }
    }
    else
    {
      if(startDate=="" && endDate==""){
        body={
          "organizationId":organizationId,
          "projectName": projectName,
          "building": buildingName,
          "apartment":apartment,
          "category":category, 
          "sensorType":sensorType,
          "time": timeSpan,
        }
      }
      else{
        body={
          "organizationId":organizationId,
          "projectName":projectName,
          "building": buildingName,
          "apartment":apartment,
          "category":category, 
          "sensorType":sensorType,
          "time": "",
          "startDate":startDate,
          "endDate":endDate
        }
      }
      try {
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/ADXFn/GetDataWithAggregationGeneric`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'          
        },
        body:JSON.stringify(body)
      });
  
      if (response.ok) {
        const dt = await response.json();
      store.dispatch({type:'FetchingDashboardData_Success',payload:dt})

      } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
          logout()
        store.dispatch({type:'FetchingDashboardData_Fail',payload:"USER DOES NOT EXIST"})
      }
      } catch (error:any) {
        console.error('Error calling API:', error);
        store.dispatch({type:'FetchingDashboardData_Fail',payload:error.message})
      }
    }
  }
  
  export const fetchBuildingNames=async(accessToken:string,organizationId:any,projectName:string,logout:any)=>{
    store.dispatch({type:'FetchingDashboardData_InProgress'})
    // const sessionValue:any=sessionStorage.getItem(sessionKey)
    // const jsonObj=JSON.parse(sessionValue)
    // const accessToken=jsonObj.secret
    console.log(accessToken)
    if(projectName==null || projectName==undefined)
      {
      store.dispatch({type:'FetchingBuildingNames_Success',payload:[]})
      return
      }
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/ADXFn/GetBuildingsName/${projectName}/${organizationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,         
        },
      });
  
      if (response.ok) {
        const dt = await response.json();
      dt.sort()
      store.dispatch({type:'FetchingBuildingNames_Success',payload:dt})

      } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
          logout()
        store.dispatch({type:'FetchingDashboardData_Fail',payload:"USER DOES NOT EXIST"})
        
      }
    } catch (error:any) {
      console.error('Error calling API:', error);
      store.dispatch({type:'FetchingDashboardData_Fail',payload:error.message})
    }
  }


  export const fetchApartmentNames=async(accessToken:string,organizationId:any,buildingName:string,projectName:string, logout:any)=>{
    store.dispatch({type:'FetchingApartmentNames_InProgress'})
    // const sessionValue:any=sessionStorage.getItem(sessionKey)
    // const jsonObj=JSON.parse(sessionValue)
    // const accessToken=jsonObj.secret
    if(buildingName.toLowerCase() == "all")
    {
      try {
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/ADXFn/GetAllApartments/${projectName}/${organizationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
    
        if (response.ok) {
          const dt = await response.json();
          // Sorting the dt array
        dt.sort();
        store.dispatch({type:'FetchingApartmentNames_Success',payload:dt})

        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          store.dispatch({type:'FetchingApartmentNames_Fail',payload:"USER DOES NOT EXIST"})
        }
      } catch (error:any) {
        console.error('Error calling API:', error);
        store.dispatch({type:'FetchingApartmentNames_Fail',payload:error.message})
      }
    }
    else{
      try {
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/ADXFn/GetBuildingsName/${buildingName}/${organizationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
    
        if (response.ok) {
          const dt = await response.json();
        // Sorting the dt array
        dt.sort();
        store.dispatch({type:'FetchingApartmentNames_Success',payload:dt})

        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          store.dispatch({type:'FetchingApartmentNames_Fail',payload:"USER DOES NOT EXIST"})
        }
      } catch (error:any) {
        console.error('Error calling API:', error);
        store.dispatch({type:'FetchingApartmentNames_Fail',payload:error.message})
      }
    }
  }