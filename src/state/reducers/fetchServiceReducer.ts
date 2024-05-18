import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchServiceDetails_Fail, fetchServiceDetails_InProgress,deleteService_InProgress,deleteService_Success,deleteService_Fail,  fetchServiceDetails_Success, updatingServiceDetails_Fail, updatingServiceDetails_InProgress, updatingServiceDetails_Success } from '../action-types/serviceCreationActionType'
// import { Action } from "../actions"
interface IServiceReducer{
    serviceList:object[] | null,
    fetchingDetails_InProgress:boolean,
    fetchingDetails_Success:boolean,
    fetchingDetails_Error:string | null,
    updateService_Progress:boolean,
    updateService_Success:boolean,
    updateService_Error:string | null,
    deleteServiceSuccess:boolean,
    deleteServiceProgress:boolean,
    deleteService_Error:string | null,
}

const initialState:IServiceReducer={

    serviceList:null,
    fetchingDetails_InProgress:false,
    fetchingDetails_Success:false,
    fetchingDetails_Error:null,
    updateService_Progress:false,
    updateService_Success:false,
    updateService_Error: null,
    deleteServiceSuccess:false,
    deleteServiceProgress:false,
    deleteService_Error: null,

}



const FetchServiceReducer = (state: IServiceReducer = initialState, action:any): IServiceReducer => {
    switch (action.type){
        case fetchServiceDetails_InProgress:
            return{
                ...state,
                serviceList:null,
                fetchingDetails_InProgress:true,
                fetchingDetails_Success:false,
                fetchingDetails_Error:null,
                updateService_Progress:false,
                updateService_Success:false,
                updateService_Error: null,
                deleteServiceSuccess:false,
                deleteServiceProgress:false,
                deleteService_Error: null,
            }
        case fetchServiceDetails_Success:
            return{
                ...state,
                serviceList:action.serviceList,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:true,
                fetchingDetails_Error:null,
                updateService_Progress:false,
                updateService_Success:false,
                updateService_Error: null
            }
        case fetchServiceDetails_Fail:
            return{
                ...state,
                serviceList:null,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingDetails_Error:action.payload,
                updateService_Progress:false,
                updateService_Success:false,
                updateService_Error: null
            }
        case updatingServiceDetails_InProgress:
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingDetails_Error:null,
                updateService_Progress:true,
                updateService_Success:false,
                updateService_Error: null
            }
        case updatingServiceDetails_Success:
            let updatedObjects:object[] | null=null
            if(state.serviceList){
            updatedObjects = state.serviceList.map((obj:any) =>
                obj.id === action.serviceObj.id ? action.serviceObj : obj
            );
            }
            return{     
                ...state,
                serviceList:updatedObjects,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingDetails_Error:null,
                updateService_Progress:false,
                updateService_Success:true,
                updateService_Error: null
            }     
        case updatingServiceDetails_Fail:{
            return{
                ...state,
                fetchingDetails_InProgress:false,
                fetchingDetails_Success:false,
                fetchingDetails_Error:null,
                updateService_Progress:false,
                updateService_Success:false,
                updateService_Error: action.payload
            }
        }  
        case deleteService_InProgress:
            return{
                ...state,
                deleteServiceSuccess:false,
                deleteServiceProgress:true,
                deleteService_Error: null,
            }    
        case deleteService_Success:
            let filteredServices=state.serviceList
            if(state.serviceList)
                filteredServices = state.serviceList.filter((ser:any) => ser.id !== action.payload);
            return{
                ...state,
                deleteServiceSuccess:true,
                deleteServiceProgress:false,
                serviceList:filteredServices,
                deleteService_Error: null,
            }    
        case deleteService_Fail:
            return{
                ...state,
                deleteServiceSuccess:false,
                deleteServiceProgress:false,
                deleteService_Error:action.payload,
            } 

        default:
            return state
    }
}

export default FetchServiceReducer