import { store } from '..';
import axios from "axios";

export const fetchAllServiceDetails=async(accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchServiceDetails_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
    
        if (response.ok) {
            const dt = await response.json();
            dt.sort()

            store.dispatch({type:'fetchServiceDetails_Success',
            serviceList:dt,
          })
  
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          
        }
      } 
      catch(err:any) {
        store.dispatch({type:'fetchServiceDetails_Fail',payload:err.message})
      };


    
  }


export const createService=async(data:any,accessToken:string,logout:()=>void)=>{

    store.dispatch({type:'serviceSaveInProgress',
        description:data.description,
        name:data.name,
        url:data.url,
        status:data.status
    })
    const dt={
      "name":data.name,
      "description":data.description,
      "url":data.url,
      "parameterJsonData":""
    }

    const raw=JSON.stringify(dt)

    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        redirect:"follow",
        body:raw,
      });
      if (response.ok) {
          const dt = await response.json();
          store.dispatch({type:'serviceDetailsSaveSuccess',payload:dt.id})
          store.dispatch({ type: 'createService_Duplicacy', payload: false });

      } else {
        if(response.status==409)
            store.dispatch({type:'serviceDetailsSaveFailure',error:"Unable to detect service name duplicacy"})
            store.dispatch({ type: 'createService_Duplicacy', payload: true });

        if(response.status==401 )
          logout()

      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'serviceDetailsSaveFailure',error:err.message})
    };


  }


export const saveServiceParameters=async(serviceObj:any,data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'serviceParamtersInProgress',
                  parameters:data.parameters
                })
    const dt={
      "parameterJsonData":JSON.stringify(data.parameters),
      "id":data.serviceId,
      "name":serviceObj.name,
      "description":serviceObj.description,
      "url":serviceObj.url
    }
    const raw=JSON.stringify(dt)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService/UpdateService`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        redirect:"follow",
        body:raw,
      });
      if (response.ok) {
          store.dispatch({type:'serviceDetailsSaveSuccess',payload:data.serviceId})
      } else {
        if(response.status==401 )
          logout()
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'serviceDetailsSaveFailure',error:err.message})
    };
}


export const deleteService=async(serviceId:any,accessToken:string,logout:()=>void)=>{

  store.dispatch({type:'deleteService_InProgress'})
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        redirect:"follow",
      });
      if (response.ok) {
          store.dispatch({type:'deleteService_Success',
          payload:serviceId 
        })
      } else {
        if(response.status==401 )
          logout()
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'deleteService_Fail',payload:err.message})

    };
}


export const updateServiceInfo=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'updatingServiceDetails_InProgress'})
    const inp={
      "name":data.name,
      "description":data.description,
      "url":data.url,
      "id":data.id
    }
    const raw=JSON.stringify(inp)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService/UpdateService`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        redirect:"follow",
        body:raw,
      });
      if (response.ok) {
          store.dispatch({type:'updatingServiceDetails_Success',serviceObj:data})
      } else {
        if(response.status==401 )
          logout()

      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'updatingServiceDetails_Fail',error:err.message})
    };
  
}


export const updateServiceDetails=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'serviceSaveInProgress',
                  id:data.serviceId,
                  description:data.description,
                  name:data.name,
                  url:data.url,
                  status:data.status
                })
    const inp={
      "name":data.name,
      "description":data.description,
      "url":data.url,
      "id":data.serviceId
    }
    const raw=JSON.stringify(inp)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVService/UpdateService`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        redirect:"follow",
        body:raw,
      });
      if (response.ok) {
          store.dispatch({type:'serviceDetailsSaveSuccess',payload:data.serviceId})
          store.dispatch({ type: 'createService_Duplicacy', payload: false });
      } else {
        if(response.status==401 )
          logout()

      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'serviceDetailsSaveFailure',error:err.message})
    };
  


  
}
  
export const setServiceNameDuplicacyToNull=()=>{
  store.dispatch({ type: 'createService_Duplicacy', payload: null });  // set to default
}
