import axios from "axios";
import React from 'react';
import { store } from '../index';
export const fetchAllOrganizationNames=async(accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchingOrganizationNames_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            dt.sort()
            store.dispatch({type:'fetchingOrganizationNames_Success',
            organizationList:dt
          })
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
      };
    
  }


export const fetchAllProjectDetails=async(orgId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchingProjectDetails_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/GetByOrganizationId/${orgId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            store.dispatch({type:'fetchingProjectDetails_Success',
            projectsList:dt,
            organizationObj:null //Its use is in general user to get organization details for organziation Admin
          })
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
      };
  }


export const setProjectDetailsSucessToFalse=()=>{
store.dispatch({type:'setProjectDetailsSucessToFalse'})
}

export const updatingProjectDetailsAPI=async(data:any,orgId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'updateProjectDetails_InProgress'})

    const dt={
        "organizationId":orgId,
        "id":data.id,
        "name":data.name,
        "description":data.description,
        "isProjectActive":data.isProjectActive,
      }
      const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/UpdateProject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
          body:raw,
        });
        if (response.ok) {
            store.dispatch({type:'updateProjectDetails_Success',
            projectObj:data,
            })
  
        } else {
  
          if(response.status==401 )
            logout()
  
          // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        store.dispatch({type:'updateProjectDetails_Fail',payload:err.message})
      };


}

export const deleteProject=async(id:string,orgId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'deleteProject_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/DeleteProject/${id}/${orgId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          }
        }); 
    
        if (response.ok) {
            store.dispatch({type:'deleteProject_Success',
            payload:id //data is the organization Id
          })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'deleteProject_Fail',payload:err.message})

      };


    
  }



export const fetchUnassignedOrganizationServicesList=async(assignedServices:any,orgId:string,accessToken:string,logout:()=>void)=>{
store.dispatch({type:'fetchingUnassignedServices'})
    try {      
    const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/${orgId}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,         
        },
    });

    if (response.ok) {
        const dt = await response.json();  
        const unassignedServices =dt.services.filter((dtObj:any)=>{
            return !assignedServices.some((ob: any) => ob.name === dtObj.name)
        })
        store.dispatch({type:'UnassignedServicesFetchSuccess',
        payload:unassignedServices
        })

    } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
        logout()
        
    }
    } 
    catch(err:any) {
    console.log(err)
    store.dispatch({type:'UnassignedServicesFetch_Fail',payload:err.message})

    };


}

export const assignNewServiceInProject=async(data:any,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'assignServiceSave_InProgress'})

    const dt={
        "organizationId":data.organizationId,
        "serviceId":data.selectedServiceObj.id,
        "projectId":data.projectId,
        "jsonParameter":JSON.stringify(data.jsonObject),
    }

    const resp={
    "id":data.selectedServiceObj.id,
    "url":data.selectedServiceObj.url,
    "name":data.selectedServiceObj.name,
    "description":data.selectedServiceObj.description,
    "parameterJsonData":data.jsonObject,
    "createdOn":data.formattedDateTime
    }
    const raw=JSON.stringify(dt)
    try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/AddServices`, {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
            },
            body:raw,
        });
        if (response.ok) {
            store.dispatch({type:'assignServiceSave_Success',
            payload:resp
            })
        } else {
    
            if(response.status==401 )
            logout()
        }
    } 
    catch(err:any) {
        console.log(err)
        store.dispatch({type:'assignServiceSave_Fail',payload:err.message})
    };    

}


export const deleteAssignedService=async(data:any,projId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'assignServiceDelete_InProgress'})
    const dt={
      "projectId":projId,
      "serviceId": data.id,
    }
    const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/RemoveService`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
        body:raw,
        });
    
        if (response.ok) {
          store.dispatch({type:'assignServiceDelete_Success',
        })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'assignServiceDelete_Fail',payload:err.message})
  
      };

    
}


export const updatingProjectServiceParameterDetailsAPI=async(data:any,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'updatingProjectServiceDetails'})
      const dt={
        "serviceId": data.document.id,
        "projectId": data.projectId,
        "jsonParameter":JSON.stringify(data.parameters)
      }
      const res={
        "id": data.document.id,
        "parameterJsonData":data.parameters,
        "createdOn":data.formattedDateTime,
        "name":data.document.name,
        "description":data.document.description
      }
      const raw=JSON.stringify(dt)
        try {      
          const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/UpdateServices`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${accessToken}`,    
              "Accept":"application/json",
              "Content-Type":"application/json"     
            },
          body:raw,
          });
      
          if (response.ok) {
            store.dispatch({type:'updateProjectServiceDetailsSuccess',
            servicesObj:res,
          })
          } else {
    
            if(response.status==401 )
              logout()
          }
        } 
        catch(err:any) {
          console.log(err)
          store.dispatch({type:'updateProjectServiceDetailsFail',payload:err.message})

  
    
        };



  }


  const addProjectAdmins_InDatabase=async(data:any,projectName:any,orgName:any,accessToken:string,logout:()=>void)=>{
   store.dispatch({type:'addProjectAdmin_InProgress'})
     const dt={
        "userId": data.id,
        "userEmail": data.email,
        "organizationName": orgName,
        "projectName":projectName,
        "roleName": "ProjectAdmin"
      }
    
      const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/AddUsers`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
          body:raw,
        });
        if (response.ok) {
            const res = await response.json();
            store.dispatch({type:'addProjectAdmin_Duplicacy',payload:false,newEmail:data.email})
            store.dispatch({type:'addProjectAdmin_Success',
            payload:res
          })
        } else {
          if(response.status==409) //conflict
          store.dispatch({type:'addProjectAdmin_Duplicacy',payload:true,newEmail:data.email})

          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'addProjectAdmin_Fail',payload:err.message})
      };
 }
  export const addProjectAdmin=async(data:any,projectName:string,orgName:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'addOrganizationAdmin_InProgress'})
    const body={
      "firstName":data.firstName,
      "lastName":data.lastName,
      "email":data.userEmail
    }
    try {
      const response = await fetch('https://bimvistaapi.azurewebsites.net/api/AD/AddUserInPortal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'          
        },
        body:JSON.stringify(body)
      });
  
      if (response.ok) {
        const dt = await response.json();
        addProjectAdmins_InDatabase(dt,projectName,orgName,accessToken,logout)
      } else {
        console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
         logout()
        store.dispatch({type:'addOrganizationAdmin_Fail',payload:"USER DOES NOT EXIST"})
      }
    } catch (error:any) {
      console.error('Error calling API:', error);
      store.dispatch({type:'addOrganizationAdmin_Fail',payload:error.message})
    }
  
  
    
  }
 
  export const deleteProjectAdmin=async(data:any,orgName:string,projectName:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'deleteProjectAdmin_InProgress'})    
      const dt=[{
        "userId": data.id,
        "userEmail": data.userEmail,
        "organizationName": orgName,
        "projectName":projectName,
        "roleName": "ProjectAdmin"
      }]
  
      const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/RemoveUsers`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
          body:raw,
        });
    
        if (response.ok) {
            store.dispatch({type:'deleteProjectAdmin_Success',
            payload:data.id
          })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'deleteProjectAdmin_Fail',payload:err.message})
      };
    

  }

  export const setProjectAdminDuplicacyToNull=()=>{
    store.dispatch({type:'addProjectAdmin_Duplicacy',payload:null})
  }




  /////////////////////////////////////////////////CREATE PROJECT ACTIONS///////////////////////

export const createProject=async(data:any,accessToken:string,logout:()=>void)=>{
 
      store.dispatch({type:'createProject_InProgress'})

      const dt={
        "organizationId":data.organizationId,
        "name":data.name,
        "description":data.description,
        "isProjectActive":true,
        "services":[],
        "projectUsers":[]
      }
      const raw=JSON.stringify(dt)
  
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/AddProject`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
          body:raw,
        });
    
        if (response.ok) {
            const res = await response.json();
            store.dispatch({type:'createProject_Duplicacy',payload:false})
            store.dispatch({type:'createProject_Success',
              payload:res
            })
  
        } else {
  
          if(response.status==409)
            store.dispatch({type:'createProject_Duplicacy',payload:true})
  
          if(response.status==401 )
            logout()
  
          // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'createProject_Fail',payload:"Unable to detect project name duplicacy"})
      };




  }
  export const updatingProjectDetailsAPI_createProjectSteps=async(data:any,projectId:any,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'createProject_InProgress'})

    const dt={
        "organizationId":data.organizationId,
        "id":data.projectId,
        "name":data.name,
        "description":data.description,
        "isProjectActive":true,
      }
      const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/UpdateProject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
          body:raw,
        });
        if (response.ok) {
          store.dispatch({type:'createProject_Duplicacy',payload:false})
          store.dispatch({type:'createProject_Success',
            payload:dt
          })
  
        } else {
          if(response.status==409)
            store.dispatch({type:'createProject_Duplicacy',payload:true})
  
          if(response.status==401 )
            logout()
  
          // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        store.dispatch({type:'createProject_Fail',payload:"Unable to detect project name duplicacy"})
      };


}

  export const setProjectNameDuplicacyToNull=()=>{
    store.dispatch({type:'setProjectNameDuplicacyToNull'})
  
  }
  