import { render, fireEvent,screen, act, queryByText } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import userEvent from '@testing-library/user-event';
import AddUserModal from './AddUserModal';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { addOrganizationAdmin } from '../state/new actions/organizationAction';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});



jest.mock('../state/new actions/organizationAction', () => ({
    ...jest.requireActual('../state/new actions/organizationAction'),
    addOrganizationAdmin: jest.fn(), 
}));

jest.mock('@azure/msal-react');

const mockInitialState = {
    OrganizationFetchReducer: {
        organizationList:null,
        servicesList:null,
        service_User_DetailsFetchInProgress:false,
        service_User_DetailsFetchInSuccess:false,
        deletorganizationSuccess:false,
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

describe('AddUserModal', () => {
    // Mock necessary dependencies and initial state here
  
    it('submit empty form', async () => {
      const { getByRole,getByText,queryByText } = render(
        <Provider store={store}>
          <AddUserModal usersList={[]} 
                        orgName='Test Organization'
                        orgId="123" 
                        isOpen={true} 
                        handleClose={() => {}} 
                        handleAddUser={() => {}} 
        />
        </Provider>
      );
    // expect(queryByText(/Please enter user first name/i)).not.toBeInTheDocument();
    let errorMessage = screen.queryByText('Please enter user last name!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user email!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user first name!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();

    await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Add' }));
    });
    expect(addOrganizationAdmin).not.toHaveBeenCalled();
    errorMessage = await screen.findByText('Please enter user last name!'); 
    expect(errorMessage).toBeInTheDocument();
     errorMessage = await screen.findByText('Please enter user first name!'); 
    expect(errorMessage).toBeInTheDocument();    
    errorMessage = await screen.findByText('Please enter user email!'); 
    expect(errorMessage).toBeInTheDocument();
    });


    it('check email invalid', async () => {
        const { getByRole,getByText,queryByText } = render(
          <Provider store={store}>
            <AddUserModal usersList={[]} 
                          orgName='Test Organization'
                          orgId="123" 
                          isOpen={true} 
                          handleClose={() => {}} 
                          handleAddUser={() => {}} 
          />
          </Provider>
        );
      let errorMessage = screen.queryByText('Please enter user last name!'); // Use queryByText for checking non-existence
      expect(errorMessage).not.toBeInTheDocument();
      errorMessage = screen.queryByText('Please enter user email!'); // Use queryByText for checking non-existence
      expect(errorMessage).not.toBeInTheDocument();
      errorMessage = screen.queryByText('Please enter user first name!'); // Use queryByText for checking non-existence
      expect(errorMessage).not.toBeInTheDocument();
      const descriptionInput = screen.getByRole('textbox', { name: 'User Email' });
      userEvent.type(descriptionInput, 'invalidEmailId@');
      await act(async () => {
          userEvent.click(screen.getByRole('button', { name: 'Add' }));
      });
      errorMessage = await screen.findByText('Please enter user last name!'); 
      expect(errorMessage).toBeInTheDocument();
       errorMessage = await screen.findByText('Please enter user first name!'); 
      expect(errorMessage).toBeInTheDocument();    
      errorMessage = screen.queryByText('Please enter user email!'); // Use queryByText for checking non-existence
      expect(errorMessage).not.toBeInTheDocument();
      errorMessage = await screen.findByText('Please enter valid emailId!'); 
      expect(errorMessage).toBeInTheDocument();
      });


it('check form submit', async () => {
    const { getByRole,getByText,queryByText } = render(
      <Provider store={store}>
        <AddUserModal usersList={[]} 
                      orgName='Test Organization'
                      orgId="123" 
                      isOpen={true} 
                      handleClose={() => {}} 
                      handleAddUser={() => {}} 
      />
      </Provider>
    );
    const firstNameInput = screen.getByRole('textbox', { name: 'First Name' });
    userEvent.type(firstNameInput, 'test name');
    const lastNameInput = screen.getByRole('textbox', { name: 'Last Name' });
    userEvent.type(lastNameInput, 'test last name');
    const descriptionInput = screen.getByRole('textbox', { name: 'User Email' });
    userEvent.type(descriptionInput, 'validEmailId@test.com');
    await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Add' }));
    });
    let errorMessage = screen.queryByText('Please enter user last name!'); 
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user email!'); 
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter valid emailId!'); 
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user first name!'); 
    expect(errorMessage).not.toBeInTheDocument();
    // await act(async () => {
    // expect(addOrganizationAdmin).toHaveBeenCalledWith(expect.anything());
    // });

  });


    it('check user duplicacy variable', async () => { 

    const mockState = {
        OrganizationFetchReducer: {
        ...store.getState().OrganizationFetchReducer,
        duplicacy: true,
        },
    };

    // Create a mock store with the updated state
    const mockStore = createStore(rootReducer, mockState);
    const { getByRole,getByText,queryByText } = render(
        <Provider store={mockStore}>
          <AddUserModal usersList={[]} 
                        orgName='Test Organization'
                        orgId="123" 
                        isOpen={true} 
                        handleClose={() => {}} 
                        handleAddUser={() => {}} 
        />
        </Provider>
      );
    const message="* User already present in this organization with different role"
    const errorMessage = await screen.findByText(message); 
    expect(errorMessage).toBeInTheDocument();    
    });

    it('check user duplicacy locally', async () => { 
        const mockCardData = [
            { userEmail: 'user1@example.com', createdOn: '2023-08-08T21:49:31.456Z', userRole: 'OrganizationAdmin' },
            // Add more mock users as needed
        ];
        const { getByRole,getByText,queryByText } = render(
            <Provider store={store}>
              <AddUserModal usersList={mockCardData} 
                            orgName='Test Organization'
                            orgId="123" 
                            isOpen={true} 
                            handleClose={() => {}} 
                            handleAddUser={() => {}} 
            />
            </Provider>
          );
          const firstNameInput = screen.getByRole('textbox', { name: 'First Name' });
          userEvent.type(firstNameInput, 'test name');
          const lastNameInput = screen.getByRole('textbox', { name: 'Last Name' });
          userEvent.type(lastNameInput, 'test last name');
          const descriptionInput = screen.getByRole('textbox', { name: 'User Email' });
          userEvent.type(descriptionInput, 'user1@example.com');
          await act(async () => {
              userEvent.click(screen.getByRole('button', { name: 'Add' }));
          });

          const message="User already present in this organization"
          const errorMessage = await screen.findByText(message); 
          expect(errorMessage).toBeInTheDocument();  
        });





});



describe('AddUserModal Component UI elements', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
              <AddUserModal usersList={[]} 
                            orgName='Test Organization'
                            orgId="123" 
                            isOpen={true} 
                            handleClose={() => {}} 
                            handleAddUser={() => {}} 
            />
            </Provider>
          );
      });
      it('renders the First Name input field', () => {
        expect(screen.getByRole('textbox', { name: 'First Name' })).toBeInTheDocument();
        
      });
  
      it('renders the Last Name input field', () => {
        expect(screen.getByRole('textbox', { name: 'Last Name' })).toBeInTheDocument();
      });
  
      it('renders the User Email input field', () => {
        expect(screen.getByRole('textbox', { name: 'User Email' })).toBeInTheDocument();
      });
  
  });
  
