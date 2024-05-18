import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers';
import Users_List_Card from './Users_List_Card';
import { deleteOrganizationAdmin } from "../../state/new actions/organizationAction";
import { useMsal } from "@azure/msal-react";
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('../../state/new actions/organizationAction', () => ({
    deleteOrganizationAdmin: jest.fn(),
}));
jest.mock('@azure/msal-react');

const orgDetails:any=[{
    _id: "651ed96df21d9feeaca71ba9",
    documentId: "ORGANIZATION#b9005fb2-cbb1-4f1e-a925-36090700327e",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    organizationName: "Test abc Name",
    organizationDescription:"Test Description",
    organizationStatus: true,
    createdAt: "2023-10-05T15:42:37.130Z",
    updatedAt: "2023-10-05T15:42:40.210Z",
    __v: 0,
}]
const projDetails:any=[{
  _id: "651ed96df21d9feeaca71ba9",
  documentId: "ORGANIZATION#b9005fb2-cbb1-4f1e-a925-36090700327ePROJECt#123",
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  projectId:"123",
  projectName: "Test Project Name",
  projectDescription:"Test Description",
  projecttatus: true,
  createdAt: "2023-10-05T15:42:37.130Z",
  updatedAt: "2023-10-05T15:42:40.210Z",
  __v: 0,
}]
const serviceDetails:any=[{
  _id: "651ed96df21d9feeaca71ba9",
  documentId: "ORGANIZATION#b9005fb2-cbb1-4f1e-a925-36090700327ePROJECt#123SERVICE#890",
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  projectId:"123",
  serviceId:"890",
  serviceName: "Test Service Name",
  serviceDescription:"Test Description",
  projecttatus: true,
  createdAt: "2023-10-05T15:42:37.130Z",
  updatedAt: "2023-10-05T15:42:40.210Z",
  __v: 0,
}]
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
    { userEmail: 'user1@example.com', projectId:'789',createdOn: '2023-08-08T21:49:31.456Z', roleName: 'Reader' },

];

describe('Organziation Admin Users_List_Card Component', () => {
    it('renders correctly with initial data', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData} 
                    orgName='Test abc Name'
                    orgId='b9005fb2-cbb1-4f1e-a925-36090700327e' 
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                />
            </Provider>
        );
        
        expect(getByText(/Organization Admins/i)).toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();
        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Organization Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Assign a Organization Admin first to see the results')).not.toBeInTheDocument();
        expect(screen.queryByText('Close')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();

    });

    it('handles user deletion', async () => {
        render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData} 
                    orgName='Test abc Name'
                    orgId='b9005fb2-cbb1-4f1e-a925-36090700327e' 
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                    // ...other props
                />
            </Provider>
        );

        userEvent.click(screen.getByTestId('delete-user-0')); // Ensure you have data-testid attributes in your component
        await waitFor(() => {
            expect(deleteOrganizationAdmin).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything());
        });
        expect(screen.queryByText('Close')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();
    });

    it('When there are no users present', () => {
        const {getByText}=render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={[]}
                    orgName='Test abc Name'
                    orgId='b9005fb2-cbb1-4f1e-a925-36090700327e'
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                />
            </Provider>
        );
        expect(getByText(/Organization Admins/i)).toBeInTheDocument();
        expect(screen.getByText(/No Organization Admin/i)).toBeInTheDocument();
        expect(screen.queryByText(/Assign a Organization Admin first to see the results/i)).toBeInTheDocument();
        expect(screen.queryByText('user1@example.com')).not.toBeInTheDocument();
        expect(screen.queryByText('Close')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();
        
        // userEvent.click(screen.getByText('Prev'));
        // expect(nextStepMock).toHaveBeenCalled();
    });
    it('navigates to Prev step when Next button is clicked', async () => {
        const prevStepMock = jest.fn();
        const nextStepMock = jest.fn();
        const {getByText,getByTestId}=render(
            <Provider store={store}>
                <Users_List_Card 
                    cardData={mockCardData} 
                    orgName='Test abc Name'
                    orgId='b9005fb2-cbb1-4f1e-a925-36090700327e' 
                    prevStep={prevStepMock} 
                    nextStep={nextStepMock} 
                    prevStepExists={true} 
                    nextStepExist={true} 
                    // ...other props
                />
            </Provider>
        );
        expect(getByText(/Organization Admins/i)).toBeInTheDocument();
        expect(screen.queryByText('Add new User')).not.toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();


        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Organization Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Assign a Organization Admin first to see the results')).not.toBeInTheDocument();
        expect(getByText(/Close/i)).toBeInTheDocument();
        expect(getByText(/Prev/i)).toBeInTheDocument();
    });
});
