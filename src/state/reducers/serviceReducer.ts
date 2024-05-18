import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import { serviceDetailsSaveFailure, serviceDetailsSaveSuccess,createService_Duplicacy, serviceParamtersInProgress, serviceSaveInProgress } from '../action-types/serviceCreationActionType'
import { IparameterObj } from '../../type'
export interface IServiceReducer{
    serviceId:string | null,
    serviceName:string | null,
    serviceDescription:string | null,
    serviceURL:string | null,
    serviceStatus:boolean | null,
    serviceParameters:IparameterObj[] | null,
    serviceDetailsSaving:boolean,
    serviceParametersSaving:boolean,
    serviceDetailsSaveSuccess:boolean,
    serviceDetailsSaveFailure:boolean,
    serviceCreationError:string | null,
    nameIsDuplicate:boolean | null
    
}

const initialState:IServiceReducer={
    serviceId:null,
    serviceName:null,
    serviceDescription: null,
    serviceURL:null,
    serviceStatus: null,
    serviceParameters: null,
    serviceParametersSaving:false,
    serviceDetailsSaving:false,
    serviceDetailsSaveSuccess:false,
    serviceDetailsSaveFailure:false,
    serviceCreationError:null,
    nameIsDuplicate: null

}



const ServiceReducer = (state: IServiceReducer = initialState, action:any): IServiceReducer => {
    switch (action.type){
        case createService_Duplicacy:
            return{
                ...state,
                serviceDetailsSaving:false,
                serviceParametersSaving:false,
                serviceDetailsSaveSuccess:true,
                serviceDetailsSaveFailure:false,
                serviceCreationError:null,
                nameIsDuplicate: action.payload

            }
        case serviceSaveInProgress:
            return{
                ...state,
                serviceId:action.id,
                serviceName:action.name,
                serviceDescription: action.description,
                serviceURL:action.url,
                serviceStatus: action.status,
                serviceParameters: null,
                serviceParametersSaving:false,
                serviceDetailsSaving:true,
                serviceDetailsSaveSuccess:false,
                serviceDetailsSaveFailure:false
            }
        case serviceDetailsSaveSuccess:
            return{
                ...state,
                serviceId:action.payload,
                serviceDetailsSaving:false,
                serviceDetailsSaveSuccess:true,
                serviceParametersSaving:false,
                serviceDetailsSaveFailure:false,
                nameIsDuplicate: null

            }
        case serviceParamtersInProgress:
            return{
                ...state,
                serviceParameters:action.parameters,
                serviceDetailsSaving:false,
                serviceDetailsSaveSuccess:false,
                serviceParametersSaving:true,
                serviceDetailsSaveFailure:false            }
        case serviceDetailsSaveFailure:
            return{
                ...state,
                serviceDetailsSaving:false,
                serviceParametersSaving:false,
                serviceDetailsSaveSuccess:true,
                serviceDetailsSaveFailure:false,
                serviceCreationError:action.serviceCreationError,
                nameIsDuplicate: null
            }
        
        default:
            return state
    }
}

export default ServiceReducer