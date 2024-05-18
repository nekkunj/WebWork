import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createProject_Fail, setProjectNameDuplicacyToNull,createProject_Duplicacy,createProject_InProgress, createProject_Success } from '../action-types/projectActionType'
// import { Action } from "../actions"
interface ICreateProject{
    projectId:string | null,
    organizationId:string | null,
    documentId:string | null,
    projectName:string | null,
    projectDescription:string | null,
    createProject_InProgress:boolean,
    createProject_Success:boolean,
    createProject_Error:string | null,
    nameIsDuplicate:boolean | null

}

const initialState:ICreateProject={
    projectId:null,
    organizationId:null,
    documentId:null,
    projectName:null,
    projectDescription:null,
    createProject_InProgress:false,
    createProject_Success:false,
    createProject_Error:null,
    nameIsDuplicate: null

}



const CreateProject = (state: ICreateProject = initialState, action:any): ICreateProject => {
    switch (action.type){
        case createProject_Duplicacy:
            return{
                ...state,
                projectId:null,
                organizationId:null,
                documentId:null,
                projectName:null,
                projectDescription:null,
                createProject_InProgress:false,
                createProject_Success:false,
                createProject_Error:null,
                nameIsDuplicate: action.payload

            }
        case createProject_InProgress:
            return{
                ...state,
                projectId:null,
                organizationId:null,
                documentId:null,
                projectName:null,
                projectDescription:null,
                createProject_InProgress:true,
                createProject_Success:false,
                createProject_Error:null,
                nameIsDuplicate:null
            }
        case createProject_Success:
            return{
                ...state,
                projectId:action.payload.id,
                documentId:action.payload.id,
                organizationId:action.payload.organizationId,
                projectName:action.payload.name,
                projectDescription:action.payload.description,
                createProject_InProgress:false,
                createProject_Success:true,
                createProject_Error:null,
            }
        case setProjectNameDuplicacyToNull:
            return{
                ...state,
                nameIsDuplicate:null
            }
        case createProject_Fail:
            return{
                ...state,
                projectId:null,
                projectName:null,
                documentId:null,
                projectDescription:null,
                organizationId:null,
                createProject_InProgress:false,
                createProject_Success:false,
                createProject_Error:action.payload,
                nameIsDuplicate: null
            }
        default:
            return state
    }
}

export default CreateProject