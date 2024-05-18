import axios from "axios";
import React from 'react';
import { store } from '../index';
import { connect } from 'react-redux';

export const fetchUserRole=async(roles:any)=>{
    store.dispatch({type:'userRoleInProgress'})
        if(roles!=undefined && roles.includes("admin"))
            store.dispatch({type:'userRoleSuccess',payload:"Super Admin"})
        else
            store.dispatch({type:'userRoleSuccess',payload:"General User"})

        
  }


  export const IsOrganizationAdmin=async(userEmail:any,roles:any,accessToken:any,logout:()=>void)=>{
        store.dispatch({type:'userRoleInProgress'})
      let userRole:string="General User"

      if(roles.includes("admin"))
        store.dispatch({type:'userRoleSuccess',payload:"Super Admin"})

      else{
        try {      
            const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${userEmail}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,         
              },
            });
            if (response.ok) {
                const dt = await response.json();
                const find_obj: any = dt.find((ob: any) => ob.roleName === "OrganizationAdmin");
                store.dispatch({type:'userRoleSuccess',payload:find_obj!=undefined?"OrganizationAdmin":userRole})

                
            } else {
              // console.error('Failed to call API:', response.statusText);
              if(response.status==401 )
                logout()
              
            }
          } 
          catch(err:any) {
            console.log(err.message)
            store.dispatch({type:'userRoleFailure',payload:err.message})

          };
      }
    
  }
  



  export const fetchGeneraOrganizationDetails=async(userEmail:string,accessToken:any,logout:()=>void)=>{
    store.dispatch({type:'fetchingOrganizationDetails'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            const filteredObjects = dt.filter((obj:any) => obj.roleName === "OrganizationAdmin");

            // Create a new array with 'id' and 'name' keys
            const organization_Details = filteredObjects.map((obj:any) => ({
                id: obj.organizationId,
                name: obj.organizationName
            }));
            store.dispatch({type:'organizationDetailsSuccess',
            organizationList:organization_Details,
          })
          store.dispatch({type:'user_AllRolesSuccess',payload:filteredObjects})

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


  export const fetchOrganization_Admin_Project_Details=async(orgId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchingProjectDetails_InProgress'})

      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Organization/${orgId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
    
        if (response.ok) {
            const dt = await response.json();
            store.dispatch({type:'fetchingProjectDetails_Success',
            projectsList:dt.projects,
            organizationObj:dt
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
        store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
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
            store.dispatch({type:'fetchOrganization_General_Admin_AssignedService_Details_Success',
                            organizationList:dt,
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


  export const fetchGeneralUser_OrganizationDetails=async(userEmail:string,accessToken:any,logout:()=>void)=>{

        // store.dispatch({type:'fetchingProjectDetails_Success',
        //                 organizationList:data.data.organizationList,
        //                 projectsList:data.data.projectsList,
        //                 servicesList:data.data.servicesList,
        //                 usersList:data.data.usersList
        //               })

      store.dispatch({type:'fetchingOrganizationNames_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${userEmail}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            // Temporary object to track unique organizationIds
            const uniqueIds:any = {};

            // Create a new array with unique 'id' and 'name' keys
            const organization_Details = dt.reduce((uniqueArray:any, obj:any) => {
                // Check if organizationId is already in uniqueIds
                if (!uniqueIds[obj.organizationId]) {
                    // Add organizationId to uniqueIds object
                    uniqueIds[obj.organizationId] = true;
                    // Add object to uniqueArray
                    uniqueArray.push({
                        id: obj.organizationId,
                        name: obj.organizationName
                    });
                }
                return uniqueArray;
            }, []);
            store.dispatch({type:'fetchingOrganizationNames_Success',
            organizationList:organization_Details
          })
            store.dispatch({type:'user_AllRolesSuccess',payload:dt})

        } else {
          // console.error('Failed to call API:', response.statusText);
          if(response.status==401 )
            logout()
          store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
      };
    
    
}
export const fetchGeneralUser_ProjectDetails=async(orgId:string,userEmail:string,accessToken:any,logout:()=>void)=>{


  store.dispatch({type:'fetchingProjectDetails_InProgress'})
  try {      
    const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/BVUser/${userEmail}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,         
      },
    });
    if (response.ok) {
      const dt = await response.json();
      const filteredObjects = dt.filter((obj:any) => obj.organizationId === orgId && obj.projectName!==null);

      const project_Details = filteredObjects.map((obj:any) => ({
        id: obj.projectId,
        name: obj.projectName 
      }));
      
      store.dispatch({type:'fetchingProjectDetails_Success',
      projectsList:project_Details,
      organizationObj:null

    })

  } else {
    // console.error('Failed to call API:', response.statusText);
    if(response.status==401 )
      logout()
    store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
    
  }
} 
catch(err:any) {
  store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
};


}

export const fetchProject_ServiceDetails=async(projId:string,accessToken:string,logout:()=>void)=>{
    store.dispatch({type:'fetchingProjectDetails_GeneralUser_InProgress'})
      try {      
        const response = await fetch(`${process.env.REACT_APP_DATABASE_API}/api/Project/${projId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,         
          },
        });
        if (response.ok) {
            const dt = await response.json();
            store.dispatch({type:'fetchingProjectDetails_GeenralUser_Success',
              projectObj:dt,
              serviceList:dt.services,
              usersList:dt.projectUsers
            })
        } else {
          // console.error('Failed to call API:', response.statusText);
          // if(response.status==401 )
            // logout()
          store.dispatch({type:'organizationDetailsFetchFail',payload:"Access Denied"})
          
        }
      } 
      catch(err:any) {
        store.dispatch({type:'fetchingProjectDetails_Fail',payload:err.message})
      };
  }

export const setServiceList_SuperAdmin=async(services:any)=>{
  store.dispatch({type:'setServiceList_SuperAdmin',
  serviceList:services,
})
}