import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {organizationDetailsFetchFail,fetchingOrganizationDetails,fetchOrganization_General_Admin_AssignedService_Details_Success,setOrganizationDetailsSucessToFalse,organizationDetailsSuccess,updatingOrganizationDetails,updateOrganizationDetailsSuccess,updateOrganizationDetailsFail,updatingOrganizationServiceDetails,updateOrganizationServiceDetailsSuccess,updateOrganizationServiceDetailsFail, addOrganizationAdmin_Success, addOrganizationAdmin_Fail, addOrganizationAdmin_InProgress, deleteOrganizationAdmin_InProgress, deleteOrganizationAdmin_Success, deleteOrganizationAdmin_Fail, deleteOrganization_InProgress, deleteOrganization_Success, deleteOrganization_Fail, addOrganizationAdmin_Duplicacy,fetchOrganization_Admin_AssignedService_Details_Success,fetchOrganization_Admin_AssignedService_Details_InProgress} from '../action-types/organizationActionType'
interface IOrganizationDetails{
    organizationList:object[] | null,
    servicesList:object[] | null,
    usersList:object [] | null,
    organizationFetchInProgress:boolean,
    service_User_DetailsFetchInProgress:boolean,
    service_User_DetailsFetchInSuccess:boolean,
    organizationFetchSuccess:boolean,
    organizationUpdateInProgress:boolean,
    organizationUpdateSuccess:boolean,
    duplicacy:null | boolean,
    fetchError:string | null,
    updateError:string | null,
    deletorganizationSuccess:boolean,
    deletorganizationProgress:boolean,
    deletorganization_Error:string | null,
    newEmail:string  | null
}

const initialState:IOrganizationDetails={
    organizationList:null,
    servicesList:null,
    deletorganizationSuccess:false,
    usersList:null,
    organizationFetchInProgress:false,
    organizationFetchSuccess:false,
    service_User_DetailsFetchInProgress:false,
    service_User_DetailsFetchInSuccess:false,
    organizationUpdateInProgress:false,
    organizationUpdateSuccess:false,
    deletorganizationProgress:false,
    fetchError:null,
    updateError:null,
    deletorganization_Error:null,
    duplicacy:null,
    newEmail:null
}



const OrganizationFetchReducer = (state: IOrganizationDetails = initialState, action:any): IOrganizationDetails => {
    switch (action.type){
        case fetchingOrganizationDetails:
            return{
                ...state,
                organizationFetchInProgress:true,
                service_User_DetailsFetchInProgress:false,
                service_User_DetailsFetchInSuccess:false,
                organizationList:null,
                servicesList:null,
                usersList:null,
                organizationFetchSuccess:false,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                deletorganizationSuccess:false,
                deletorganization_Error:null,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchOrganization_Admin_AssignedService_Details_InProgress:
            return{
                ...state,
                organizationFetchInProgress:false,
                service_User_DetailsFetchInProgress:true,
                service_User_DetailsFetchInSuccess:false,
                servicesList:null,
                usersList:null,
                organizationFetchSuccess:false,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                deletorganizationSuccess:false,
                deletorganization_Error:null,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case organizationDetailsSuccess:
            return{
                ...state,
                organizationFetchInProgress:false,
                service_User_DetailsFetchInProgress:false,
                service_User_DetailsFetchInSuccess:false,
                organizationList:action.organizationList,
                servicesList:null,
                usersList:null,
                organizationFetchSuccess:true,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchOrganization_Admin_AssignedService_Details_Success:
            return{
                ...state,
                organizationFetchInProgress:false,
                service_User_DetailsFetchInProgress:false,
                service_User_DetailsFetchInSuccess:true,
                servicesList:action.servicesList,
                usersList:action.usersList,
                organizationFetchSuccess:false,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchOrganization_General_Admin_AssignedService_Details_Success:
            return{
                ...state,
                organizationFetchInProgress:false,
                service_User_DetailsFetchInProgress:false,
                service_User_DetailsFetchInSuccess:true,
                organizationList:action.organizationList,
                servicesList:action.servicesList,
                usersList:action.usersList,
                organizationFetchSuccess:false,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case organizationDetailsFetchFail:
            return{
                ...state,
                organizationFetchInProgress:false,
                service_User_DetailsFetchInProgress:false,
                service_User_DetailsFetchInSuccess:false,
                organizationList:null,
                servicesList:null,
                usersList:null,
                organizationFetchSuccess:false,
                organizationUpdateInProgress:false,
                organizationUpdateSuccess:false,
                fetchError:action.payload,
                updateError:null                
            }
            case setOrganizationDetailsSucessToFalse:
                return{
                    ...state,
                    service_User_DetailsFetchInSuccess:false,
                }
            case updatingOrganizationDetails:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    // organizationList:null,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:true,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:null                    
                }
            case updateOrganizationDetailsSuccess:
                    let updatedObjects:object[] | null=null
                    if(state.organizationList){
                    updatedObjects = state.organizationList.map((obj:any) =>
                        obj.id == action.organizationObj.id ? action.organizationObj : obj
                    );
                    console.log(updatedObjects)
                    }
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationList:updatedObjects,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:true,
                    fetchError:null,
                    updateError:null                       
                }
            case updateOrganizationDetailsFail:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }
            case updatingOrganizationServiceDetails:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    // organizationList:null,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:true,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:null                    
                }
            case updateOrganizationServiceDetailsSuccess:
                    let serviceObject:object[] | null=null
                    if(state.servicesList){
                        serviceObject = state.servicesList.map((obj:any) =>
                            obj.id === action.servicesObj.id ? action.servicesObj : obj
                        );
                    }
                    console.log(serviceObject)
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    servicesList:serviceObject,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:true,
                    fetchError:null,
                    updateError:null                       
                }
            case updateOrganizationServiceDetailsFail:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }
            case addOrganizationAdmin_InProgress:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:true,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:null
                }
            case addOrganizationAdmin_Success:
                    let userObject:object[] | null=null
                    if(state.usersList)
                        userObject=[...state.usersList,action.payload]
                
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    usersList:userObject,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:true,
                    fetchError:null,
                    updateError:null
                }
            case addOrganizationAdmin_Fail:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload,
                    duplicacy:null
                }
            case deleteOrganizationAdmin_InProgress:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:true,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:null,
                    duplicacy:null
                }
            case deleteOrganizationAdmin_Success:
                let filteredUsers=state.usersList
                if(state.usersList)
                     filteredUsers = state.usersList.filter((user:any) => user.id !== action.payload);
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    usersList:filteredUsers,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:true,
                    fetchError:null,
                    updateError:null,
                    duplicacy:null 
                }       
            case addOrganizationAdmin_Duplicacy:
                return{
                    ...state,
                    duplicacy:action.payload,
                    newEmail:action.newEmail
                }
            case deleteOrganizationAdmin_Fail:
                return{
                    ...state,
                    organizationFetchInProgress:false,
                    service_User_DetailsFetchInProgress:false,
                    service_User_DetailsFetchInSuccess:false,
                    organizationFetchSuccess:false,
                    organizationUpdateInProgress:false,
                    organizationUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }   
            case deleteOrganization_InProgress:
                return{
                    ...state,
                    deletorganizationProgress:true,
                    deletorganization_Error:null,
                    deletorganizationSuccess:false 
                }
            case deleteOrganization_Success:
                let filteredOrganization=state.organizationList
                if(state.organizationList)
                    filteredOrganization = state.organizationList.filter((org:any) => org.id !== action.payload);
                return{
                    ...state,
                    organizationList:filteredOrganization,
                    deletorganizationSuccess:true,
                    deletorganizationProgress:false,
                    deletorganization_Error:null,
                    fetchError:null,
                    updateError:null    
                }       
            case deleteOrganization_Fail:
                return{
                    ...state,
                    deletorganizationProgress:false,
                    deletorganizationSuccess:false,
                    deletorganization_Error:action.payload,
                }                                                  
        default:
            return state
    }
}

export default OrganizationFetchReducer