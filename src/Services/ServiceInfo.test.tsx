import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ServiceInfo from './ServiceInfo';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '../state/reducers';

beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
const initialState = {
    ServiceReducer: { 
        serviceId: null,
        serviceName: null,
        serviceDescription: null,
        serviceURL: null,
        serviceStatus: null,
        serviceParameters: null,
        serviceDetailsSaving: false,
        serviceParametersSaving: false,
        serviceDetailsSaveSuccess: false,
        serviceDetailsSaveFailure: false,
        serviceCreationError: null,
        nameIsDuplicate: null 
    }
};

const store = createStore(rootReducer, initialState);

describe('ServiceInfo Component', () => {
    const mockData = { 
        _id: "651ed96df21d9feeaca71ba9",
        documentId: "SERVICE#b9005fb2-cbb1-4f1e-a925-36090700327e",
        serviceId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
        serviceName: "Data Viewer",
        serviceDescription: "Data Viewer Description",
        serviceURL: "https://connector_bimvista.eaglepixelstreaming.com/v5/BIMVista/BIMVista/Default?exeLunchArgs=-token=",
        serviceStatus: true,
        createdOn: "2023-10-05T15:42:37.130Z",
        updatedAt: "2023-10-05T15:42:40.210Z",
        __v: 0,
        serviceParameters: []
     };

    it('renders without crashing', () => {
        render(<ServiceInfo data={mockData} />);
        expect(screen.getByText('Service Info')).toBeInTheDocument();
    });



    it('changes tabs on click', () => {
        const { getByText, queryByText }=render(
                                                <Provider store={store}>
                                                    <ServiceInfo data={mockData} />
                                                </Provider>
                                                );
        const tab = screen.getByText('Service Form');
        // Check if all tabs are rendered
        expect(getByText('Service Info')).toBeInTheDocument();
        expect(getByText('Service Form')).toBeInTheDocument();

        fireEvent.click(getByText('Service Info'));
        expect(queryByText('Service Details')).toBeInTheDocument();

        fireEvent.click(getByText('Service Form'));
        expect(queryByText('Service Parameters')).toBeInTheDocument();


    });

});


