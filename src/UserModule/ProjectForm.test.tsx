import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProjectForm from './ProjectForm';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { updatingProjectDetailsAPI } from '../state/new actions/projectAction';

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
  jest.mock('../state/new actions/projectAction', () => ({
    ...jest.requireActual('../state/new actions/projectAction'),
    updatingProjectDetailsAPI: jest.fn(), 
    }));
// Mock Redux store setup
const store = createStore(rootReducer, initialState);


describe('ProjectForm />', () => {
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
  it('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProjectForm userRole={"Project Admin"}   data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );
    expect(getByText(/Project Details/i)).toBeInTheDocument(); 
    expect(screen.getByDisplayValue(/Test Project Name/i)).toBeInTheDocument();
    expect(getByText(/Test Description/i)).toBeInTheDocument();

  });


  it('Reader Writer access', () => {
    const { getByText,getByLabelText,queryByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"Reader"}   data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );
    expect(getByText(/Project Details/i)).toBeInTheDocument(); 
    expect(screen.getByDisplayValue(/Test Project Name/i)).toBeInTheDocument();
    expect(getByText(/Test Description/i)).toBeInTheDocument();
    const descriptionInput = getByLabelText(/Description/i);
    fireEvent.input(descriptionInput, { target: { value: 'Updated Description' } });
    expect(queryByRole('button', { name: /Create/i })).not.toBeInTheDocument();
 
  });

  it('submits form data correctly', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"OrganizationAdmin"}   data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    const descriptionInput = getByLabelText(/Description/i);
    fireEvent.input(descriptionInput, { target: { value: 'Updated Description' } });
    // fireEvent.click(getByRole('switch'));

    // Check if the Save button is now visible
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /Save/i }));
    await waitFor(() => {
        expect(updatingProjectDetailsAPI).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything()); 
    })
  });

  it('cannot submits form projectadmin', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"Project Admin"}   data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    const descriptionInput = getByLabelText(/Description/i);
    fireEvent.input(descriptionInput, { target: { value: 'Updated Description' } });
    // fireEvent.click(getByRole('switch'));

    // Check if the Save button is now visible
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();

    // fireEvent.click(getByRole('button', { name: /Save/i }));
    await waitFor(() => {
        expect(updatingProjectDetailsAPI).not.toHaveBeenCalled();
    })
  });
  it('submit form on status change for OrganizationAdmin', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"OrganizationAdmin"}   data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925" />
      </Provider>
    );
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    fireEvent.click(getByRole('switch'));

    // Check if the Save button is now visible
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /Save/i }));
    await waitFor(() => {
        expect(updatingProjectDetailsAPI).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything()); 
    })
  });


  it('toggles save button visibility on edit', () => {
    const { getByLabelText, queryByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"OrganizationAdmin"}  data={projDetails} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );

    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();

    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'New Description' } });
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();
  });



  it('creates form when no data', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm userRole={"OrganizationAdmin"}   data={{}} orgId="1" projectId="b9005fb2-cbb1-4f1e-a925"  />
      </Provider>
    );
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: /Create/i })).toBeInTheDocument();
    const descriptionInput = getByLabelText(/Description/i);
    fireEvent.input(descriptionInput, { target: { value: 'Updated Description' } });
    // fireEvent.click(getByRole('switch'));

    // Check if the Save button is now visible
    expect(queryByRole('button', { name: /Create/i })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /Create/i }));
    // await waitFor(() => {
    //     expect(updatingProjectDetailsAPI).toHaveBeenCalledWith(expect.anything()); 
    // },{timeout:3000})
  });

});
