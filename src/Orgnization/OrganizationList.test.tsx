import React from 'react';
import { render, fireEvent,screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import OrganizationList from './OrganizationList';
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
  name: "Test Organization Name",
  description:"Test Description",
  isOrganizationActive: true,
  services: [],
  organizationAdmins: [],
  createdOn: "2023-10-05T15:42:37.130Z",
  updatedOn: "2023-10-05T15:42:40.210Z",
}]
const initialState = {
    OrganizationFetchReducer: {
        organizationList:orgDetails,
        servicesList:orgDetails,
        service_User_DetailsFetchInProgress:false,
        service_User_DetailsFetchInSuccess:false,
        deletorganizationSuccess:false,
        usersList:orgDetails,
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

describe('<OrganizationList />', () => {
  it('renders without crashing', () => {
    const { container,getByText,queryByText } = render(
      <Provider store={store}>
        <OrganizationList  />
      </Provider>
    );
    
    const specificElement = container.querySelector('.containerbackground');
    expect(specificElement).toBeInTheDocument();
    expect(specificElement).toHaveTextContent(/Organization/);
  
    expect(getByText('Test Organization Name')).toBeInTheDocument();

  });

  it('renders all tabs and switches correctly', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <OrganizationList  />
      </Provider>
    );

    // Check if all tabs are rendered
    expect(getByText('Organization Info')).toBeInTheDocument();
    expect(getByText('Services')).toBeInTheDocument();
    expect(getByText('Users')).toBeInTheDocument();

    // Click on the Services tab and check if its content is displayed
    fireEvent.click(getByText('Services'));
    // Add checks for content inside the Services tab, for example:
    expect(queryByText('Services List')).toBeInTheDocument();

    // Similarly, test for Users tab
    fireEvent.click(getByText('Users'));
    expect(queryByText('Users List')).toBeInTheDocument();

  });
});
