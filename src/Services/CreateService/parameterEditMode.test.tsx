import React from 'react';
import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParameterEditMode from './parameterEditMode';
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
describe('ParameterEditMode Component', () => {
    const mockJsonObject = {
        name: 'Test Parameter',
        type: 'Value',
    };
    const mockUpdateElementAtIndex = jest.fn();
    const mockDeleteParameter = jest.fn();

    const setup = (jsonObject = mockJsonObject) => {
        return render(
            <ParameterEditMode 
                jsonObject={jsonObject}
                index={0}
                deleteParameter={mockDeleteParameter}
                updateElementAtIndex={mockUpdateElementAtIndex}
            />
        );
    };

    it('renders correctly', () => {
        setup();
        expect(screen.getByLabelText('Parameter Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Type of parameter:')).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        setup();
        userEvent.type(screen.getByLabelText('Parameter Name:'), 'New Parameter');
        const selectElement = screen.getByLabelText('Type of parameter:');
        userEvent.click(selectElement);

        await waitFor(() => {
            const dropdown:any = document.body.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
            if (!dropdown) {
                throw new Error('Dropdown not found');
            }

            // Find all elements with the text 'Range'
            const allRangeOptions = within(dropdown).getAllByText('Range');

            // Filter to find the specific element you want to click
            const targetRangeOption = allRangeOptions.find(option => 
                option.getAttribute('role') === 'option'
            );

            if (!targetRangeOption) {
                throw new Error('Specific Range option not found');
            }

            // Click the specific Range option
            userEvent.click(targetRangeOption);
        });

        // Click the Save button
        const saveButton = screen.getByText('Save');
        userEvent.click(saveButton);

        await waitFor(() => {
            expect(mockUpdateElementAtIndex).toHaveBeenCalledWith(0, expect.anything());
        });
    });

    it('conditionally renders range fields', () => {
        setup({ ...mockJsonObject, type: 'Range' });
        expect(screen.getByLabelText('Lower Bound of range')).toBeInTheDocument();
        expect(screen.getByLabelText('Upper Bound of range')).toBeInTheDocument();
    });

    it('calls delete function with correct index', () => {
        setup();
        userEvent.click(screen.getByTestId('delete-icon')); // Assuming DeleteOutlined has data-testid="delete-icon"
        expect(mockDeleteParameter).toHaveBeenCalledWith(0);
    });

    // it('handles dynamic option fields for Options type', async() => {
    // setup({ ...mockJsonObject, type: 'Options' });
    // // Wait for the Options field to appear
    // await waitFor(() => {
    //     expect(screen.getByPlaceholderText('Option name')).toBeInTheDocument();
    // });

    // userEvent.click(screen.getByText('Add field'));
    // expect(screen.getAllByPlaceholderText('Option name')).toHaveLength(2);

    // userEvent.type(screen.getAllByPlaceholderText('Option name')[1], 'Option 1');
    // userEvent.click(screen.getByText('Add field'));
    // expect(screen.getAllByPlaceholderText('Option name')).toHaveLength(3);

    // userEvent.click(screen.getAllByTestId('dynamic-delete-button')[1]); // Assuming MinusCircleOutlined has data-testid="dynamic-delete-button"
    // expect(screen.getAllByPlaceholderText('Option name')).toHaveLength(2);

    // });

    // ... more test cases as needed
});
