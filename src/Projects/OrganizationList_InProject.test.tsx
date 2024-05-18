import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OrganizationList_InProject from './OrganizationList_InProject';
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
const initialState = {
  ProjectReducer: {
    organizationList:orgDetails,
    projectsList:projDetails,
    servicesList:serviceDetails,
    usersList:projDetails,
    projectObj:null,
    organizationObj:null,
    projectFetchInProgress:false,
    organizationNamesFetch_InProgress:false,
    fetchingProjectDetailsSuccess:false,
    fetchingProjectDetailsProgress:false,
    organizationNamesFetch_Success:true,
    projectFetchSuccess:true,
    projectUpdateInProgress:false,
    projectUpdateSuccess:false,
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

describe('<OrganizationList_InProject />', () => {
  it('renders without crashing', () => {
    const { container,getByText,queryByText } = render(
      <Provider store={store}>
        <OrganizationList_InProject  />
      </Provider>
    );
    
    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Organization/);
    // expect(getByText(/Project/)).toBeInTheDocument();
    expect(screen.getByText('Test abc Name')).toBeInTheDocument();

  });

  it('renders all tabs and switches correctly', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <OrganizationList_InProject  />
      </Provider>
    );

    // Check if all tabs are rendered
    expect(getByText('Project Info')).toBeInTheDocument();
    expect(getByText('Services')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();

    // Click on the Services tab and check if its content is displayed
    fireEvent.click(getByText('Services'));
    // Add checks for content inside the Services tab, for example:
    expect(queryByText('Services List')).toBeInTheDocument();

    // Similarly, test for Users tab
    fireEvent.click(getByText('Users'));
    expect(queryByText('Users List')).toBeInTheDocument();

  });
  
});
