import { combineReducers } from "redux";
import RoleReducer from "./userRole"
import ServiceReducer from "./serviceReducer";
import FetchServiceReducer from './fetchServiceReducer'
import OrganizationFetchReducer from "./organizationFetchReducer"
import UnassignedServicesReducer from "./unassignedServicesReducer";
import AssignServicesReducer from "./assignServiceReducer";
import CreateOrganization from "./createOrganization";
import UserManagementReducer from "./userManagementReducer"
import CreateProject from "./createProjectReducer"
import ProjectReducer from "./projectReducer"
import DashboardReducer from "./dashboardReducer"

const reducers = combineReducers({
   RoleReducer,
   ServiceReducer,
   OrganizationFetchReducer,
   UnassignedServicesReducer,
   AssignServicesReducer,
   CreateOrganization,
   UserManagementReducer,
   FetchServiceReducer,
   CreateProject,
   ProjectReducer,
   DashboardReducer
   
})

export default reducers

export type RootState = ReturnType<typeof reducers>