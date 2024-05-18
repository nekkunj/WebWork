import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Organization_Form from './Organization_Form';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers';
import {createOrganization} from '../../state/new actions/organizationAction';
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
// Mock the UUID function
jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('1234')
  };
});
jest.mock('../../state/new actions/organizationAction', () => ({
    ...jest.requireActual('../../state/new actions/organizationAction'),
    createOrganization: jest.fn(), 
    updatingOrganizationDetailsAPI:jest.fn()
}));
// Create a mock Redux store
const initialState = {
  CreateOrganization: {
    organizationId:null,
    documentId:null,
    organizationName:null,
    organizationDescription:null,
    createOrganization_InProgress:false,
    createOrganization_Success:false,
    createOrganization_Error:null,
    nameIsDuplicate:false
  },
};
const store = createStore(rootReducer, initialState);

describe('<Organization_Form />', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Organization_Form nextStep={jest.fn()} />
      </Provider>
    );
    expect(screen.queryByText('* Organization Name should be unique')).not.toBeInTheDocument();
    expect(getByText(/Name Your Organization/i)).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    const { getByText, getByRole } = render(
      <Provider store={store}>
        <Organization_Form nextStep={jest.fn()} />
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(getByText(/Please enter organization name!/i)).toBeInTheDocument();
      expect(getByText(/Please enter organization description!/i)).toBeInTheDocument();
      expect(screen.queryByText('* Organization Name should be unique')).not.toBeInTheDocument();

    });
  });

  it('submits form data correctly', async () => {
    const mockNextStep = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <Organization_Form nextStep={mockNextStep} />
      </Provider>
    );

    fireEvent.input(getByLabelText(/Organization Name/i), { target: { value: 'Test Organization' } });
    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    fireEvent.click(getByRole('button', { name: /Next/i }));
    expect(screen.queryByText('* Organization Name should be unique')).not.toBeInTheDocument();


  });
 
  it('displays duplicate name error message when nameIsDuplicate is true', () => {
    // Update the store to simulate duplicate name
    store.dispatch({ type: 'createOrganization_Duplicacy', payload: true });

    const { getByText } = render(
      <Provider store={store}>
        <Organization_Form nextStep={jest.fn()} />
      </Provider>
    );
    expect(screen.queryByText('* Organization Name should be unique')).toBeInTheDocument();
    expect(getByText('* Organization Name should be unique')).toBeInTheDocument();

  });

 
  // it('calls nextStep with form data on successful submission', async () => {
  //   // store.dispatch({ type: 'createOrganization_Duplicacy', payload: false });
  //   const mock_store = createStore(rootReducer, initialState);
  //   const mockNextStep = jest.fn();
  //   const { getByLabelText, getByRole,getByText } = render(
  //     <Provider store={mock_store}>
  //       <Organization_Form nextStep={mockNextStep} />
  //     </Provider>
  //   );
  //   fireEvent.input(getByLabelText(/Organization Name/i), { target: { value: 'Test Organization' } });
  //   fireEvent.input(getByLabelText(/Description/i), { target: { value: 'Test Description' } });
  //   expect(getByText(/Next/i)).toBeInTheDocument();

  //   fireEvent.click(getByRole('button', { name: /Next/i }));

  //   await waitFor(() => {
  //     expect(createOrganization).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything()); 
  //   });
  // });

//   it('updates word count correctly', () => {
//     const { getByLabelText } = render(
//       <Provider store={store}>
//         <Organization_Form nextStep={jest.fn()} />
//       </Provider>
//     );

//     const input = getByLabelText(/Organization Name/i);
//     fireEvent.input(input, { target: { value: 'Test' } });

//     // Assuming you display the word count somewhere, verify it's updated correctly
//     // Example: expect(getByText('16/50')).toBeInTheDocument();
//     expect(getByLabelText('*16/50')).toBeInTheDocument();
//   });

});
