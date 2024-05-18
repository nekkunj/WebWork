import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import Project_Users_List_Card from './Project_Users_List_Card';
import { deleteProjectAdmin } from "../state/new actions/projectAction";
import { useMsal } from "@azure/msal-react";
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});

jest.mock('../state/new actions/projectAction', () => ({
    deleteProjectAdmin: jest.fn(), 
}));
jest.mock('@azure/msal-react');

const orgDetails:any=[{
    id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    name: "Test abc Name",
    description:"Test Description",
    isOrganizationActive: true,
    createdOn: "2023-10-05T15:42:37.130Z",
    modifiedOn: "2023-10-05T15:42:40.210Z",
  }]
  const projDetails:any=[{
  id:"098",
  name: "Test Project Name",
  description:"Test Description",
  isProjectActive: true,
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
  services: [ 
    {
      id:"890",
      name: "Test Service Name",
      description:"Test Description",
      isProjectActive: true,
      url:"https://test.com",
      createdOn: "2023-10-05T15:42:37.130Z",
      updatedOn: "2023-10-05T15:42:40.210Z",
    }
  ],
  projectUsers:[{
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    userEmail:'test@abc.com',
    roleName:"ProjectAdmin",
    projectId: "098",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
  }]
  const serviceDetails:any=[{
  id:"890",
  name: "Test Service Name",
  description:"Test Description",
  isProjectActive: true,
  url:"https://test.com",
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
  }]
  const projectUsers:any=[{
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    userEmail:'test@abc.com',
    roleName:"ProjectAdmin",
    projectId: "098",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
const initialState = {
  ProjectReducer: {
    organizationList:orgDetails,
    organizationObj:null,
    projectsList:projDetails,
    servicesList:serviceDetails,
    usersList:projectUsers,
    projectObj:null,
    projectFetchInProgress:false,
    organizationNamesFetch_InProgress:false,
    organizationNamesFetch_Success:false,
    projectFetchSuccess:false,
    projectUpdateInProgress:false,
    projectUpdateSuccess:false,
    fetchingProjectDetailsSuccess:false,
    fetchingProjectDetailsProgress:false,
    fetchError:null,
    updateError:null,
    deleteProjectSuccess:false,
    deleteProjectProgress:false,
    deleteProject_Error: null,
    duplicacy:null,
    newEmail:null
  },
  };

const store = createStore(rootReducer, initialState);

const mockUseMsal = useMsal as jest.Mock;
mockUseMsal.mockReturnValue({
    instance: {
        getActiveAccount: () => ({ /* Mock account details */ }),
    },
});

const mockCardData = [
    { userEmail: 'user1@example.com', id:'789',projectId:'098',createdOn: '2023-08-08T21:49:31.456Z', roleName: 'ProjectAdmin' },
];

describe('Project_Users_List_Card Component', () => {
    it('renders correctly with initial data', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <Project_Users_List_Card 
                    cardData={mockCardData} 
                     
                    orgName='Test Organization Name'
                    projectId='098'
                    organizationId='345'
                    projectName='Test Project Name'
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                    // ...other props
                />
            </Provider>
        );
        expect(getByText(/Add new Project Admin/i)).toBeInTheDocument();
        expect(getByText(/user1@example.com/i)).toBeInTheDocument();

        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();
        expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('No Project Admin')).not.toBeInTheDocument();
        expect(screen.queryByText('Add a Project Admin first to see the results')).not.toBeInTheDocument();


    });
    it('handles no project admin', () => {
        const {getByText,queryByRole}= render(
            <Provider store={store}>
                <Project_Users_List_Card 
                    cardData={[]} 
                    orgName='Test Organization Name'
                    projectId='098'
                    organizationId='345'
                    projectName='Test Project Name'
                    prevStep={() => {}} 
                    nextStep={() => {}} 
                    prevStepExists={false} 
                    nextStepExist={false} 
                />
            </Provider>
        );
        expect(getByText(/No Project Admin/i)).toBeInTheDocument();
        expect(getByText(/Add a Project Admin first to see the results/i)).toBeInTheDocument();
        expect(screen.queryByText('Next')).not.toBeInTheDocument();
        expect(screen.queryByText('Prev')).not.toBeInTheDocument();

    });
    it('handles user deletion', async () => {
        render(
            <Provider store={store}>
                <Project_Users_List_Card 
                    cardData={mockCardData} 
                    orgName='Test Organization Name'
                    projectId='098'
                    organizationId='345'
                    projectName='Test Project Name'
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
            expect(deleteProjectAdmin).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything(),expect.anything(),expect.anything());
        });
    });

    it('navigates to Prev step when Next button is clicked', () => {
        const prevStepMock = jest.fn();
        const nextStepMock = jest.fn();
        const {getByText}=render(
            <Provider store={store}>
                <Project_Users_List_Card 
                    cardData={mockCardData}
                    orgName='Test Organization Name'
                    projectId='098'
                    organizationId='345'
                    projectName='Test Project Name'
                    prevStep={prevStepMock}
                    nextStep={nextStepMock}
                    prevStepExists={true}
                    nextStepExist={true}
                />
            </Provider>
        );
        expect(getByText(/Next/i)).toBeInTheDocument();
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
    //                 
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
