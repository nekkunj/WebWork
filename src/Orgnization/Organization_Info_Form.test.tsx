import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Organization_Info_Form from './Organization_Info_Form';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { updatingOrganizationDetailsAPI } from '../state/new actions/organizationAction';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
const initialState = {
    OrganizationFetchReducer: {
        organizationList:null,
        servicesList:null,
        service_User_DetailsFetchInProgress:false,
        service_User_DetailsFetchInSuccess:false,
        deletorganizationSuccess:false,
        usersList:null,
        organizationFetchInProgress:false,
        organizationFetchSuccess:false,
        organizationUpdateInProgress:false,
        organizationUpdateSuccess:false,
        deletorganizationProgress:false,
        fetchError:null,
        updateError:null,
        deletorganization_Error:null,
        duplicacy:null,
        newEmail:null
    },
  };
  jest.mock('../state/new actions/organizationAction', () => ({
    ...jest.requireActual('../state/new actions/organizationAction'),
    updatingOrganizationDetailsAPI: jest.fn(), 
    }));
// Mock Redux store setup
const store = createStore(rootReducer, initialState);


describe('<Organization_Info_Form />', () => {
    const orgDetails:any={
      id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
      name: "Test Organization Name",
      description:"Test Description",
      isOrganizationActive: true,
      services: [],
      organizationAdmins: [],
      createdOn: "2023-10-05T15:42:37.130Z",
      updatedOn: "2023-10-05T15:42:40.210Z",
    }
  it('renders without crashing', () => {
    const { getByText,getByDisplayValue } = render(
      <Provider store={store}>
        <Organization_Info_Form orgId={"1"} organizationDetails={orgDetails} fetchData={jest.fn()} />
      </Provider>
    );
    expect(getByText(/Organization Details/i)).toBeInTheDocument(); 
    expect(getByText(/Test Description/i)).toBeInTheDocument();

  });

  it('submits form data correctly', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <Organization_Info_Form orgId={"1"} organizationDetails={orgDetails}  fetchData={jest.fn()} />
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
        expect(updatingOrganizationDetailsAPI).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything()); 
    })
  });

  it('submit form on status change', async () => {
    const { getByLabelText, queryByRole,getByRole } = render(
      <Provider store={store}>
        <Organization_Info_Form orgId={"1"} organizationDetails={orgDetails}  fetchData={jest.fn()} />
      </Provider>
    );
    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
    fireEvent.click(getByRole('switch'));

    // Check if the Save button is now visible
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /Save/i }));
    await waitFor(() => {
        expect(updatingOrganizationDetailsAPI).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything()); 
    })
  });


  it('toggles save button visibility on edit', () => {
    const { getByLabelText, queryByRole } = render(
      <Provider store={store}>
        <Organization_Info_Form orgId={"1"} organizationDetails={orgDetails}  fetchData={jest.fn()} />
      </Provider>
    );

    expect(queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();

    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'New Description' } });
    expect(queryByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

});
