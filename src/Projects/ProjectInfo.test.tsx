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
const initialState = {
    ProjectReducer: {
      organizationList:null,
      projectsList:null,
      organizationObj:null,
      servicesList:null,
      usersList:null,
      projectObj:null,
      projectFetchInProgress:false,
      organizationNamesFetch_InProgress:false,
      organizationNamesFetch_Success:false,
      projectFetchSuccess:false,
      projectUpdateInProgress:false,
      projectUpdateSuccess:false,
      fetchError:null,
      updateError:null,
      deleteProjectSuccess:false,
      deleteProjectProgress:false,
      fetchingProjectDetailsSuccess:false,
      fetchingProjectDetailsProgress:false,
      deleteProject_Error: null,
      duplicacy:null,
      newEmail:null
    },
  };

// Mock Redux store setup
const store = createStore(rootReducer, initialState);

describe('<OrganizationInfo />', () => {
  const projDetails:any={
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
  }
  const mockProps = {
    orgId: "1",
    orgName:"Test abc Name",
    projectNames: projDetails,
    serviceNames: [],
    userNames: [],
    projectId: 'doc123',
    fetchData: jest.fn()
  };

  it('renders without crashing', () => {
    const { getByText,queryByText } = render(
      <Provider store={store}>
        <ProjectInfo {...mockProps} />
      </Provider>
    );
    
    expect(queryByText('Test Pro')).not.toBeInTheDocument();
    expect(getByText('Test Project Name')).toBeInTheDocument();

  });

  it('renders all tabs and switches correctly', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <ProjectInfo {...mockProps} />
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
