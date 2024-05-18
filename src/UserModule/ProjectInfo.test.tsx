import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectInfo from './ProjectInfo';
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
const projDetails:any={
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  projectId:"123",
  name: "Test Project Name",
  description:"Test Description",
  isProjectActive: true,
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
  services:[{
    id:"890",
    name: "Test Service Name",
    description:"Test Description",
    isProjectActive: true,
    url:"https://test.com",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }],
  projectUsers:[{
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    userEmail:'test@abc.com',
    roleName:"ProjectAdmin",
    projectId: "123",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
}
const initialState = {
    ProjectReducer: {
      organizationList:null,
      projectsList:null,
      servicesList:null,
      organizationObj:null,
      usersList:null,
      projectObj:projDetails,
      projectFetchInProgress:false,
      projectFetchSuccess:false,
      organizationNamesFetch_InProgress:false,
      organizationNamesFetch_Success:false,
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
    },
  };

// Mock Redux store setup
const store = createStore(rootReducer, initialState);

describe('UserModule <ProjectInfo />', () => {
  const orgDetails:any={
    id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    name: "Test abc Name",
    description:"Test Description",
    isOrganizationActive: true,
    createdOn: "2023-10-05T15:42:37.130Z",
    modifiedOn: "2023-10-05T15:42:40.210Z",
  }
  const projectUsers:any=[{
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    userEmail:'test@abc.com',
    roleName:"ProjectAdmin",
    projectId: "123",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
  const services:any=[{
    id:"890",
    name: "Test Service Name",
    description:"Test Description",
    isProjectActive: true,
    url:"https://test.com",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
  const mockProps = {
    orgId: "1",
    projectId: "b9005fb2-cbb1-4f1e-a925",
    organizationDetails:orgDetails,
    servicesList:services,
    usersList:projectUsers,
    documentId: 'PROJECT#b9005fb2-cbb1-4f1e-a925',
    fetchData: jest.fn(),
    userRole:"OrganizationAdmin",
  };
  const mockProps_generalUSer = {
    orgId: "1",
    projectId: "b9005fb2-cbb1-4f1e-a925",
    organizationDetails:orgDetails,
    servicesList:services,
    usersList:projectUsers,
    documentId: 'PROJECT#b9005fb2-cbb1-4f1e-a925',
    fetchData: jest.fn(),
    userRole:"ProjectAdmin",
  };


  it('renders without crashing OrganizationAdmin', () => {
    const { getByText,queryByText } = render(
      <Provider store={store}>
        <ProjectInfo {...mockProps} />
      </Provider>
    );
    
    expect(queryByText('Test Pro')).not.toBeInTheDocument();
    expect(getByText('Organization Info')).toBeInTheDocument();

  });
  it('renders without crashing GeneralUser', () => {
    const { getByText,queryByText } = render(
      <Provider store={store}>
        <ProjectInfo {...mockProps_generalUSer} />
      </Provider>
    );
    
    expect(queryByText('Test Pro')).not.toBeInTheDocument();
    expect(getByText('Project Info')).toBeInTheDocument();

  });
  it('renders all tabs and switches correctly', () => {
    const { getByText, queryAllByText,queryByText } = render(
      <Provider store={store}>
        <ProjectInfo {...mockProps} />
      </Provider>
    ); 

    // Check if all tabs are rendered
    
    expect(getByText(/Organization Info/i)).toBeInTheDocument();
    expect(getByText('Project Info')).toBeInTheDocument();
    expect(getByText('Services')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();

    // Click on the Services tab and check if its content is displayed
    fireEvent.click(getByText('Users'));
    // Add checks for content inside the Services tab, for example:
    const elements = queryAllByText('Users List');
    expect(elements.length).toBeGreaterThan(0);

    // Similarly, test for Users tab
    fireEvent.click(getByText('Project Info'));
    expect(queryByText('Project Details')).toBeInTheDocument();

  });
});
 