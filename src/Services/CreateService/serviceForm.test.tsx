import React from 'react';
import { render, fireEvent, waitFor, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers';
import ServiceParameterForm from './serviceForm';
import { saveServiceParameters } from "../../state/new actions/serviceAction";

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
        return {
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
    };
});

jest.mock("axios", () => ({
    saveServiceParameters: jest.fn()
  }))
jest.mock('../../state/new actions/serviceAction', () => ({
    ...jest.requireActual('../../state/new actions/serviceAction'),
    saveServiceParameters: jest.fn(),
}));


const initialState = {
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
};

const store = createStore(rootReducer, initialState);

describe('ServiceParameterForm Component', () => {

    it('renders correctly with initial props', () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        expect(screen.getByText('Create the form by adding your own parameters')).toBeInTheDocument();
        expect(screen.getByLabelText('Parameter Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Type of parameter:')).toBeInTheDocument();
    });

    it('handles input correctly', () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        userEvent.type(screen.getByLabelText('Parameter Name:'), 'Test Parameter');
        expect(screen.getByLabelText('Parameter Name:')).toHaveValue('Test Parameter');
    });

    it('validates inputs before allowing submission', async () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        userEvent.click(screen.getByText('Add'));
        await waitFor(() => {
            expect(screen.getByText('Please enter Parameter Name!')).toBeInTheDocument();
        });
    });

    // it('calls saveServiceParameters on form submission( At Create Service) for Range', async () => {
    //     render(
    //         <Provider store={store}>
    //             <ServiceParameterForm serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
    //         </Provider>
    //     );

    //     userEvent.type(screen.getByLabelText('Parameter Name:'), 'Test Parameter');
    //     const typeSelect = screen.getByLabelText('Type of parameter:');
    //     userEvent.click(typeSelect); // Replace 'Value' with the actual value attribute of the option
    //     await waitFor(() => {
    //         const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    //         if (!dropdown) {
    //             throw new Error('Dropdown not found');
    //         }
    //         // Find all elements with the text 'Range'
    //         const allRangeOptions = within(dropdown).getAllByText('Range');

    //         // Filter to find the specific element you want to click
    //         const targetRangeOption = allRangeOptions.find(option => 
    //             option.getAttribute('role') === 'option'
    //         );

    //         if (!targetRangeOption) {
    //             throw new Error('Specific Range option not found');
    //         }

    //         // Click the specific Range option
    //         userEvent.click(targetRangeOption);
    //     });

    //     await waitFor(() => {
    //     expect(screen.getByLabelText('Lower Bound of range')).toBeInTheDocument();
    //     expect(screen.getByLabelText('Upper Bound of range')).toBeInTheDocument();

    //     // Click on the 'Add' button
    //     userEvent.click(screen.getByRole('button', { name: 'Add' }));
    //     });
    //     await waitFor(() => {
    //         // Click on the 'Add' button
    //         userEvent.click(screen.getByRole('button', { name: 'Next' }));
    //         });
    
    //     // Wait for the saveServiceParameters function to be called
    //     await waitFor(() => {
    //         expect(saveServiceParameters).toHaveBeenCalledWith(expect.anything());
    //     });


    // });


    it('calls saveServiceParameters on form submission( At Create Service) for Value', async () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        userEvent.type(screen.getByLabelText('Parameter Name:'), 'Test Parameter');
        const typeSelect = screen.getByLabelText('Type of parameter:');
        userEvent.click(typeSelect); // Replace 'Value' with the actual value attribute of the option
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Value');

            // Filter to find the specific element you want to click
            const targetRangeOption = allRangeOptions.find(option => 
                option.getAttribute('role') === 'option'
            );

            if (!targetRangeOption) {
                throw new Error('Specific Range option not found');
            }

            // Click the specific Range option
            userEvent.click(targetRangeOption);
        });

        await waitFor(() => {

        expect(screen.queryByText('Lower Bound of range')).not.toBeInTheDocument();
        expect(screen.queryByText('Upper Bound of range')).not.toBeInTheDocument();

        // Click on the 'Add' button
        userEvent.click(screen.getByRole('button', { name: 'Add' }));
        });
        await waitFor(() => {
            // Click on the 'Add' button
            userEvent.click(screen.getByRole('button', { name: 'Next' }));
        });
    
        // Wait for the saveServiceParameters function to be called
        await waitFor(() => {
            expect(saveServiceParameters).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything());
        });


    });   
    it('calls saveServiceParameters on form submission( At Edit Service) for Value', async () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} initialValues={null}/>
            </Provider>
        );

        userEvent.type(screen.getByLabelText('Parameter Name:'), 'Test Parameter');
        const typeSelect = screen.getByLabelText('Type of parameter:');
        userEvent.click(typeSelect); // Replace 'Value' with the actual value attribute of the option
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Value');

            // Filter to find the specific element you want to click
            const targetRangeOption = allRangeOptions.find(option => 
                option.getAttribute('role') === 'option'
            );

            if (!targetRangeOption) {
                throw new Error('Specific Range option not found');
            }

            // Click the specific Range option
            userEvent.click(targetRangeOption);
        });

        await waitFor(() => {

        expect(screen.queryByText('Lower Bound of range')).not.toBeInTheDocument();
        expect(screen.queryByText('Upper Bound of range')).not.toBeInTheDocument();

        // Click on the 'Add' button
        userEvent.click(screen.getByRole('button', { name: 'Add' }));
        });
        await waitFor(() => {
            // Click on the 'Add' button
            userEvent.click(screen.getByRole('button', { name: 'Save' }));
        });
    
        // Wait for the saveServiceParameters function to be called
        await waitFor(() => {
            expect(saveServiceParameters).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything());
        });


    });   

    // it('calls saveServiceParameters on form submission( At Edit Service) for Range', async () => {
    //     render(
    //         <Provider store={store}>
    //             <ServiceParameterForm serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={false} nextStepExist={false} initialValues={null}/>
    //         </Provider>
    //     );

    //     // Fill out the parameter name
    //     userEvent.type(screen.getByLabelText('Parameter Name:'), 'Test Parameter');

    //     // Select 'Range' as the parameter type
    //     fireEvent.mouseDown(screen.getByLabelText('Type of parameter:'));
    //         const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    //         const allRangeOptions = within(dropdown).getAllByText('Value');

    //     // const allRangeOptions:any = await screen.findByText('Range');
    //                 const targetRangeOption = allRangeOptions.find((option:any) => 
    //             option.getAttribute('role') === 'option'
    //         );

    //         if (!targetRangeOption) {
    //             throw new Error('Specific Range option not found');
    //         }

    //         // Click the specific Range option
    //         userEvent.click(targetRangeOption);

    //     // Wait for 'Lower Bound of range' and 'Upper Bound of range' to appear
    //     await waitFor(() => {
    //         expect(screen.getByLabelText('Lower Bound of range')).toBeInTheDocument();
    //         expect(screen.getByLabelText('Upper Bound of range')).toBeInTheDocument();
    //     });

    //     // Fill out the lower and upper bounds
    //     userEvent.type(screen.getByLabelText('Lower Bound of range'), '10');
    //     userEvent.type(screen.getByLabelText('Upper Bound of range'), '100');

    //     // Click on the 'Add' button
    //     userEvent.click(screen.getByRole('button', { name: 'Add' }));

    //     // Mock or spy on saveServiceParameters if necessary to assert the call

    //     // Click on the 'Save' button
    //     userEvent.click(screen.getByRole('button', { name: 'Save' }));

        
    //         await waitFor(() => {
    //             expect(saveServiceParameters).toHaveBeenCalledWith(expect.anything());
    //         });


    // });   

    it('allows navigation to previous step', () => {
        const prevStepMock = jest.fn();

        render(
            <Provider store={store}>
                <ServiceParameterForm  serviceObj={{}} serviceId={"123"} prevStep={prevStepMock} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        userEvent.click(screen.getByText('Prev'));
        expect(prevStepMock).toHaveBeenCalled();
    });

    it('enforces character limits in input fields', () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        const nameInput:any = screen.getByLabelText('Parameter Name:');
        userEvent.type(nameInput, 'a'.repeat(100));
        expect(nameInput.value.length).toBeLessThanOrEqual(100);
    });

    it('handles special characters in input fields', () => {
        render(
            <Provider store={store}>
                <ServiceParameterForm serviceObj={{}} serviceId={"123"} prevStep={()=>{}} nextStep={()=>{}} prevStepExists={true} nextStepExist={true} initialValues={null}/>
            </Provider>
        );

        const nameInput = screen.getByLabelText('Parameter Name:');
        userEvent.type(nameInput, 'Test@123');
        expect(nameInput).toHaveValue('Test@123');
    });

});
