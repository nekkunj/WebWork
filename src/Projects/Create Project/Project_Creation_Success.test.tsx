import React from 'react';
import { render,screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers'; // Adjust the import path according to your project structure
import Project_Creation_Success from './Project_Creation_Success';
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
                <Project_Creation_Success val={"Testing projectName"} />
        );
        

        expect(getByText(/Congratulations!/i)).toBeInTheDocument();
        expect(screen.getByText(/Testing projectName/i)).toBeInTheDocument();
        expect(getByText(/You have successfully created your project/i)).toBeInTheDocument();
    });
});
