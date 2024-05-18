import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import { assignServiceSave_Fail, assignServiceSave_Success,assignServiceSave_InProgress, assignServiceDelete_Fail, assignServiceDelete_Success, assignServiceDelete_InProgress, } from '../action-types/organizationActionType'
interface IAssignServiceReducer{
    assignedServiceObject:any | null,
    serviceAssign_InProgress:boolean,
    serviceAssign_Success:boolean,
    serviceAssign_Error:string | null,
    serviceUnassign_InProgress:boolean,
    serviceUnassign_Success:boolean,
    serviceUnassign_Error:string | null,
    
}

const initialState:IAssignServiceReducer={
    assignedServiceObject:null,
    serviceAssign_InProgress:false,
    serviceAssign_Success:false,
    serviceAssign_Error:null,
    serviceUnassign_InProgress:false,
    serviceUnassign_Success:false,
    serviceUnassign_Error: null,
}



const AssignServicesReducer = (state: IAssignServiceReducer = initialState, action:any): IAssignServiceReducer => {
    switch (action.type){
        case assignServiceSave_InProgress:
            return{
                ...state,
                assignedServiceObject:null,
                serviceAssign_InProgress:true,
                serviceAssign_Success:false,
                serviceAssign_Error:null,
                serviceUnassign_InProgress:false,
                serviceUnassign_Success:false,
                serviceUnassign_Error: null,
            }
        case assignServiceSave_Success:
            return{
                ...state,
                assignedServiceObject:action.payload,
                serviceAssign_InProgress:false,
                serviceAssign_Success:true,
                serviceAssign_Error:null,
                serviceUnassign_InProgress:false,
                serviceUnassign_Success:false,
                serviceUnassign_Error: null,
            }
        case assignServiceSave_Fail:
            return{
                ...state,
                assignedServiceObject:null,
                serviceAssign_InProgress:false,
                serviceAssign_Success:false,
                serviceAssign_Error:action.payload,
                serviceUnassign_InProgress:false,
                serviceUnassign_Success:false,
                serviceUnassign_Error: null,
            }
        case assignServiceDelete_InProgress:
            return{
                ...state,
                assignedServiceObject:null,
                serviceAssign_InProgress:false,
                serviceAssign_Success:false,
                serviceAssign_Error:null,
                serviceUnassign_InProgress:true,
                serviceUnassign_Success:false,
                serviceUnassign_Error: null,
            }
        case assignServiceDelete_Success:
            return{
                ...state,
                assignedServiceObject:null,
                serviceAssign_InProgress:false,
                serviceAssign_Success:false,
                serviceAssign_Error:null,
                serviceUnassign_InProgress:false,
                serviceUnassign_Success:true,
                serviceUnassign_Error: null,
            }
        case assignServiceDelete_Fail:
            return{
                ...state,
                assignedServiceObject:null,
                serviceAssign_InProgress:false,
                serviceAssign_Success:false,
                serviceAssign_Error:null,
                serviceUnassign_InProgress:false,
                serviceUnassign_Success:false,
                serviceUnassign_Error: action.payload,
            }                            
        default:
            return state
    }
}

export default AssignServicesReducer