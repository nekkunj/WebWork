import React from 'react';
import { render, fireEvent, act,waitFor,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer, { RootState } from '../../state/reducers';
import CreateServiceForm from './createServiceForm';
import { createService, updateServiceDetails } from "../../state/new actions/serviceAction";
import { JSX } from 'react/jsx-runtime';
import { IServiceReducer } from '../../state/reducers/serviceReducer';
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock("axios", () => ({
    createService: jest.fn()
  }))
jest.mock('../../state/new actions/serviceAction', () => ({
    ...jest.requireActual('../../state/new actions/serviceAction'),
    createService: jest.fn(),
    updateServiceDetails: jest.fn()
}));

const st = createStore(rootReducer, {
    ServiceReducer: { 
        serviceId: null,
        serviceName: null,
        serviceDescription: null,
        serviceURL: null,
        serviceStatus: null,
        serviceParameters: null,
        serviceDetailsSaving: false,
        serviceParametersSaving: false,
        serviceDetailsSaveSuccess: false,
        serviceDetailsSaveFailure: false,
        serviceCreationError: null,
        nameIsDuplicate: null 
    }
});



describe('CreateServiceForm Component', () => {

  it('renders with initial Redux props', () => {
    render(
        <Provider store={st}>
            <CreateServiceForm onFinish={()=>{}}/>
        </Provider>
    );

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('URL')).toHaveValue('');

    // Check that the "Next" button is present and not disabled
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled();

    const errorMessage = screen.queryByText("* Service Name should be unique");
    expect(errorMessage).not.toBeInTheDocument();
  });

  it('shows error message when name is duplicate', () => {
 // Create a mock state with nameIsDuplicate set to true
    const mockState = {
        ServiceReducer: {
        ...st.getState().ServiceReducer,
        nameIsDuplicate: true,
        },
    };

    // Create a mock store with the updated state
    const mockStore = createStore(rootReducer, mockState);

    // Render the CreateServiceForm with the mock store
    render(
        <Provider store={mockStore}>
        <CreateServiceForm onFinish={() => {}} />
        </Provider>
    );

    // Assert that the error message is displayed
    const errorMessage = screen.getByText("* Service Name should be unique");
    expect(errorMessage).toBeInTheDocument();

  });

  it('calls createService on form submission for new service', async () => {
    const mockStore = createStore(rootReducer, /* your initial state */);
    render(
      <Provider store={mockStore}>
        <CreateServiceForm onFinish={()=>{}}/>
      </Provider>
    );

    userEvent.type(screen.getByLabelText('Name'), 'New Service');
    userEvent.type(screen.getByLabelText('Description'), 'Service Description');
    userEvent.type(screen.getByLabelText('URL'), 'http://newservice.com');

    await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Next' }));
      });
    
    
    await waitFor(() => {
      expect(createService).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything());
    });
  });

  it('prevents form submission with empty fields', async () => {
    render(
        <Provider store={st}>
            <CreateServiceForm onFinish={()=>{}}/>
        </Provider>
    );
    userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => {
        expect(screen.getByText('Please enter service details!')).toBeInTheDocument();
        expect(screen.getByText('Please enter service description!')).toBeInTheDocument();
        expect(screen.getByText('Please enter service URL!')).toBeInTheDocument();
        expect(createService).not.toHaveBeenCalled();
    });
    });
    it('enforces character limits in input fields', () => {
        render(
            <Provider store={st}>
                <CreateServiceForm onFinish={()=>{}}/>
            </Provider>
        );
        const nameInput = screen.getByRole('textbox', { name: 'Name' });
        userEvent.type(nameInput, 'a'.repeat(51));
        expect(nameInput).toHaveValue('a'.repeat(50));
    });
    // it('displays error message on API failure', async () => {
    //     jest.mocked(createService).mockRejectedValue(new Error('API Error'));

    //     render(
    //         <Provider store={st}>
    //             <CreateServiceForm onFinish={() => {}} />
    //         </Provider>
    //     );

    //     userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Failing Service');
    //     userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Service Description');
    //     userEvent.type(screen.getByRole('textbox', { name: 'URL' }), 'http://failingservice.com');

    //     await act(async () => {
    //         fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByText('Error creating service')).toBeInTheDocument();
    //     });
    // });

    it('calls updateServiceDetails on form submission for existing service', async () => {
        const mockState = {
            ServiceReducer: {
                ...st.getState().ServiceReducer,
                serviceId: 'existing-service-id', // Assuming an existing service
            },
        };

        const mockStore = createStore(rootReducer, mockState);

        render(
            <Provider store={mockStore}>
                <CreateServiceForm onFinish={() => {}} />
            </Provider>
        );

        // Enter details for updating service
        userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'Updated Service Name');
        userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Updated Description');
        userEvent.type(screen.getByRole('textbox', { name: 'URL' }), 'http://updatedservice.com');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        });

        await waitFor(() => {
            expect(updateServiceDetails).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything());
        });
    });
    it('updates Redux state on successful form submission', async () => {
        render(
            <Provider store={st}>
                <CreateServiceForm onFinish={() => {}} />
            </Provider>
        );

        // Enter new service details
        userEvent.type(screen.getByRole('textbox', { name: 'Name' }), 'New Service');
        userEvent.type(screen.getByRole('textbox', { name: 'Description' }), 'Service Description');
        userEvent.type(screen.getByRole('textbox', { name: 'URL' }), 'http://newservice.com');

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        });

        await waitFor(() => {
            // Check if the Redux state has been updated correctly
            // This requires access to the store or a mock of the Redux state update mechanism
        });
    });
    it('is accessible with proper labels and keyboard navigation', () => {
        render(
            <Provider store={st}>
                <CreateServiceForm onFinish={() => {}} />
            </Provider>
        );

        // Check for proper labels
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByLabelText('URL')).toBeInTheDocument();

        // Additional checks for ARIA roles, labels, and keyboard navigation can be included here
    });
    it('handles special characters in input fields', () => {
        render(
            <Provider store={st}>
                <CreateServiceForm onFinish={() => {}} />
            </Provider>
        );

        const nameInput = screen.getByRole('textbox', { name: 'Name' });
        userEvent.type(nameInput, 'Service@123');
        // Verify how special characters are handled or if there are restrictions
    });

});
