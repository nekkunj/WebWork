import { render, fireEvent,screen, act, queryByText, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useMsal } from '@azure/msal-react';
import userEvent from '@testing-library/user-event';
import UserManagementAddUserModal from './addUserModal_UserM';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { addUser } from '../state/new actions/userManagementAction';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});

 

jest.mock('../state/new actions/userManagementAction', () => ({
    ...jest.requireActual('../state/new actions/userManagementAction'),
    addUser: jest.fn(), 
}));

jest.mock('@azure/msal-react');

const mockInitialState = {
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
const store = createStore(rootReducer, mockInitialState);

describe('addUserModal_UserM', () => {
    // Mock necessary dependencies and initial state here
  
    it('submit empty form', async () => {
      const { getByRole,getByText,queryByText } = render(
        <Provider store={store}>
          <UserManagementAddUserModal usersList={[]} 
                        userRole='ProjectAdmin'
                        projectName='Test PRoject'
                        orgName='Test ORganization'
                        isOpen={true} 
                        organizationId='345'
                        projectId='789'
                        handleClose={() => {}} 
                        handleAddUser={() => {}} 
        />
        </Provider>
      );
    expect(queryByText(/Please enter user first name/i)).not.toBeInTheDocument();
    let errorMessage = screen.queryByText('Please enter user last name!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user email!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();
    errorMessage = screen.queryByText('Please enter user first name!'); // Use queryByText for checking non-existence
    expect(errorMessage).not.toBeInTheDocument();

    await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Add' }));
    });
    expect(addUser).not.toHaveBeenCalled();
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
            <UserManagementAddUserModal usersList={[]} 
                        userRole='ProjectAdmin'
                        projectName='Test PRoject'
                        orgName='Test ORganization'                           
                          organizationId='345'
                          projectId='789'
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
            <UserManagementAddUserModal usersList={[]}
                        userRole='ProjectAdmin' 
                        projectName='Test PRoject'
                        orgName='Test ORganization'                        
                        organizationId='345'
                        projectId='789'
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
        const typeSelect = screen.getByLabelText('User Role');
        userEvent.click(typeSelect); 
        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }
            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Writer');

            // Filter to find the specific element you want to click
            const targetRangeOption = allRangeOptions.find(option => 
                option.getAttribute('class') === 'ant-select-item-option-content'
            );

            if (!targetRangeOption) {
                throw new Error('Specific Range option not found ');
            }

            // Click the specific Range option
            userEvent.click(targetRangeOption);
        });


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
        UserManagementReducer: {
        ...store.getState().UserManagementReducer,
        duplicacy: true,
        },
    };

    // Create a mock store with the updated state
    const mockStore = createStore(rootReducer, mockState);
    const { getByRole,getByText,queryByText } = render(
        <Provider store={mockStore}>
            <UserManagementAddUserModal usersList={[]} 
                        userRole='ProjectAdmin'
                        projectName='Test PRoject'
                        orgName='Test ORganization'                       
                        organizationId='345'
                        projectId='789'
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
            { userEmail: 'user1@example.com', createdAt: '2023-08-08T21:49:31.456Z', userRole: 'OrganizationAdmin' },
            // Add more mock users as needed
        ];
        const { getByRole,getByText,queryByText } = render(
            <Provider store={store}>
                <UserManagementAddUserModal usersList={mockCardData}
                            userRole='ProjectAdmin' 
                            projectName='Test PRoject'
                            orgName='Test ORganization'                           
                            organizationId='345'
                            projectId='789'
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

            const message="Duplicate entry found"
            const errorMessage = await screen.findByText(message); 
            expect(errorMessage).toBeInTheDocument();  
    });

    it('renders all user role select options for Organization Admin', async () => {
        const { getByRole,getByText,queryByText } = render(
            <Provider store={store}>
              <UserManagementAddUserModal usersList={[]} 
                            userRole='OrganizationAdmin'
                            projectName='Test PRoject'
                            orgName='Test ORganization'                           
                            isOpen={true} 
                            organizationId='345'
                            projectId='789'
                            handleClose={() => {}} 
                            handleAddUser={() => {}} 
            />
            </Provider>
          );
        // Open the User Role select dropdown
        const userRoleSelect = screen.getByLabelText('User Role');
        userEvent.click(userRoleSelect);
       
        // Wait for the dropdown options to appear
        await waitFor(() => {
          // Find and assert the presence of the options by targeting the option content specifically
          const organizationAdminOption = screen.queryByText(/Organization Admin/i);
          const projectAdminOption = screen.getByText('Project Admin', {selector: '.ant-select-item-option-content'});
          const readerOption = screen.getByText('Reader', {selector: '.ant-select-item-option-content'});
          const writerOption = screen.getByText('Writer', {selector: '.ant-select-item-option-content'});
          
          expect(organizationAdminOption).not.toBeInTheDocument();
          expect(projectAdminOption).toBeInTheDocument();
          expect(readerOption).toBeInTheDocument();
          expect(writerOption).toBeInTheDocument();
        });
      });

      it('renders all user role select options for other users', async () => {
        const { getByRole,getByText,queryByText } = render(
            <Provider store={store}>
              <UserManagementAddUserModal usersList={[]} 
                            userRole='ProjectAdmin'
                            projectName='Test PRoject'
                            orgName='Test ORganization'                           
                            isOpen={true} 
                            organizationId='345'
                            projectId='789'
                            handleClose={() => {}} 
                            handleAddUser={() => {}} 
            />
            </Provider>
          );
        // Open the User Role select dropdown
        const userRoleSelect = screen.getByLabelText('User Role');
        userEvent.click(userRoleSelect);
      
        // Wait for the dropdown options to appear
        await waitFor(() => {
          // Find and assert the presence of the options by targeting the option content specifically
          const organizationAdminOption = screen.queryByText(/Organization Admin/i);
          const readerOption = screen.getByText('Reader', {selector: '.ant-select-item-option-content'});
          const writerOption = screen.getByText('Writer', {selector: '.ant-select-item-option-content'});
          
          expect(organizationAdminOption).not.toBeInTheDocument();
          expect(readerOption).toBeInTheDocument();
          expect(writerOption).toBeInTheDocument();
            
          
        });
      });


});



describe('AddUserModal Component UI elements', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
              <UserManagementAddUserModal usersList={[]} 
                            userRole='ProjectAdmin'
                            projectName='Test PRoject'
                            orgName='Test ORganization'                         
                            organizationId='345'
                            projectId='789'
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
  
 