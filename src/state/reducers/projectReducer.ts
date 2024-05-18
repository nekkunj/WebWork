import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addProjectAdmin_Fail, setProjectDetailsSucessToFalse,deleteProject_InProgress,fetchingOrganizationNames_InProgress,addProjectAdmin_Duplicacy,deleteProject_Success,deleteProject_Fail,addProjectAdmin_InProgress, addProjectAdmin_Success, deletingProjectAdmin_Fail, deletingProjectAdmin_InProgress, deletingProjectAdmin_Success, fetchingProjectDetails_Fail, fetchingProjectDetails_InProgress, fetchingProjectDetails_Success, updateProjectDetails_Fail, updateProjectDetails_InProgress, updateProjectDetails_Success, updateProjectServiceDetailsFail, updateProjectServiceDetailsSuccess, updatingProjectServiceDetails, fetchingOrganizationNames_Success, fetchingOrganizationNames_GeneralUser_Success, fetchingProjectDetails_GeneralUser_InProgress, fetchingProjectDetails_GeenralUser_Success, setServiceList_SuperAdmin } from '../action-types/projectActionType'
interface IProjectReducer{
    organizationList:object[] | null,
    projectsList:object[] | null,
    servicesList:object[] | null,
    usersList:object [] | null,
    projectObj:any | null,
    organizationObj:any | null,
    organizationNamesFetch_InProgress:boolean,
    organizationNamesFetch_Success:boolean,
    projectFetchInProgress:boolean,
    projectFetchSuccess:boolean,
    projectUpdateInProgress:boolean,
    projectUpdateSuccess:boolean,
    fetchError:string | null,
    updateError:string | null,
    deleteProjectSuccess:boolean,
    deleteProjectProgress:boolean,
    fetchingProjectDetailsSuccess:boolean,
    fetchingProjectDetailsProgress:boolean,
    deleteProject_Error:string | null,
    duplicacy:null | boolean,
    newEmail:string | null
}

const initialState:IProjectReducer={
    organizationList:null,
    projectsList:null,
    organizationObj:null,
    servicesList:null,
    usersList:null,
    projectObj:null,
    organizationNamesFetch_InProgress:false,
    organizationNamesFetch_Success:false,
    projectFetchInProgress:false,
    projectFetchSuccess:false,
    projectUpdateInProgress:false,
    projectUpdateSuccess:false,
    fetchingProjectDetailsSuccess:false,
    fetchingProjectDetailsProgress:false,
    fetchError:null,
    updateError:null,
    deleteProjectSuccess:false,
    deleteProjectProgress:false,
    deleteProject_Error: null,
    duplicacy:null,
    newEmail:null

}



const ProjectReducer = (state: IProjectReducer = initialState, action:any): IProjectReducer => {
    switch (action.type){
        case fetchingOrganizationNames_InProgress:
            return{
                ...state,
                organizationNamesFetch_InProgress:true,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:false,
                organizationList:null,
                projectsList:null,
                servicesList:null,
                usersList:null,
                projectObj:null,
                organizationObj:null,
                projectFetchSuccess:false,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectUpdateInProgress:false,
                projectUpdateSuccess:false,
                deleteProjectSuccess:false,
                deleteProject_Error:null,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchingProjectDetails_InProgress:
            return{
                ...state,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:true,
                projectsList:null,
                organizationObj:null,
                projectFetchSuccess:false,
                projectUpdateInProgress:false,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectUpdateSuccess:false,
                deleteProjectSuccess:false,
                deleteProject_Error:null,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchingOrganizationNames_Success:
            return{
                ...state,
                projectFetchInProgress:false,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:true,
                organizationList:action.organizationList,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectFetchSuccess:false,
                projectUpdateInProgress:false,
                projectUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null

            }
        case fetchingProjectDetails_Success:
            return{
                ...state,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:false,
                projectsList:action.projectsList,
                organizationObj:action.organizationObj,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectFetchSuccess:true,
                projectUpdateInProgress:false,
                projectUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null

            }
        case fetchingProjectDetails_Fail:
            return{
                ...state,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:false,
                projectsList:null,
                organizationObj:null,
                organizationList:null,
                servicesList:null,
                usersList:null,
                projectObj:null,
                projectFetchSuccess:false,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectUpdateInProgress:false,
                projectUpdateSuccess:false,
                fetchError:action.payload,
                updateError:null,
                duplicacy:null                
            }
        case fetchingOrganizationNames_GeneralUser_Success:
            return{
                ...state,
                projectFetchInProgress:false,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:true,
                organizationList:action.organizationList,
                projectsList:action.projectList,
                projectFetchSuccess:false,
                projectUpdateInProgress:false,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:false,
                projectUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null

        }
        case fetchingProjectDetails_GeneralUser_InProgress:
            return{
                ...state,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:false,
                servicesList:null,
                usersList:null,
                projectObj:null,
                projectFetchSuccess:false,
                projectUpdateInProgress:false,
                fetchingProjectDetailsSuccess:false,
                fetchingProjectDetailsProgress:true,
                projectUpdateSuccess:false,
                deleteProjectSuccess:false,
                deleteProject_Error:null,
                fetchError:null,
                updateError:null,
                duplicacy:null
            }
        case fetchingProjectDetails_GeenralUser_Success:
            return{
                ...state,
                organizationNamesFetch_InProgress:false,
                organizationNamesFetch_Success:false,
                projectFetchInProgress:false,
                projectObj:action.projectObj,
                servicesList:action.serviceList,
                usersList:action.usersList,
                fetchingProjectDetailsSuccess:true,
                fetchingProjectDetailsProgress:false,
                projectFetchSuccess:false,
                projectUpdateInProgress:false,
                projectUpdateSuccess:false,
                fetchError:null,
                updateError:null,
                duplicacy:null

            }
            case setServiceList_SuperAdmin:
                return{
                    ...state,
                    servicesList:action.serviceList,
                }
            case setProjectDetailsSucessToFalse:
                return{
                    ...state,
                    projectFetchSuccess:false,
                }
            case updateProjectDetails_InProgress:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateInProgress:true,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:null,
                    duplicacy:null                    
                }
            case updateProjectDetails_Success:
                    let updatedObjects:object[] | null=null
                    if(state.projectsList){
                    updatedObjects = state.projectsList.map((obj:any) =>
                        obj.id === action.projectObj.id ? action.projectObj : obj
                    );
                    }
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectsList:updatedObjects,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateSuccess:true,
                    fetchError:null,
                    updateError:null,
                    duplicacy:null                      
                }
            case updateProjectDetails_Fail:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }
            case updatingProjectServiceDetails:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:true,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:null                    
                }
            case updateProjectServiceDetailsSuccess:
                    let serviceObject:object[] | null=null
                    if(state.servicesList){
                        serviceObject = state.servicesList.map((obj:any) =>
                            obj.id === action.servicesObj.id ? action.servicesObj : obj
                        );
                    }
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    servicesList:serviceObject,
                    projectFetchSuccess:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateInProgress:false,
                    projectUpdateSuccess:true,
                    fetchError:null,
                    updateError:null                       
                }
            case updateProjectServiceDetailsFail:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }
            case addProjectAdmin_InProgress:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:true,
                    projectUpdateSuccess:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    fetchError:null,
                    updateError:null                    
                }
            case addProjectAdmin_Success:
                    let userObject:object[] | null=null
                    if(state.usersList)
                        userObject=[...state.usersList,action.payload]
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    usersList:userObject,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    projectUpdateSuccess:true,
                    fetchError:null,
                    updateError:null,
                }
            case addProjectAdmin_Fail:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload,
                    duplicacy:null
                }
            case addProjectAdmin_Duplicacy:
                return{
                    ...state,
                    duplicacy:action.payload,
                    newEmail:action.newEmail
                }
            case deletingProjectAdmin_InProgress:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateInProgress:true,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:null    
                }
            case deletingProjectAdmin_Success:
                let filteredUsers=state.usersList
                if(state.usersList)
                     filteredUsers = state.usersList.filter((user:any) => user.id !== action.payload);
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    usersList:filteredUsers,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    projectUpdateSuccess:true,
                    fetchError:null,
                    updateError:null    
                }       
            case deletingProjectAdmin_Fail:
                return{
                    ...state,
                    organizationNamesFetch_InProgress:false,
                    organizationNamesFetch_Success:false,
                    projectFetchInProgress:false,
                    projectFetchSuccess:false,
                    projectUpdateInProgress:false,
                    fetchingProjectDetailsSuccess:false,
                    fetchingProjectDetailsProgress:false,
                    projectUpdateSuccess:false,
                    fetchError:null,
                    updateError:action.payload    
                }                             
            case deleteProject_InProgress:
                return{
                    ...state,
                    deleteProjectSuccess:false,
                    deleteProjectProgress:true,
                    deleteProject_Error: null,
                }    
            case deleteProject_Success:
                let filteredProject=state.projectsList
                if(state.organizationList)
                filteredProject = state.organizationList.filter((org:any) => org.id !== action.payload);
                return{
                    ...state,
                    deleteProjectSuccess:true,
                    deleteProjectProgress:false,
                    projectsList:filteredProject,
                    deleteProject_Error: null,
                }    
            case deleteProject_Fail:
                return{
                    ...state,
                    deleteProjectSuccess:false,
                    deleteProjectProgress:false,
                    deleteProject_Error:action.payload,
                }                     
        default:
            return state
    }
}

export default ProjectReducer