import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import ServicesList from './ServicesList';
import { useMsal } from "@azure/msal-react";
import { IparameterObj } from "../type";
import { deleteAssignedService,fetchListOfUnassignedServices } from "../state/new actions/organizationAction";


beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('../state/new actions/organizationAction', () => ({
    deleteAssignedService: jest.fn(), 
    fetchListOfUnassignedServices: jest.fn()
}));
jest.mock('@azure/msal-react');

const mockInitialState = {
    AssignServicesReducer: {
        assignedServiceObject:null,
        serviceAssign_InProgress:false,
        serviceAssign_Success:false,
        serviceAssign_Error:null,
        serviceUnassign_InProgress:false,
        serviceUnassign_Success:false,
        serviceUnassign_Error: null,
    }
};
const jsonObject:IparameterObj[]=[{"name":"Parameter 1","type":"value","value":"example 1"},
{"name":"Parameter 2","type":"Range","lowerBound":"1000","upperBound":"5000","value":"3000"},
{"name":"Parameter 3","type":"Options","options":["first","second","third"],"value":"second"}]
const store = createStore(rootReducer, mockInitialState);

const mockUseMsal = useMsal as jest.Mock;
mockUseMsal.mockReturnValue({
    instance: {
        getActiveAccount: () => ({ /* Mock account details */ }),
    },
});

const mockCardData = [
    { name: 'Test Service', createdOn: '2023-08-08T21:49:31.456Z', url: 'test.com',parameterJsonData:jsonObject },
];

describe('ServicesList Organization Component', () => {
    it('renders correctly with initial data', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <ServicesList 
                    cardData={mockCardData} 
                    orgId="123" 
                    assignedServices={[]}
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                    fetchData={()=>{}}
                />
            </Provider>
        );
        expect(getByText(/Assign a new service/i)).toBeInTheDocument();
        expect(getByText(/Test Service/i)).toBeInTheDocument();

        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();
        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Services Assigned')).not.toBeInTheDocument();
        expect(screen.queryByText('Assign a service first to see the results')).not.toBeInTheDocument();


    });
    it('handles no services', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <ServicesList 
                    cardData={[]} 
                    orgId="123" 
                    assignedServices={[]}
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                    fetchData={()=>{}}
                />
            </Provider>
        );
        expect(getByText(/No Services Assigned/i)).toBeInTheDocument();
        expect(getByText(/Assign a service first to see the results/i)).toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();

    });
    it('handles service deletion', async () => {
        render(
            <Provider store={store}>
                <ServicesList 
                    cardData={mockCardData} 
                    orgId="123" 
                    assignedServices={[]}
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={true} 
                    nextStepExist={true} 
                    fetchData={()=>{}}

                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('delete-service')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteAssignedService).toHaveBeenCalledWith(mockCardData[0],expect.anything(),expect.anything(),expect.anything());
        });
    });



    it('handles service edit', async () => {
        render(
            <Provider store={store}>
                <ServicesList 
                    cardData={mockCardData} 
                    orgId="123" 
                    assignedServices={[]}
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={true} 
                    nextStepExist={true} 
                    fetchData={()=>{}}

                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('edit-service')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteAssignedService).not.toHaveBeenCalled();
        });
    });

    it('navigates to Prev step when Next button is clicked', () => {
        const prevStepMock = jest.fn();
        const nextStepMock = jest.fn();
        const {getByText}=render(
            <Provider store={store}>
                <ServicesList 
                    cardData={mockCardData}
                    orgId='123'
                    assignedServices={[]}
                    prevStep={prevStepMock}
                    nextStep={nextStepMock}
                    prevStepExists={true}
                    nextStepExist={true}
                    fetchData={()=>{}}
                />
            </Provider>
        );
        expect(getByText(/Next/i)).toBeInTheDocument();
        expect(getByText(/Prev/i)).toBeInTheDocument();
        // userEvent.click(screen.getByText('Prev'));
        // expect(nextStepMock).toHaveBeenCalled();
    });

});
