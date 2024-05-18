import axios from "axios";
import React from 'react';
import { store } from '../index';
import { connect } from 'react-redux';

export const fetchingOrganizationNames_UserManagement=async(accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'fetchingOrganizationNames_Details_InProgress'})
    try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            store.dispatch({type:'fetchingOrganizationNames_Details_Success',
            organizationNames:dt,
          })
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 ){
            logout()
            store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:"Access Denied"})
          }

        }
      } 
      catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:err.message})
      }
  
}
const fetchingOrganizationAdmins_UserManagement=async(orgId:string,accessToken:string,logout:()=>void)=>{

      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/${orgId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            return dt.organizationAdmins
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
                logout()
        }
      } 
      catch(err:any) {
        console.log(err.message)
      };
    
  }
export const fetchingUsers_UserManagement=async(orgId:string,accessToken:string,logout:()=>void)=>{

    store.dispatch({type:'fetchingUserManagementDetails_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/GetByOrganizationId/${orgId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            const organizationAdmins=await fetchingOrganizationAdmins_UserManagement(orgId,accessToken,logout)
            // Use flatMap to concatenate all projectUsers arrays into a single array
            const allProjectUsers = dt.flatMap((project:any) => project.projectUsers);
            const mergedUsers = [...organizationAdmins, ...allProjectUsers];
            store.dispatch({type:'fetchingUserManagementDetails_Success',
                projectNames:dt,
                userNames:mergedUsers
            })
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 ){
                logout()
                store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:"Access Denied"})
            }   
        }
      } 
      catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:err.message})
      };
    
  }
  

  export const fetchingBy_ProjectId_UserManagement=async(projId:string,accessToken:string,logout:()=>void)=>{

    store.dispatch({type:'fetchingUserManagementDetails_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/${projId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            store.dispatch({type:'fetchingUserManagementDetails_Success',
                projectNames:dt,
                userNames:dt.projectUsers
            })
        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 ){
                logout()
                store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:"Access Denied"})
            }   
        }
      } 
      catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'fetchingOrganizationInUserManagement_Fail',payload:err.message})
      };
    
  }
   

  export const deleteUser=async(data:any,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'deletingUser_InProgress'})
      const dt=[{
        "userId": data.id,
        "userEmail": data.userEmail,
        "organizationName": data.organizationName,
        "projectName":data.projectName,
        "roleName": data.roleName
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
            store.dispatch({type:'deletingUser_Success',
            payload:data.id
          })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'deletingUser_Fail',payload:err.message})
      };
    

    
  }

export const deleteOrganizationAdmin_UserManagement=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'deletingUser_InProgress'})
    const dt=[{
      "userId": data.id,
      "userEmail": data.userEmail,
      "organizationName": data.organizationName,
      "roleName": data.roleName
    }]
    const raw=JSON.stringify(dt)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/RemoveAdmins`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        body:raw,
      });
  
      if (response.ok) {
          store.dispatch({type:'deletingUser_Success',
          payload:data.id
        })
      } else {

        if(response.status==401 )
          logout()
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'deletingUser_Fail',payload:err.message})

    };
  
}

  const addUserInMongoDB=async(data:any,userRole:string,projectName:string,orgName:string,accessToken:string,logout:()=>void)=>{
      const dt={
        "userId": data.id,
        "userEmail": data.email,
        "organizationName": orgName,
        "projectName":projectName,
        "roleName": userRole
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
            store.dispatch({type:'addUser_Duplicacy',payload:false,newEmail:data.email})
            store.dispatch({type:'addUser_Success',
            payload:res
          })
        } else {
          if(response.status==409) //conflict
          store.dispatch({type:'addUser_Duplicacy',payload:true,newEmail:data.email})

          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'addUser_Fail',payload:err.message})
      };


  }
  
  const addOrganizationAdminInMongoDB=async(data:any,orgName:string,accessToken:string,logout:()=>void)=>{

      const dt={
        "userId": data.id,
        "userEmail": data.email,
        "organizationName": orgName,
        "roleName": "OrganizationAdmin"
      }
    
      const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/AddAdmins`, {
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
            store.dispatch({type:'addUser_Duplicacy',payload:false,newEmail:data.email})
            store.dispatch({type:'addUser_Success',
            payload:res
          })
        } else {
          if(response.status==409) //conflict
            store.dispatch({type:'addUser_Duplicacy',payload:true,newEmail:data.email})
    
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'addUser_Fail',payload:err.message})
      };

      
  }
  
  
  
  export const setUserDuplicacyToNull=()=>{
    store.dispatch({type:'addUser_Duplicacy',payload:null})
  }
  
  export const addUser=async(data:any,projectName:string,orgName:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'addUser_InProgress'})
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
        if(data.userRole=="OrganizationAdmin"){
            addOrganizationAdminInMongoDB(dt,orgName,accessToken,logout)
          }
          else{
            addUserInMongoDB(dt,data.userRole,projectName,orgName,accessToken,logout)
          }
      } else {
        console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
          logout()
        store.dispatch({type:'addUser_Fail',payload:"USER DOES NOT EXIST"})
      }
    } catch (error:any) {
      console.error('Error calling API:', error);
      store.dispatch({type:'addUser_Fail',payload:error.message})
    }
  }


  const moveUser=async(data:any,newUserRole:string,projectName:string,organizationName:string,accessToken:string,logout:()=>void)=>{

      if(data.roleName=="OrganizationAdmin" && newUserRole=="OrganizationAdmin"){
            await deleteOrganizationAdmin_UserManagement(data,accessToken,logout).then(async ()=>{
                const obj={
                    id:data.id,
                    email:data.userEmail
                }
                await addOrganizationAdminInMongoDB(obj,organizationName,accessToken,logout)
            })
          }
          else if(data.roleName=="OrganizationAdmin" && newUserRole!="OrganizationAdmin"){
            await deleteOrganizationAdmin_UserManagement(data,accessToken,logout).then(async ()=>{
              const obj={
                  id:data.id,
                  email:data.userEmail
              }
              await addUserInMongoDB(obj,newUserRole,projectName,organizationName,accessToken,logout)
            })
          }
          else if( newUserRole=="OrganizationAdmin" && data.roleName!="OrganizationAdmin" ){
            const obj={
              id:data.id,
              email:data.userEmail
          }
          await deleteUser(data,accessToken,logout).then(async ()=>{
            await addOrganizationAdminInMongoDB(obj,organizationName,accessToken,logout)
          })
          }
          else{
            const obj={
                id:data.id,
                email:data.userEmail
            }
            await deleteUser(data,accessToken,logout).then(async ()=>{
                await addUserInMongoDB(obj,newUserRole,projectName,organizationName,accessToken,logout)
            })
          }
    }
  
  export const changeUserRole=async(data:any,newUserRole:string,projectId:string,organizationId:string,projectName:string,organizationName:string,accessToken:string,logout:()=>void)=>{
  
    store.dispatch({type:'changeUserRole_InProgress'})
    try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${data.userEmail}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,         
        },
        });
        if (response.ok) {
            const dt = await response.json();
            // Filter out the current assignment from dt if present
            let filteredDt=[]
            if(data.roleName=="OrganizationAdmin")
                filteredDt = dt.filter((item:any) => item.organizationName !== data.organizationName );
            else
                filteredDt = dt.filter((item:any) => item.organizationName !== data.organizationName || item.projectName !== data.projectName);
            if(newUserRole=="OrganizationAdmin"){
                const userInOrganization = filteredDt.some((item:any) => item.organizationId === organizationId);
                if(userInOrganization)
                    store.dispatch({type:'addUser_Duplicacy',payload:true,newEmail:data.userEmail})
                else{
                    store.dispatch({type:'addUser_Duplicacy',payload:false,newEmail:data.userEmail})
                    moveUser(data,newUserRole,projectId,organizationName,accessToken,logout)
                }
            }   
            else{
                const userInNewProjectOrOrg = filteredDt.some((item:any) => item.projectId === projectId && item.organizationId === organizationId);
                if(userInNewProjectOrOrg)
                    store.dispatch({type:'addUser_Duplicacy',payload:true,newEmail:data.userEmail})
                else{
                    store.dispatch({type:'addUser_Duplicacy',payload:false,newEmail:data.userEmail})
                    moveUser(data,newUserRole,projectName,organizationName,accessToken,logout)
                }
            }
            
            // store.dispatch({type:'addUser_Duplicacy',payload:duplicacy.data,newEmail:data.email})

        } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
            logout()
        }
    } 
    catch(err:any) {
        console.log(err.message)
        store.dispatch({type:'addUser_Fail',payload:err.message})
    };

  }