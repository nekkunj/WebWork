import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import {userRoleInProgress,userRoleSuccess,userRoleFailure,user_AllRolesSuccess} from '../action-types/userRoleActionType'
interface IUserRoles{
    role:string | null, // It will be either "Super Admin" or "General User"
    allRoles:object[] | null,
    roleFetch_Error:string | null,
    userRoleInProgress:boolean,
}

const initialState:IUserRoles={
    role:null,
    allRoles:null,
    roleFetch_Error:null,
    userRoleInProgress:false
}



const RoleReducer = (state: IUserRoles = initialState, action:any): IUserRoles => {
    switch (action.type){
        case userRoleInProgress:
            return{
                ...state,
                userRoleInProgress:true,
                allRoles:null,
                role:null,
                roleFetch_Error:null,
            }
        case userRoleSuccess:
            return{
                ...state,
                userRoleInProgress:false,
                role:action.payload,
                roleFetch_Error:null,
            }
        case user_AllRolesSuccess:
            return{
                ...state,
                allRoles:action.payload
            }
        case userRoleFailure:
            return{
                ...state,
                userRoleInProgress:false,
                allRoles:null,
                role:null,
                roleFetch_Error:action.payload,
            }
        default:
            return state
    }
}

export default RoleReducer