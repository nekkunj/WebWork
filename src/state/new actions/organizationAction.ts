import axios from "axios";
import React from 'react';
import { store } from '../index';
import { connect } from 'react-redux';

export const fetchOrganizationDetails=async(accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchingOrganizationDetails'})
      
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
            store.dispatch({type:'organizationDetailsSuccess',
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
        alert(err.message)
        store.dispatch({type:'organizationDetailsFetchFail',payload:err.message})
      };
}

export const fetchOrganization_Admin_AssignedService_Details=async(orgId:string,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'fetchOrganization_Admin_AssignedService_Details_InProgress',})
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/${orgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,         
        },
      });
  
      if (response.ok) {
          const dt = await response.json();
          store.dispatch({type:'fetchOrganization_Admin_AssignedService_Details_Success',
                          servicesList:dt.services,
                          usersList:dt.organizationAdmins
                      })

      } else {
        // console.error('Failed to call API:', response.statusText);
        if(response.status==401 )
          logout()
        store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
        
      }
    } 
    catch(err:any) {
      alert(err.message)
      store.dispatch({type:'organizationDetailsFetchFail',payload:err.message})
    };
}

export const createOrganization=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'createOrganization_InProgress'})
    const dt={
      "name":data.name,
      "description":data.description,
      "isOrganizationActive":true,
      "services":[],
      "projects":[],
      "organizationAdmins":[]
    }

    const raw=JSON.stringify(dt)

    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/AddOrganization`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        body:raw,
      });
  
      if (response.ok) {
          const dt = await response.json();
          store.dispatch({type:'createOrganization_Duplicacy',payload:false})
          store.dispatch({type:'createOrganization_Success',
            payload:dt
          })

      } else {

        if(response.status==409)
          store.dispatch({type:'createOrganization_Duplicacy',payload:true})

        if(response.status==401 )
          logout()

        // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
        
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'createOrganization_Fail',payload:err.message})
    };

}
export const updatingOrganization_CreateOrganization=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'createOrganization_InProgress'})
    const dt={
      "id":data.id,
      "name":data.name,
      "description":data.description,
      "isOrganizationActive":data.status,
    }

    const raw=JSON.stringify(dt)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/UpdateOrganization`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        body:raw,
      });
      if (response.ok) {
        store.dispatch({type:'createOrganization_Duplicacy',payload:false})
        store.dispatch({type:'createOrganization_Success',
          payload:dt
        })

      } else {

        if(response.status==401 )
          logout()

        // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
        
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'updateOrganizationDetailsFail',payload:err.message})
    };
  
}
export const updatingOrganizationDetailsAPI=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'updatingOrganizationDetails'})
    const dt={
      "id":data.id,
      "name":data.name,
      "description":data.description,
      "isOrganizationActive":data.status,
    }

    const raw=JSON.stringify(dt)
    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/UpdateOrganization`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,    
          "Accept":"application/json",
          "Content-Type":"application/json"     
        },
        body:raw,
      });
      if (response.ok) {
          store.dispatch({type:'updateOrganizationDetailsSuccess',
          organizationObj:data,
        })

      } else {

        if(response.status==401 )
          logout()

        // store.dispatch({type:'createOrganization_Fail',payload:"Access Denied"})
        
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'updateOrganizationDetailsFail',payload:err.message})
    };
  
}

export const assignNewService=async(data:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'assignServiceSave_InProgress'})
    const dt={
      "organizationId":data.orgId,
      "serviceId":data.serviceId,
      "jsonParameter":JSON.stringify(data.parameters),
    }

    const resp={
      "id":data.serviceId,
      "url":data.url,
      "name":data.name,
      "description":data.description,
      "parameterJsonData":data.parameters,
      "createdOn":data.formattedDateTime
    }
    const raw=JSON.stringify(dt)

    try {      
      const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/AddServices`, {
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

export const updatingServiceParameterDetailsAPI=async(data:any,accessToken:string,logout:()=>void)=>{
  //documentID,document
  //val:["parameter1":"abc"]

  store.dispatch({type:'updatingOrganizationServiceDetails'})
    const dt={
      "serviceId": data.id,
      "organizationId": data.orgId,
      "jsonParameter":JSON.stringify(data.parameters)
    }
    const res={
      "id": data.id,
      "parameterJsonData":data.parameters,
      "createdOn":data.formattedDateTime,
      "name":data.name,
      "description":data.description
    }
    const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/UpdateServices`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          },
        body:raw,
        });
    
        if (response.ok) {
          store.dispatch({type:'updateOrganizationServiceDetailsSuccess',
          servicesObj:res,
        })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'updateOrganizationServiceDetailsFail',payload:err.message})

  
      };

}


/////////////////////////////////Fetching service list 

export const fetchListOfUnassignedServices=async(assignedServices:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'fetchingUnassignedServices'})
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

          const unassignedServices =dt.filter((dtObj:any)=>{
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
      store.dispatch({type:'UnassignedServicesFetch_Fail',payload:err.message})
    };

}

const addAdmins=async(data:any,orgName:string,accessToken:string,logout:()=>void)=>{

  store.dispatch({type:'addOrganizationAdmin_InProgress'})
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
        store.dispatch({type:'addOrganizationAdmin_Duplicacy',payload:false,newEmail:data.email})
        store.dispatch({type:'addOrganizationAdmin_Success',
        payload:res
      })
    } else {
      if(response.status==409) //conflict
        store.dispatch({type:'addOrganizationAdmin_Duplicacy',payload:true,newEmail:data.email})

      if(response.status==401 )
        logout()
    }
  } 
  catch(err:any) {
    console.log(err)
    store.dispatch({type:'addOrganizationAdmin_Fail',payload:err.message})
  };
}




 export const addOrganizationAdmin=async(data:any,orgName:string,accessToken:string,logout:()=>void)=>{

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
      addAdmins(dt,orgName,accessToken,logout)
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

export const setOrganizationAdminDuplicacyToNull=()=>{
  store.dispatch({type:'addOrganizationAdmin_Duplicacy',payload:null})
}

export const setOrganizationDetailsSucessToFalse=()=>{
  store.dispatch({type:'setOrganizationDetailsSucessToFalse'})
}

export const setOrganizationNameDuplicacyToNull=()=>{
  store.dispatch({type:'setOrganizationNameDuplicacyToNull'})

}

export const deleteOrganizationAdmin=async(data:any,orgName:string,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'deleteOrganizationAdmin_InProgress'})
    const dt=[{
      "userId": data.id,
      "userEmail": data.userEmail,
      "organizationName": orgName,
      "roleName": "OrganizationAdmin"
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
          const res = await response.json();
          store.dispatch({type:'deleteOrganizationAdmin_Success',
          payload:data.id
        })
      } else {

        if(response.status==401 )
          logout()
      }
    } 
    catch(err:any) {
      console.log(err)
      store.dispatch({type:'deleteOrganizationAdmin_Fail',payload:err.message})

    };
  
}



export const deleteOrganization=async(orgId:any,accessToken:string,logout:()=>void)=>{

      store.dispatch({type:'deleteOrganization_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/DeleteOrganization/${orgId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,    
            "Accept":"application/json",
            "Content-Type":"application/json"     
          }
        });
    
        if (response.ok) {
          store.dispatch({type:'deleteOrganization_Success',
            payload:orgId //data is the organization Id
          })
        } else {
  
          if(response.status==401 )
            logout()
        }
      } 
      catch(err:any) {
        console.log(err)
        store.dispatch({type:'deleteOrganization_Fail',payload:err.message})
  
      };

  
}


export const deleteAssignedService=async(data:any,orgId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'assignServiceDelete_InProgress'})
    const dt={
      "serviceId": data.id,
      "organizationId": orgId,
    }
    const raw=JSON.stringify(dt)
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/RemoveService`, {
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



////////////////////////////For general users//////////////////////
export const fetchOrganizationDetails_forGeneralUsers=async(userEmail:any,accessToken:string,logout:()=>void)=>{
  store.dispatch({type:'fetchingOrganizationDetails'})
  try {      
    const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${userEmail}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,         
      },
    });
    if (response.ok) {
        const res = await response.json();
        console.log(res)
        const find_obj: any = res.filter((ob: any) => ob.roleName === "OrganizationAdmin");
        console.log(find_obj)
        let filteredArray:any[]=[]
        if(find_obj !=undefined){
             filteredArray = find_obj.map((item: any) => ({
              id: item.organizationId,
              name: item.organizationName
          }));
        }
        // Use an object to keep track of unique entries
        let uniqueEntries:any = {};
        let uniqueArray = filteredArray.filter((item:any) => {
          // Generate a unique key using id and name
          let key = item.id + '-' + item.name;
          // Check if the key already exists in the uniqueEntries object
          // If not, add it and return true to keep the item in the filtered array
          if (!uniqueEntries[key]) {
            uniqueEntries[key] = true;
            return true;
          }
          // If the key already exists, return false to filter out the duplicate item
          return false;
        });

        console.log(uniqueArray);
      
        store.dispatch({type:'organizationDetailsSuccess',
                        organizationList:filteredArray
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
    store.dispatch({type:'organizationDetailsFetchFail',payload:err.message})
  };

}

