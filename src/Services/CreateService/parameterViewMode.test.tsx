import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParameterViewMode from './parameterViewMode';
import ParameterEditMode from './parameterEditMode';
import { IparameterObj } from "../../type"
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('./parameterEditMode', () => () => <div>Mocked Parameter Edit Mode</div>);


describe('ParameterViewMode Component', () => {
    const mockJsonObject:IparameterObj = {
        name: 'Test Parameter',
        type: 'string',
        lowerBound: '1',
        upperBound: '10',
        // options: ['Option1', 'Option2']
    };
    const mockUpdateElementAtIndex = jest.fn();
    const mockDeleteParameter = jest.fn();

    const setup = (jsonObject = mockJsonObject) => {
        return render(
            <ParameterViewMode 
                jsonObject={jsonObject}
                index={0}
                updateElementAtIndex={mockUpdateElementAtIndex}
                deleteParameter={mockDeleteParameter}
            />
        );
    };

    it('renders correctly', () => {
        setup();
        expect(screen.getByText('Test Parameter')).toBeInTheDocument();
        expect(screen.getByText('string')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        // expect(screen.getAllByText(/Option/)).toHaveLength(2);
    });

    it('switches to edit mode', async() => {
        setup();
        userEvent.click(screen.getByText('Edit'));
        await waitFor(() => {
            // Check for an element that is unique to ParameterEditMode.
            // It could be some text, a form field, or any identifiable element that appears only when in edit mode.
            expect(screen.getByText('Mocked Parameter Edit Mode')).toBeInTheDocument();
        });
    });

    it('calls delete function with correct index', () => {
        setup();
        userEvent.click(screen.getByTestId('delete-icon')); // Assuming you use data-testid="delete-icon" for DeleteOutlined icon
        expect(mockDeleteParameter).toHaveBeenCalledWith(0);
    });

    it('conditionally renders lower and upper bounds', () => {
        const obj:IparameterObj = {
            name: 'Test Parameter',
            type: 'string',
            // options: ['Option1', 'Option2']
        };
        setup(obj);
        expect(screen.queryByText('Lower Bound :')).not.toBeInTheDocument();
        expect(screen.queryByText('Upper Bound :')).not.toBeInTheDocument();
    });

});
