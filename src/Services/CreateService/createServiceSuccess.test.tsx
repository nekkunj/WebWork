import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../state/reducers'; // Adjust the import path according to your project structure
import CreateServiceSuccess from './createServiceSuccess';
import IServiceReducer from "../../state/reducers/serviceReducer"
beforeAll(() => {
      global.matchMedia = global.matchMedia || function () {
        return {
            addListener: jest.fn(),
            removeListener: jest.fn(),
        };
        };
  });
  
  
  
describe('CreateServiceSuccess Component', () => {
    it('renders without crashing', () => {
        const store = createStore(rootReducer, {
            ServiceReducer: { 
                serviceId: null,
                serviceName: 'Test Service',
                serviceDescription: null,
                serviceURL: null,
                serviceStatus: null,
                serviceParameters: null,
                serviceDetailsSaving: false,
                serviceParametersSaving: false,
                serviceDetailsSaveSuccess: true,
                serviceDetailsSaveFailure: false,
                serviceCreationError: null,
                nameIsDuplicate: null 
            }
        });

        const { getByText } = render(
            <Provider store={store}>
                <CreateServiceSuccess />
            </Provider>
        );
        

        expect(getByText(/Congratulations!/i)).toBeInTheDocument();
        expect(getByText(/Test Service/i)).toBeInTheDocument();
        expect(getByText(/You have successfully created the service/i)).toBeInTheDocument();
    });
});
