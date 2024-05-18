import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceForm from './ServiceForm'; // Adjust the import path as necessary
import { updateServiceInfo } from '../state/new actions/serviceAction'; // Import the external dependency
import { act } from 'react-dom/test-utils';

jest.mock('../state/new actions/serviceAction'); // Mock the external dependency
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
describe('ServiceForm Component', () => {
  const mockData = {
    id: "b9005fb2-cbb1-4f1e-a925-36090700327e",
    name: "Test Service",
    description: "This is a test service",
    url: "http://testservice.com",
    createdOn: "2023-10-05T15:42:37.130Z",
    updatedOn: "2023-10-05T15:42:40.210Z",
    parameterJsonData: ""
  };

  it('renders with initial data', () => {
    render(<ServiceForm data={mockData} />);
    expect(screen.getByDisplayValue('Test Service')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test service')).toBeInTheDocument();
    expect(screen.getByDisplayValue('http://testservice.com')).toBeInTheDocument();
    // Add more assertions as necessary
  });

  it('allows entering edit mode', () => {
    render(<ServiceForm data={mockData} />);
    const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
    act(() => {
        userEvent.type(descriptionInput, 'Updated Service Description');
    });
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
  

  it('handles form submission', async () => {
    render(<ServiceForm data={mockData} />);
    
    const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
    await act(async () => {
        userEvent.clear(descriptionInput);
        await userEvent.type(descriptionInput, 'Updated Service Description');
    });
  
    await act(async () => {
        userEvent.click(screen.getByRole('button', { name: 'Save' }));
    });
  
    // Wait for the state to be updated and the mock function to be called
    await waitFor(() => {
      expect(updateServiceInfo).toHaveBeenCalledWith({
        ...mockData,
        description: 'Updated Service Description',
      },"",expect.anything());
    });
  });

  it('does not update the name field when it is disabled', () => {
    render(<ServiceForm data={mockData} />);
    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    expect(nameInput).toBeDisabled();
    userEvent.type(nameInput, 'Updated Service Name');
    expect(nameInput).toHaveValue('Test Service');
  });

  it('updates the description field when it is not disabled', () => {
    render(<ServiceForm data={mockData} />);
    const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
    act(() => {
        userEvent.clear(descriptionInput);
        userEvent.type(descriptionInput, 'Updated Service Description');
    });
    expect(descriptionInput).toHaveValue('Updated Service Description');
  });
});
  

  describe('DateComponent Function', () => {
    it('formats MongoDB date correctly', () => {
      const date = '2023-10-05T15:42:37.130Z';
      const { DateComponent } = require('../utils/dateComponent'); // Adjust the path as necessary
      const formattedDate = DateComponent(date);
      expect(formattedDate).toMatch(/\Oct\b/); // Add more specific assertions for the date format
    });
  });

  describe('ServiceForm Component UI elements', () => {
    const mockData = {
        _id: "651ed96df21d9feeaca71ba9",
        documentId: "SERVICE#b9005fb2-cbb1-4f1e-a925-36090700327e",
        serviceId: "b9005fb2-cbb1-4f1e-a925-36090700327e",
        serviceName: "Test Service",
        serviceDescription: "This is a test service",
        serviceURL: "http://testservice.com",
        serviceStatus: true,
        createdOn: "2023-10-05T15:42:37.130Z",
        updatedAt: "2023-10-05T15:42:40.210Z",
        __v: 0,
        serviceParameters: []
      };
    beforeEach(() => {
      render(<ServiceForm data={mockData} />);
    });

    it('renders the Name input field', () => {
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    });

    it('renders the Description input field', () => {
      expect(screen.getByRole('textbox', { name: 'Description' })).toBeInTheDocument();
    });

    it('renders the URL input field', () => {
      expect(screen.getByRole('textbox', { name: 'URL' })).toBeInTheDocument();
    });

    it('renders the Created At input field', () => {
      expect(screen.getByRole('textbox', { name: 'Created On' })).toBeInTheDocument();
    });

    // it('renders the Create button in creation mode', () => {  //Not using create Service through this component
    //   render(<ServiceForm data={{}} />); // Render with em  pty data for creation mode
    //   expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    // });

    it('renders the Save button in edit mode', () => {
      const saveButton = screen.queryByRole('button', { name: 'Save' });
      if (!saveButton) {
        act(() => {
          const descriptionInput = screen.getByRole('textbox', { name: 'Description' });
          userEvent.type(descriptionInput, 'Updated Service Description');
        });
      }
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });
  });
