import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RenderParameterCards from './renderParameterCards';
import ParameterViewMode from './parameterViewMode';
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
jest.mock('./ParameterViewMode', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('RenderParameterCards Component', () => {
    const mockDeleteParameter = jest.fn();
    const mockUpdateElementAtIndex = jest.fn();
    const mockMyObject = [
        { name: 'Parameter1', type: 'Value' },
        { name: 'Parameter2', type: 'Range', lowerBound: '1', upperBound: '10' },
        // ... other test objects
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        
    });

    it('renders ParameterViewMode for each item', () => {
        render(
            <RenderParameterCards 
                myObject={mockMyObject} 
                deleteParameter={mockDeleteParameter}
                updateElementAtIndex={mockUpdateElementAtIndex} 
            />
        );

        const parameterCards = screen.getAllByTestId('parameter-view-mode');
        expect(parameterCards.length).toBe(mockMyObject.length);
    });

    it('renders correct number of ParameterViewMode components', () => {
        render(<RenderParameterCards myObject={mockMyObject} deleteParameter={() => {}} updateElementAtIndex={() => {}} />);

        const parameterViewElements = screen.queryAllByTestId('parameter-view-mode');
        expect(parameterViewElements.length).toBe(mockMyObject.length);
    });

});
