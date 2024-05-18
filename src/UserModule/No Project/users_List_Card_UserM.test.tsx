import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers';
import UserManagementUsersListCard from './users_List_Card_UserM';
import { deleteOrganizationAdmin_UserManagement } from "../../state/new actions/userManagementAction";
import { useMsal } from "@azure/msal-react";
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('../../state/new actions/userManagementAction', () => ({
    deleteOrganizationAdmin_UserManagement: jest.fn(),
}));
jest.mock('@azure/msal-react');


const initialState = {
  OrganizationFetchReducer: {
    organizationList:null,
    servicesList:null,
    deletorganizationSuccess:false,
    usersList:null,
    organizationFetchInProgress:false,
    organizationFetchSuccess:false,
    organizationUpdateInProgress:false,
    service_User_DetailsFetchInProgress:false,
    service_User_DetailsFetchInSuccess:false,
    organizationUpdateSuccess:false,
    deletorganizationProgress:false,
    fetchError:null,
    updateError:null,
    deletorganization_Error:null,
    duplicacy:null,
    newEmail:null
  },
  UserManagementReducer:{
    organizationNames:null,
    projectNames:null,
    userNames:null,
    fetchingDetails_InProgress:false,
    fetchingDetails_Success:false,
    fetchingOrganizationNames_InProgress:false,
    fetchingOrganizationNames_Success:false,
    fetchingDetails_Error:null,
    updateUser_Progress:false,
    updateUser_Success:false,
    deleteUser_Success:false,
    deleteUser_Progress:false,
    updateUser_Error: null,
    duplicacy:null,
    newEmail:null
    }
  };

const store = createStore(rootReducer, initialState);

const mockUseMsal = useMsal as jest.Mock;
mockUseMsal.mockReturnValue({
    instance: {
        getActiveAccount: () => ({ /* Mock account details */ }),
    },
});

const mockCardData = [
    { userEmail: 'user1@example.com', projectId:'789',createdOn: '2023-08-08T21:49:31.456Z', roleName: 'OrganizationAdmin' },

];

describe('No Project Users_List_Card_UserM Component', () => {
    it('renders correctly with initial data', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='ProjectAdmin'
                />
            </Provider>
        );
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();


        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Users')).not.toBeInTheDocument();
        expect(screen.queryByText('Create a project first to enable this functionality')).not.toBeInTheDocument();


    });

    it('handles user deletion organization admin', async () => {
        render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='OrganizationAdmin'
                    // ...other props
                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('delete-user-0')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteOrganizationAdmin_UserManagement).not.toHaveBeenCalled();

        });
    });
    it('handles user deletion super admin', async () => {
        render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='SuperAdmin'
                    // ...other props
                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('delete-user-0')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteOrganizationAdmin_UserManagement).toHaveBeenCalledWith(mockCardData[0],expect.anything(),expect.anything());
        });
    });
    it('When there are no users present', () => {
        const {getByText}=render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={[]}
                    
                    organizationId='345'
                    userRole='OrganizationAdmin'
                />
            </Provider>
        );
        expect(screen.getByText(/No Users/i)).toBeInTheDocument();
        expect(screen.queryByText(/Create a project first to enable this functionality/i)).toBeInTheDocument();
        expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
        
        // userEvent.click(screen.getByText('Prev'));
        // expect(nextStepMock).toHaveBeenCalled();
    });
    it('When user has no access for Reader', async () => {
        const {getByText,getByTestId}=render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='Reader'
                    // ...other props
                />
            </Provider>
        );

        expect(screen.queryByText('Add new User')).not.toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();


        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Users')).not.toBeInTheDocument();
        expect(screen.queryByText('Create a project first to enable this functionality')).not.toBeInTheDocument();

        // Find the delete button
        const deleteButton = getByTestId('delete-user-0');

        // Check if the delete button is disabled by styles
        expect(deleteButton).toHaveStyle('opacity: 0.5');
        expect(deleteButton).toHaveStyle('cursor: not-allowed');
    });
    it('When user has no access for Writer', async () => {
        const {getByText,getByTestId}=render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='Writer'
                    // ...other props
                />
            </Provider>
        );

        expect(screen.queryByText('Add new User')).not.toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();


        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Users')).not.toBeInTheDocument();
        expect(screen.queryByText('Create a project first to enable this functionality')).not.toBeInTheDocument();

        // Find the delete button
        const deleteButton = getByTestId('delete-user-0');

        // Check if the delete button is disabled by styles
        expect(deleteButton).toHaveStyle('opacity: 0.5');
        expect(deleteButton).toHaveStyle('cursor: not-allowed');
    });

    it('When user has no access for ProjectAdmin not allowed to delete other projectadmins', async () => {
        const {getByText,getByTestId}=render(
            <Provider store={store}>
                <UserManagementUsersListCard 
                    cardData={mockCardData} 
                     
                    organizationId='345'
                    userRole='ProjectAdmin'
                    // ...other props
                />
            </Provider>
        );

        expect(screen.queryByText('Add new User')).not.toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();


        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Users')).not.toBeInTheDocument();
        expect(screen.queryByText('Add a user first to see the results')).not.toBeInTheDocument();

        // Find the delete button
        const deleteButton = getByTestId('delete-user-0');

        // Check if the delete button is disabled by styles
        // expect(deleteButton).toHaveStyle('opacity: 0.5');
        expect(deleteButton).toHaveStyle('cursor: not-allowed');
    });
});
 