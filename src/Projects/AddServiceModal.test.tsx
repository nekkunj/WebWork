import { render, fireEvent,screen, act, queryByText, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import userEvent from '@testing-library/user-event';
import AddServiceModal from './AddServiceModal';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { assignNewServiceInProject } from "../state/new actions/projectAction";

import { IparameterObj } from '../type';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});



jest.mock('../state/new actions/projectAction', () => ({
    ...jest.requireActual('../state/new actions/projectAction'),
    assignNewServiceInProject: jest.fn().mockImplementation(() => Promise.resolve()), 
}));

jest.mock('@azure/msal-react');
const jsonObject:IparameterObj[]=[{"name":"Parameter 1","type":"Value"},
{"name":"Parameter 2","type":"Range","lowerBound":"1000","upperBound":"5000"},
{"name":"Parameter 3","type":"Options","options":["first","second","third"]}]
const mockCardData = [
    { name: 'Test Service', createdOn: '2023-08-08T21:49:31.456Z', url: 'test.com',parameterJsonData:JSON.stringify(jsonObject) },
];
const mockInitialState = {
    UnassignedServicesReducer: {
        unassignedServicesList:mockCardData,
        unassignedServices_InProgress:false,
        unassignedServicesFetch_Success:true,
        unassignedServices_Error:null
    }
};
const store = createStore(rootReducer, mockInitialState);

describe('Project AddServiceModal Under Organization', () => {

    it('renders when there is no service', async () => {
        const mockState = {
            UnassignedServicesReducer: {
            ...store.getState().UnassignedServicesReducer,
            unassignedServicesList: [
                { name: 'Test Service', createdOn: '2023-08-08T21:49:31.456Z', url: 'test.com',parameterJsonData:[] },
 
            ]
            },
        };
    
        // Create a mock store with the updated state
        const mockStore = createStore(rootReducer, mockState);
        const {getByText}=render(
            <Provider store={mockStore}>
              <AddServiceModal
                         
                        organizationId='345'
                        projectId='789'
                        isOpen={true} 
                        handleClose={() => {}} 
                        assignService={() => {}} 
            />
            </Provider>
          );
        await waitFor(() => {

        expect(screen.queryByText('Please complete the service form :')).not.toBeInTheDocument();
        },{timeout:1000})
    })



    
    it('submit the form', async () => {
        const {getByText}=render(
            <Provider store={store}>
              <AddServiceModal
                         
                        organizationId='345'
                        projectId='789'
                        isOpen={true} 
                        handleClose={() => {}} 
                        assignService={() => {}} 
            />
            </Provider>
          );
        const typeSelect = screen.getByLabelText('Service Name');
        userEvent.click(typeSelect); 
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Test Service');

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
        await waitFor(() => {
            const ParameterInput = screen.getByRole('textbox', { name: 'Parameter 1' });
            userEvent.type(ParameterInput, 'test name');
            userEvent.click(screen.getByRole('button', { name: 'Add' }));
        })


        await waitFor(() => {
            // expect(assignNewService).toHaveBeenCalled();
        }, { timeout: 4500 })

    })



});



describe('AddUserModal Component UI elements', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
              <AddServiceModal
                         
                        organizationId='345'
                        projectId='789'
                        isOpen={true} 
                        handleClose={() => {}} 
                        assignService={() => {}} 
            />
            </Provider>
          );
      });
      it('renders the Value Service Parameter', async () => {
        const typeSelect = screen.getByLabelText('Service Name');
        userEvent.click(typeSelect); 
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Test Service');

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
        await waitFor(() => {

        expect(screen.getByRole('textbox', { name: 'Parameter 1' })).toBeInTheDocument();
        expect(screen.getByText(/Please complete the service form :/i)).toBeInTheDocument();

        }, { timeout: 1000 })
      });


      it('renders the Range Service Parameter', async () => {
        const typeSelect = screen.getByLabelText('Service Name');
        userEvent.click(typeSelect); 
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Test Service');

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
        await waitFor(() => {

            const parameter2Label:any = screen.getByText('Parameter 2');
            expect(parameter2Label).toBeInTheDocument();
            const inputNumberForParameter2 = parameter2Label.closest('.ant-form-item').querySelector('.ant-input-number input');
            expect(inputNumberForParameter2).toBeInTheDocument();
            const expectedMin = "1000"; // The expected min value for "Parameter 2"
            const expectedMax = "5000"; // The expected max value for "Parameter 2"
            // expect(inputNumberForParameter2).toHaveAttribute('min', expectedMin);
            // expect(inputNumberForParameter2).toHaveAttribute('max', expectedMax);
        }, { timeout: 1000 })
      });



      it('renders the Dropdown Service Parameter', async () => {
        const typeSelect = screen.getByLabelText('Service Name');
        userEvent.click(typeSelect); 
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Test Service');

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
        await waitFor(() => {
            const typeSelect = screen.getByLabelText('Parameter 3');
            userEvent.click(typeSelect); 

        }, { timeout: 1000 })
      });

  
  });
  
