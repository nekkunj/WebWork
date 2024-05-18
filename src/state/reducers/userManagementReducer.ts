import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addUser_Fail, addUser_InProgress, addUser_Duplicacy,addUser_Success,fetchingOrganizationNames_Details_InProgress,fetchingOrganizationNames_Details_Success,changeUserRole_Fail, changeUserRole_InProgress, changeUserRole_Success, deletingUser_Fail, deletingUser_InProgress, deletingUser_Success, fetchingUserManagementDetails_Fail,fetchingUserManagementDetails_InProgress,fetchingUserManagementDetails_Success } from '../action-types/userManagementActionType'
// import { Action } from "../actions"
interface IUserManagementReducer{
    organizationNames:object[] | null,
    projectNames:object[] | null,
    userNames:any[] | null,
    fetchingDetails_InProgress:boolean,
    fetchingDetails_Success:boolean,
    fetchingOrganizationNames_InProgress:boolean,
    fetchingOrganizationNames_Success:boolean,
    fetchingDetails_Error:string | null,
    updateUser_Progress:boolean,
    updateUser_Success:boolean,
    updateUser_Error:string | null,
    duplicacy:null | boolean,
    newEmail:null | string,
    deleteUser_Success:boolean,
    deleteUser_Progress:boolean,
}

const initialState:IUserManagementReducer={

    organizationNames:null,
    projectNames:null,
    userNames:null,
    fetchingDetails_InProgress:false,
    fetchingDetails_Success:false,
    fetchingOrganizationNames_InProgress:false,
    fetchingOrganizationNames_Success:false,
    fetchingDetails_Error:null,
    updateUser_Progress:false,
    updateUser_Success:false,
    deleteUser_Success:false,
    deleteUser_Progress:false,
    updateUser_Error: null,
    duplicacy:null,
    newEmail:null
}



const UserManagementReducer = (state: IUserManagementReducer = initialState, action:any): IUserManagementReducer => {
    switch (action.type){
        case fetchingOrganizationNames_Details_InProgress:
            return{
                ...state,
                organizationNames:null,
                projectNames:null,
                userNames:null,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:true,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                deleteUser_Success:false,
                deleteUser_Progress:false,
                updateUser_Error: null,
                duplicacy:null

            }
        case fetchingOrganizationNames_Details_Success:
            return{
                ...state,
                organizationNames:action.organizationNames,
                projectNames:null,
                userNames:null,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:true,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: null,
                duplicacy:null

            }
        case fetchingUserManagementDetails_InProgress:
            return{
                ...state,
                projectNames:null,
                userNames:null,
                fetchingDetails_InProgress:true,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                deleteUser_Success:false,
                deleteUser_Progress:false,
                updateUser_Error: null,
                duplicacy:null

            }
        case fetchingUserManagementDetails_Success:
            return{
                ...state,
                projectNames:action.projectNames,
                userNames:action.userNames,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:true,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: null,
                duplicacy:null
            }
        case fetchingUserManagementDetails_Fail:
            return{
                ...state,
                organizationNames:null,
                projectNames:null,
                userNames:null,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:action.payload,
                updateUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: null,
                duplicacy:null


            }
        case deletingUser_InProgress:
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:true,
                updateUser_Success:false,
                deleteUser_Success:false,
                deleteUser_Progress:true,
                updateUser_Error: null
            }
        case deletingUser_Success:
            let filteredUsers=state.userNames
            if(state.userNames)
                    filteredUsers = state.userNames.filter((user:any) => user.documentId !== action.payload);
            return{
                ...state,   
                userNames:filteredUsers,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                deleteUser_Success:true,
                deleteUser_Progress:false,
                updateUser_Error: null
            }     
        case deletingUser_Fail:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                deleteUser_Success:false,
                deleteUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: action.payload
            }   
        }  
        case addUser_InProgress:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:true,
                updateUser_Success:false,
                deleteUser_Success:false,
                deleteUser_Progress:false,
                updateUser_Error: null
            }
        }
        case addUser_Success:{
            let filteredUsers=state.userNames
            if(state.userNames)
                    filteredUsers = state.userNames.filter((user:any) => user.id !== action.payload);
            return{
                ...state,
                userNames:filteredUsers,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:true,
                deleteUser_Success:false,
                deleteUser_Progress:false,
                updateUser_Error: null
            }
        }
        case addUser_Fail:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: action.payload,
                duplicacy:null

            }
        }
        case addUser_Duplicacy:{
            return{
                ...state,
                duplicacy:action.payload,
                newEmail:action.newEmail
            }
        }
        case changeUserRole_InProgress:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:true,
                updateUser_Success:false,
                updateUser_Error: null
            }
        }
        case changeUserRole_Success:{
            let filteredUsers=state.userNames
            if(state.userNames)
            {
             filteredUsers = state.userNames.map(user => {
                if (user.id === action.payload.id) {
                  return {
                    ...user,
                    userRole: action.payload.userRole
                  };
                }
                return user;
              });
            }
            return{
                ...state,
                userNames:filteredUsers,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:true,
                updateUser_Error: null
            }
        }
        case changeUserRole_Fail:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingOrganizationNames_InProgress:false,
                fetchingOrganizationNames_Success:false,
                fetchingDetails_Error:null,
                updateUser_Progress:false,
                updateUser_Success:false,
                updateUser_Error: action.payload
            }
        }
        default:
            return state
    }
}

export default UserManagementReducer