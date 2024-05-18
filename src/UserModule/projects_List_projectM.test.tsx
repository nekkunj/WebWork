import React from 'react';
import { render, fireEvent,screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectsListProjectM from './projects_List_projectM';
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
}]
const projDetails:any=[{
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  id:"123",
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
    servicesList:serviceDetails,
    organizationObj:null,
    usersList:projectUsers,
    projectObj:projDetails[0],
    projectFetchInProgress:false,
    organizationNamesFetch_InProgress:false,
    organizationNamesFetch_Success:false,
    projectFetchSuccess:true,
    projectUpdateInProgress:false,
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
  OrganizationFetchReducer:{
    organizationList:null,
    servicesList:null,
    deletorganizationSuccess:false,
    usersList:null,
    organizationFetchInProgress:false,
    organizationFetchSuccess:false,
    service_User_DetailsFetchInProgress:false,
    service_User_DetailsFetchInSuccess:false,
    organizationUpdateInProgress:false,
    organizationUpdateSuccess:false,
    deletorganizationProgress:false,
    fetchError:null,
    updateError:null,
    deletorganization_Error:null,
    duplicacy:null,
    newEmail:null
}
  };

const store = createStore(rootReducer, initialState);

describe(' General User <ProjectsListProjectM />', () => {
    const mockProps = {
        orgId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
        organizationDetails: orgDetails,
        allRoles:[{roleName:'OrganizationAdmin',organizationId:'b9005fb2-cbb1-4f1e-a925-36090700327e'}],
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
    expect(getByText('Organization Info')).toBeInTheDocument();
    expect(getByText('Project Info')).toBeInTheDocument(); 
    expect(getByText('Services')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();
    expect(getByText('Organization Info')).toBeInTheDocument();

    // fireEvent.click(getByText('Organization Info'));
    // expect(queryByText(/Test abc Name/i)).toBeInTheDocument();

    fireEvent.click(getByText('Services'));
    expect(queryByText('Services List')).toBeInTheDocument();
 
  });

 
  it('renders when there is no project', async () => {
    const props = {
        orgId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
        organizationDetails: orgDetails,
        allRoles:[{roleName:'OrganizationAdmin',organizationId:'b9005fb2-cbb1-4f1e-a925-36090700327e'}],
        fetchData: jest.fn()  
    };
    const { container,getByText,queryByText,getAllByText } = render(
      <Provider store={store}>
        <ProjectsListProjectM  {...props} />
      </Provider>
    );
    

    expect(getByText('Organization Info')).toBeInTheDocument();
    const testProjectNames = getAllByText(/Project/);
    expect(testProjectNames.length).toBeGreaterThanOrEqual(1);
    expect(getByText('Users')).toBeInTheDocument();

    fireEvent.click(getByText('Organization Info'));
    // await waitFor(() => {
    // expect(queryByText(/Organization Details/i)).toBeInTheDocument();
    // })
    fireEvent.click(getByText('Services'));
    expect(queryByText('Services List')).toBeInTheDocument();

  });
  
});


