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
        organizationNamesFetch_InProgress:false,
        organizationNamesFetch_Success:false,
        projectFetchSuccess:false,
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
  jest.mock('../state/new actions/projectAction', () => ({
    ...jest.requireActual('../state/new actions/projectAction'),
    updatingProjectDetailsAPI: jest.fn(), 
    }));
// Mock Redux store setup
const store = createStore(rootReducer, initialState);


describe('<ProjectForm orgId={"098"} />', () => {
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
  it('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ProjectForm orgId={"098"}  data={projDetails} projectId={"123"}  />
      </Provider>
    );
    expect(getByText(/Project Details/i)).toBeInTheDocument(); 
    expect(screen.getByDisplayValue(/Test Project Name/i)).toBeInTheDocument();
    expect(getByText(/Test Description/i)).toBeInTheDocument();

  });

  it('submits form data correctly', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm orgId={"098"}  data={projDetails} projectId={"123"}  />
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

  it('submit form on status change', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm orgId={"098"}  data={projDetails} projectId={"123"} />
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
        <ProjectForm orgId={"098"} data={projDetails} projectId={"123"}  />
      </Provider>
    );

    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();

    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'New Description' } });
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();
  });



  it('creates form when no data', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <ProjectForm orgId={"098"}  data={{}} projectId={"123"}  />
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
