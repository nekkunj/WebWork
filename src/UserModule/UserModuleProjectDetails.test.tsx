import React from 'react';
import { render, fireEvent,screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserModuleProjectDetails from './UserModuleProjectDetails';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { Provider } from 'react-redux';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
const orgDetails:any=[{
  id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  name: "Test abc Name",
  description:"Test Description",
  isOrganizationActive: true,
  createdOn: "2023-10-05T15:42:37.130Z",
  modifiedOn: "2023-10-05T15:42:40.210Z",
}]
const projDetails:any=[{
id:"123",
name: "Test Project Name",
description:"Test Description",
isProjectActive: true,
createdOn: "2023-10-05T15:42:37.130Z",
updatedOn: "2023-10-05T15:42:40.210Z",
services: [
  {
    id:"890",
    name: "Test Service Name",
    description:"Test Description",
    isProjectActive: true,
    url:"https://test.com",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }
],
projectUsers:[{
  userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  userEmail:'test@abc.com',
  roleName:"ProjectAdmin",
  projectId: "123",
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
}]
}]
const serviceDetails:any=[{
id:"890",
name: "Test Service Name",
description:"Test Description",
isProjectActive: true,
url:"https://test.com",
createdOn: "2023-10-05T15:42:37.130Z",
updatedOn: "2023-10-05T15:42:40.210Z",
}]
const projectUsers:any=[{
  userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  userEmail:'test@abc.com',
  roleName:"ProjectAdmin",
  projectId: "123",
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
}]
const initialState = {
  ProjectReducer: {
    organizationList:orgDetails,
    projectsList:projDetails,
    organizationObj:null,
    servicesList:serviceDetails,
    projectObj:projDetails[0],
    usersList:projectUsers,
    projectFetchInProgress:false,
    projectFetchSuccess:true,
    projectUpdateInProgress:false,
    organizationNamesFetch_InProgress:false,
    organizationNamesFetch_Success:false,
    fetchingProjectDetailsSuccess:false,
    fetchingProjectDetailsProgress:false,
    projectUpdateSuccess:false,
    fetchError:null,
    updateError:null,
    deleteProjectSuccess:false,
    deleteProjectProgress:false,
    deleteProject_Error: null,
    duplicacy:null,
    newEmail:null
  },
  RoleReducer: {
    role:null,
    allRoles:[{roleName:"OrganizationAdmin",organizationId:'b9005fb2-cbb1-4f1e-a925-36090700327e'}],
    roleFetch_Error:null,
    userRoleInProgress:false
}
  };

// Mock Redux store setup
const store = createStore(rootReducer, initialState);

describe('<UserModuleProjectDetails />', () => {
  it('renders without crashing', () => {
    const { container,getByText,queryByText } = render(
      <Provider store={store}>
        <UserModuleProjectDetails  userId={"bcd"} userEmail={'test@abc.com'}/>
      </Provider>
    );
    
    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Organization/);
    // expect(getByText(/Project/)).toBeInTheDocument();
    // expect(screen.getByText(/Test abc Name/i)).toBeInTheDocument();

  });

  it('renders all tabs and switches correctly', async () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <UserModuleProjectDetails  userId={"bcd"} userEmail={'test@abc.com'}/>
      </Provider>
    );

    // Check if all tabs are rendered
    expect(getByText('Organization Info')).toBeInTheDocument();
    expect(getByText('Project Info')).toBeInTheDocument();
    expect(getByText('Services')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();

    fireEvent.click(getByText('Organization Info'));
    // await waitFor(() => {
    //   expect(queryByText(/Organization Details/i)).toBeInTheDocument();
    //   })
    fireEvent.click(getByText('Services'));
    expect(queryByText('Services List')).toBeInTheDocument();


  });
  
});
