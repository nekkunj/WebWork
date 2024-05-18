import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import {userRoleInProgress,userRoleSuccess,userRoleFailure} from '../action-types/userRoleActionType'
import { fetchingUnassignedServices,UnassignedServicesFetch_Fail,UnassignedServicesFetchSuccess } from '../action-types/organizationActionType'
interface IUnassignedServicesReducer{
    unassignedServicesList:object[] | null,
    unassignedServices_InProgress:boolean,
    unassignedServicesFetch_Success:boolean,
    unassignedServices_Error:string | null,
}

const initialState:IUnassignedServicesReducer={
    unassignedServicesList:null,
    unassignedServices_InProgress:false,
    unassignedServicesFetch_Success:false,
    unassignedServices_Error:null
}



const UnassignedServicesReducer = (state: IUnassignedServicesReducer = initialState, action:any): IUnassignedServicesReducer => {
    switch (action.type){
        case fetchingUnassignedServices:
            return{
                ...state,
                unassignedServicesList:null,
                unassignedServices_InProgress:true,
                unassignedServicesFetch_Success:false,
                unassignedServices_Error:null
            }
        case UnassignedServicesFetchSuccess:
            return{
                ...state,
                unassignedServicesList:action.payload,
                unassignedServices_InProgress:false,
                unassignedServicesFetch_Success:true,
                unassignedServices_Error:null
            }
        case UnassignedServicesFetch_Fail:
            return{
                ...state,
                unassignedServicesList:null,
                unassignedServices_InProgress:false,
                unassignedServicesFetch_Success:false,
                unassignedServices_Error:action.payload
            }
        default:
            return state
    }
}

export default UnassignedServicesReducer