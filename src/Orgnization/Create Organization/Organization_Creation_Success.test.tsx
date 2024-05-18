import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers'; // Adjust the import path according to your project structure
import Organization_Creation_Success from './Organization_Creation_Success';
import IServiceReducer from "../../state/reducers/serviceReducer"
beforeAll(() => {
      global.matchMedia = global.matchMedia || function () {
        return {
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
        };
  });
  
  
  
describe('Organization_Creation_Success Component', () => {
    it('renders without crashing', () => {


        const { getByText } = render(
                <Organization_Creation_Success val={"Testing OrganizationName"} />
        );
        

        expect(getByText(/Congratulations!/i)).toBeInTheDocument();
        expect(getByText(/Testing OrganizationName/i)).toBeInTheDocument();
        expect(getByText(/You have successfully created the organization/i)).toBeInTheDocument();
    });
});
