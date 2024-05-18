import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import { FetchingBuildingNames_Success, FetchingDashboardData_Fail, FetchingDashboardData_InProgress, FetchingDashboardData_Success,FetchingApartmentNames_InProgress,FetchingApartmentNames_Success,FetchingApartmentNames_Fail } from '../action-types/dashboardActionType'
interface IUserRoles{
    data:object[] ,
    dataFetch_InProgress:boolean,
    dataFetch_success:boolean,
    buildingNames:object[],
    apartmentNames:object[],
    dataFetch_Error:string | null,
}

const initialState:IUserRoles={
    data:[],
    buildingNames:[],
    apartmentNames:[],
    dataFetch_InProgress:false,
    dataFetch_success:false,
    dataFetch_Error:null,
}



const DashboardReducer = (state: IUserRoles = initialState, action:any): IUserRoles => {
    switch (action.type){
        case FetchingDashboardData_InProgress:
            return{
                ...state,
                dataFetch_InProgress:true,
                dataFetch_success:false,
                data:[],
                dataFetch_Error:null,
            }
        case FetchingDashboardData_Success:
            return{
                ...state,
                dataFetch_InProgress:false,
                dataFetch_success:true,
                data:action.payload,
                dataFetch_Error:null,
            }
        case FetchingBuildingNames_Success:
            return{
                ...state,
                buildingNames:action.payload,
                dataFetch_success:true,
                dataFetch_Error:null,
                dataFetch_InProgress:false,
            }
        case FetchingDashboardData_Fail:
            return{
                ...state,
                dataFetch_InProgress:false,
                dataFetch_success:true,
                data:[],
                dataFetch_Error:action.payload,
            }
        case FetchingApartmentNames_InProgress:
            return{
                ...state,
                apartmentNames:[],
                dataFetch_success:false,
                dataFetch_Error:null,
                dataFetch_InProgress:true,
            }
        case FetchingApartmentNames_Success:
            return{
                ...state,
                apartmentNames:action.payload,
                dataFetch_success:true,
                dataFetch_Error:null,
                dataFetch_InProgress:false,
            }
        case FetchingApartmentNames_Fail:
            return{
                ...state,
                dataFetch_InProgress:false,
                dataFetch_success:true,
                apartmentNames:[],
                dataFetch_Error:action.payload,
            }
        default:
            return state
    }
}

export default DashboardReducer