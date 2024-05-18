import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor,screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Project_Form from './Project_Form';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers';
import { createProject } from '../../state/new actions/projectAction';
import userEvent from '@testing-library/user-event';
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
jest.mock('../../state/new actions/projectAction', () => ({
    ...jest.requireActual('../../state/new actions/projectAction'),
    createProject: jest.fn(), 
}));
// Create a mock Redux store
const orgDetails:any=[{
    id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    name: "Test abc Name",
    description:"Test Description",
    isOrganizationActiveorganizationStatus: true,
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
},{
    id: "b9005fb2",
    name: "Second Organization",
    description:"Second Organization Description",
    isOrganizationActive: true,
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
}]
const initialState = {
  CreateProject: {
    projectId:null,
    organizationId:null,
    documentId:null,
    projectName:null,
    projectDescription:null,
    createProject_InProgress:false,
    createProject_Success:false,
    createProject_Error:null,
    nameIsDuplicate: null
  },
};
const store = createStore(rootReducer, initialState);

describe('<Project_Form />', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Project_Form nextStep={jest.fn()} organizationList={orgDetails}/>
      </Provider>
    );
    expect(screen.queryByText('* Project Name should be unique in an organization')).not.toBeInTheDocument();
    expect(getByText(/Name Your Project/i)).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    const { getByText, getByRole } = render(
      <Provider store={store}>
        <Project_Form nextStep={jest.fn()} organizationList={orgDetails}/>
      </Provider>
    );

    fireEvent.click(getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(getByText(/Please enter project name!/i)).toBeInTheDocument();
      expect(getByText(/Please enter project description!/i)).toBeInTheDocument();
      expect(getByText(/Please select any organization value !/i)).toBeInTheDocument();
      expect(screen.queryByText('* Project Name should be unique in an organization')).not.toBeInTheDocument();

    });
  });

  it('submits form data correctly', async () => {
    const mockNextStep = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <Project_Form nextStep={mockNextStep} organizationList={orgDetails}/>
      </Provider>
    );

    fireEvent.input(getByLabelText(/Project Name/i), { target: { value: 'Test Project' } });
    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'Test Description' } });

    const typeSelect = screen.getByLabelText('Organization');
    userEvent.click(typeSelect); 
    await waitFor(() => {
        const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        if (!dropdown) {
            throw new Error('Dropdown not found');
        }
        // Find all elements with the text 'Range'
        const allRangeOptions = within(dropdown).getAllByText('Second Organization');

        // Filter to find the specific element you want to click
        const targetRangeOption = allRangeOptions.find(option => 
            option.getAttribute('class') === 'ant-select-item-option-content'
        );

        if (!targetRangeOption) {
            throw new Error('Specific Range option not found');
        }

        // Click the specific Range option
        userEvent.click(targetRangeOption);
    });

 

    fireEvent.click(getByRole('button', { name: /Next/i }));
    expect(screen.queryByText('* Project Name should be unique in an organization')).not.toBeInTheDocument();
    expect(screen.queryByText(/Please enter project name!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please enter project description!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Please select any organization value !/i)).not.toBeInTheDocument();
  });

  it('displays duplicate name error message when nameIsDuplicate is true', () => {
    // Update the store to simulate duplicate name
    store.dispatch({ type: 'createProject_Duplicacy', payload: true });

    const { getByText } = render(
      <Provider store={store}>
        <Project_Form nextStep={jest.fn()} organizationList={orgDetails}/>
      </Provider>
    );
    expect(screen.queryByText('* Project Name should be unique in an organization')).toBeInTheDocument();
    expect(getByText('* Project Name should be unique in an organization')).toBeInTheDocument();

  });


  it('calls nextStep with form data on successful submission', async () => {
    const mockNextStep = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Provider store={store}>
        <Project_Form nextStep={mockNextStep} organizationList={orgDetails}/>
      </Provider>
    );
    fireEvent.input(getByLabelText(/Project Name/i), { target: { value: 'Test Project' } });
    fireEvent.input(getByLabelText(/Description/i), { target: { value: 'Test Description' } });
    const typeSelect = screen.getByLabelText('Organization');
    userEvent.click(typeSelect); 
    await waitFor(() => {
        const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        if (!dropdown) {
            throw new Error('Dropdown not found');
        }
        // Find all elements with the text 'Range'
        const allRangeOptions = within(dropdown).getAllByText('Second Organization');

        // Filter to find the specific element you want to click
        const targetRangeOption = allRangeOptions.find(option => 
            option.getAttribute('class') === 'ant-select-item-option-content'
        );

        if (!targetRangeOption) {
            throw new Error('Specific Range option not found');
        }

        // Click the specific Range option
        userEvent.click(targetRangeOption);
    });



    fireEvent.click(getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything()); 
    });
  });



});
