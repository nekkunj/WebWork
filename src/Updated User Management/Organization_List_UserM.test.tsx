import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Organization_List_UserM from './Organization_List_UserM';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '../state/reducers';
import { Provider } from 'react-redux';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
const orgDetails:any=[{
  id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  name: "Test abc Name",
  description:"Test Description",
  isOrganizationActive: true,
  createdOn: "2023-10-05T15:42:37.130Z",
  modifiedOn: "2023-10-05T15:42:40.210Z",
}]
const projDetails:any=[{
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  projectId:"123",
  name: "Test Project Name",
  description:"Test Description",
  isProjectActive: true,
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
  services:[{
    id:"890",
    name: "Test Service Name",
    description:"Test Description",
    isProjectActive: true,
    url:"https://test.com",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }],
  projectUsers:[{
    userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    userEmail:'test@abc.com',
    roleName:"ProjectAdmin",
    projectId: "123",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
  }]
}]

const userDetails:any=[{
  userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  organizationId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
  userEmail:'test@abc.com',
  roleName:"ProjectAdmin",
  projectId: "123",
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
}]
const initialState = {
    UserManagementReducer: {
        organizationNames:orgDetails,
        projectNames:projDetails,
        userNames:userDetails,
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
    },    OrganizationFetchReducer: {
        organizationList:orgDetails,
        servicesList:orgDetails,
        deletorganizationSuccess:false,
        usersList:orgDetails,
        service_User_DetailsFetchInProgress:false,
        service_User_DetailsFetchInSuccess:false,
        organizationFetchInProgress:false,
        organizationFetchSuccess:true,
        organizationUpdateInProgress:false,
        organizationUpdateSuccess:false,
        deletorganizationProgress:false,
        fetchError:null,
        updateError:null,
        deletorganization_Error:null,
        duplicacy:null,
        newEmail:null
    },
  };

// Mock Redux store setup
const store = createStore(rootReducer, initialState);

describe('<Organization_List_UserM />', () => {
  it('renders without crashing', () => {
    const { container,getByText,getByTestId } = render(
      <Provider store={store}>
        <Organization_List_UserM  />
      </Provider>
    );
    
    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Organization/);
  
    expect(getByTestId('test-abc-name-span')).toBeInTheDocument();
    expect(getByText('Users List')).toBeInTheDocument();
  });

  it('when there is no organization', () => {

    const mockState = {
        UserManagementReducer:{
        ...store.getState().UserManagementReducer,
        organizationNames:null,
        }
    };
    const mockStore = createStore(rootReducer, mockState);
    const { container,getByTestId, queryByText } = render(
      <Provider store={mockStore}>
        <Organization_List_UserM  />
      </Provider>
    );

    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Organization/);
  
    // expect(getByTestId('test-abc-name-span')).not.toBeInTheDocument();
  });
});
