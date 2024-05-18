import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import Users_List_Card from './Users_List_Card';
import { deleteOrganizationAdmin } from "../state/new actions/organizationAction";
import { useMsal } from "@azure/msal-react";
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('../state/new actions/organizationAction', () => ({
    deleteOrganizationAdmin: jest.fn(),
}));
jest.mock('@azure/msal-react');

const mockInitialState = {
    OrganizationFetchReducer: {
        organizationList:null,
        servicesList:null,
        deletorganizationSuccess:false,
        service_User_DetailsFetchInProgress:false,
        service_User_DetailsFetchInSuccess:false,
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
    }
};

const store = createStore(rootReducer, mockInitialState);

const mockUseMsal = useMsal as jest.Mock;
mockUseMsal.mockReturnValue({
    instance: {
        getActiveAccount: () => ({ /* Mock account details */ }),
    },
});

const mockCardData = [
    { userEmail: 'user1@example.com', createdOn: '2023-08-08T21:49:31.456Z', userRole: 'OrganizationAdmin' },
];
 
describe('Users_List_Card Component', () => {


    it('renders correctly with initial data', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData} 
                    orgId="123" 
                    orgName="Test Organization Name" 
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                    // ...other props
                />
            </Provider>
        );
        expect(getByText(/Add new Organization Admin/i)).toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();

        expect(screen.queryByText('Close')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();
        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Organization Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Add a Organization Admin first to see the results')).not.toBeInTheDocument();


    });


    
    it('handles no organization admin', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={[]} 
                    orgId="123" 
                    orgName="Test Organization Name" 
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                />
            </Provider>
        );
        expect(getByText(/No Organization Admin/i)).toBeInTheDocument();
        expect(getByText(/Add a Organization Admin first to see the results/i)).toBeInTheDocument();
        expect(screen.queryByText('Close')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();

    });
    it('handles user deletion', async () => {
        render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData} 
                    orgId="123" 
                    orgName="Test Organization Name" 
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={true} 
                    nextStepExist={true} 
                    // ...other props
                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('delete-user-0')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteOrganizationAdmin).toHaveBeenCalledWith(mockCardData[0],expect.anything(),expect.anything(),expect.anything());
        });
    });

    it('navigates to Prev step when Next button is clicked', () => {
        const prevStepMock = jest.fn();
        const nextStepMock = jest.fn();
        const {getByText}=render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData}
                    orgId='123'
                    orgName="Test Organization Name" 
                    prevStep={prevStepMock}
                    nextStep={nextStepMock}
                    prevStepExists={true}
                    nextStepExist={true}
                />
            </Provider>
        );
        expect(getByText(/Close/i)).toBeInTheDocument();
        expect(getByText(/Prev/i)).toBeInTheDocument();
        // userEvent.click(screen.getByText('Prev'));
        // expect(nextStepMock).toHaveBeenCalled();
    });
    // it('opens AddUserModal when add user button is clicked', async () => {
    //     const prevStepMock = jest.fn();
    //     const nextStepMock = jest.fn();
    //     render(
    //         <Provider store={store}>
    //             <Users_List_Card 
    //                 cardData={mockCardData} 
    //                 documentId='123'
    //                 prevStep={prevStepMock}
    //                 nextStep={nextStepMock}
    //                 prevStepExists={true}
    //                 nextStepExist={true}
    //             />
    //         </Provider>
    //     );

    //     const firstNameField = await screen.findByRole('textbox', { name: 'First Name' });
    //     expect(firstNameField).toBeInTheDocument();
    // });
});
