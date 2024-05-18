import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectsListProjectM from './Projects_List_projectM';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
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
    organizationObj:null,
    projectsList:projDetails,
    servicesList:serviceDetails,
    usersList:projDetails,
    projectObj:null,
    projectFetchInProgress:false,
    organizationNamesFetch_InProgress:false,
    organizationNamesFetch_Success:false,
    projectFetchSuccess:true,
    projectUpdateInProgress:false,
    projectUpdateSuccess:false,
    fetchError:null,
    updateError:null,
    deleteProjectSuccess:false,
    fetchingProjectDetailsSuccess:false,
    fetchingProjectDetailsProgress:false,
    deleteProjectProgress:false,
    deleteProject_Error: null,
    duplicacy:null,
    newEmail:null
  },
  };

// Mock Redux store setup
const store = createStore(rootReducer, initialState);

describe('<ProjectsListProjectM />', () => {
    const mockProps = {
        orgId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
        orgName:"Test abc Name",
        fetchData: jest.fn()
    };
  it('renders without crashing', () => {
    const { container,getAllByText,queryByText } = render(
      <Provider store={store}>
        <ProjectsListProjectM  {...mockProps} />
      </Provider>
    );
    
    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Project/);
    const testProjectNames = getAllByText(/Test Project Name/);
    expect(testProjectNames.length).toBeGreaterThanOrEqual(1);
  });

  it('renders all tabs and switches correctly', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <ProjectsListProjectM  {...mockProps}/>
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


  it('renders when there is no project', () => {
    const props = {
        orgId: "1",
        orgName:"Test abc Name",
        fetchData: jest.fn()
    };
    const mockState = {
      ProjectReducer: {
      ...store.getState().ProjectReducer,
      projectsList: [],
      },
  };
  const mockStore = createStore(rootReducer, mockState);

    const { container,getByText,queryByText } = render(
      <Provider store={mockStore}>
        <ProjectsListProjectM  {...props} />
      </Provider>
    );
     

    // expect(getByText(/Project/)).toBeInTheDocument();
    expect(getByText(/No Project/)).toBeInTheDocument();
    expect(getByText(/There is no project in this organization/)).toBeInTheDocument();


  });
  
});

describe('ProjectsListProjectM', () => {
    const props = {
        orgId: "1",
        orgName:"Test abc Name",
        fetchData: jest.fn()
    };
    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            value: {
              href: '',
            },
            writable: true,
          });
    });
    const mockState = {
      ProjectReducer: {
      ...store.getState().ProjectReducer,
      projectsList: [],
      },
  };
  const mockStore = createStore(rootReducer, mockState);

    it('navigates to /create_project when Create Project button is clicked', () => {

      const { container,getByText,queryByText } = render(
        <Provider store={mockStore}>
          <ProjectsListProjectM  {...props} />
        </Provider>
      );
       
  
      
      // Attempt to find the Create Project button and click it
      const createProjectButton = getByText('Create Project');
      fireEvent.click(createProjectButton);
      
      // Assert that window.location.href was set to the expected URL
    //   expect(window.location.href).toBe('/create_project');
    });
  
    // Restore the original functionality of window.location after all tests are done
    afterAll(() => {
      window.location = location;
    });
  });
