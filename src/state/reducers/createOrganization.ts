import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { Action } from "../actions"
import { createOrganization_Fail,createOrganization_Duplicacy,setOrganizationNameDuplicacyToNull,createOrganization_Success,createOrganization_InProgress, } from '../action-types/organizationActionType'
interface IAssignServiceReducer{
    organizationId:string | null,
    documentId:string | null,
    organizationName:string | null,
    organizationDescription:string | null,
    createOrganization_InProgress:boolean,
    createOrganization_Success:boolean,
    createOrganization_Error:string | null,
    nameIsDuplicate:boolean | null
}

const initialState:IAssignServiceReducer={
    organizationId:null,
    documentId:null,
    organizationName:null,
    organizationDescription:null,
    createOrganization_InProgress:false,
    createOrganization_Success:false,
    createOrganization_Error:null,
    nameIsDuplicate:null
}



const CreateOrganization = (state: IAssignServiceReducer = initialState, action:any): IAssignServiceReducer => {
    switch (action.type){
        case createOrganization_Duplicacy:
            return{
                ...state,
                nameIsDuplicate:action.payload,
                organizationId:null,
                organizationName:null,
                documentId:null,
                organizationDescription:null,
                createOrganization_InProgress:false,
                createOrganization_Success:false,
                createOrganization_Error:null
            }
        case createOrganization_InProgress:
            return{
                ...state,
                organizationId:null,
                documentId:null,
                organizationName:null,
                organizationDescription:null,
                createOrganization_InProgress:true,
                createOrganization_Success:false,
                createOrganization_Error:null,
            }
        case createOrganization_Success:
            return{
                ...state,
                organizationId:action.payload.id,
                documentId:action.payload.id,
                organizationName:action.payload.name,
                organizationDescription:action.payload.description,
                createOrganization_InProgress:false,
                createOrganization_Success:true,
                createOrganization_Error:null
            }
        case setOrganizationNameDuplicacyToNull:
            return{
                ...state,
                nameIsDuplicate:null
            }
        case createOrganization_Fail:
            return{
                ...state,
                organizationId:null,
                organizationName:null,
                documentId:null,
                organizationDescription:null,
                createOrganization_InProgress:false,
                createOrganization_Success:false,
                createOrganization_Error:action.payload,
                nameIsDuplicate:null
            }
        default:
            return state
    }
}

export default CreateOrganization