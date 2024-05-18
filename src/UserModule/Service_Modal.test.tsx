import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import ServiceModal from './Service_Modal';
import { Form } from 'antd';
import { updatingProjectServiceParameterDetailsAPI } from '../state/new actions/projectAction';
import userEvent from '@testing-library/user-event';
beforeAll(() => {
    global.matchMedia = global.matchMedia || function () {
      return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
      };
      };
});
// Mock the external action
jest.mock("../state/new actions/projectAction", () => ({
  updatingProjectServiceParameterDetailsAPI: jest.fn(() => Promise.resolve()),
}));


describe('Project ServiceModal', () => {
    const documentMock = {
      name: 'Test Service',
      description: 'Test Description',
      parameterJsonData: [
        { name: "Parameter 1", type: "Value", value: "example 1" },
        { name: "Parameter 2", type: "Range", lowerBound: "1000", upperBound: "5000", value: "3000" },
        { name: "Parameter 3", type: "Options", options: ["first", "second", "third"], value: "second" }
      ]
    };
    const anotherdocumentMock = {
        name: 'Test Service',
        description: 'Test Description',
        parameterJsonData: []
      };
  
    it('renders correctly', () => {
      const handleClose = jest.fn();
      render(<ServiceModal isOpen={true} handleClose={handleClose} document={documentMock} projectId='098'/>);
      
      expect(screen.getByText('Service Name')).toBeInTheDocument();
      expect(screen.getByText('Test Service')).toBeInTheDocument();
      expect(screen.getByText('Service Description')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Service Parameters')).toBeInTheDocument();
    });

    it('checks for the parameters', () => {
        const handleClose = jest.fn();
        const {queryByText}=render(<ServiceModal isOpen={true} handleClose={handleClose} document={documentMock} projectId='098' />);
        
        expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0); // Checks if text inputs are rendered
        expect(screen.getByText('Parameter 1')).toBeInTheDocument();
        expect(screen.getByText('Parameter 2')).toBeInTheDocument();
        expect(screen.getByText('Parameter 3')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Parameter 1' })).toBeInTheDocument();
        // expect(screen.getByRole('textbox', { name: 'Parameter 2' })).toBeInTheDocument();
        // expect(screen.getByRole('textbox', { name: 'Parameter 3' })).toBeInTheDocument(); 

        expect(screen.getByDisplayValue('example 1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('3000')).toBeInTheDocument();
        expect(screen.queryByText('second')).toBeInTheDocument();
        expect(queryByText('Please enter Parameter 1 value')).not.toBeInTheDocument();
    });
    it('check parameter validation', async () => {
        const handleClose = jest.fn();
        const {queryByText}=render(<ServiceModal isOpen={true} handleClose={handleClose} document={documentMock}  projectId='098'/>);
        
        expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0); // Checks if text inputs are rendered
        expect(screen.getByText('Parameter 1')).toBeInTheDocument();
        const descriptionInput = screen.getByRole('textbox', { name: 'Parameter 1' });
        userEvent.clear(descriptionInput);

        await act(async () => {
            // expect(screen.findByText('Please enter Parameter 1 value !')).toBeInTheDocument();
        })


    });



    it('submits the form with updated values', async () => {
        const handleClose = jest.fn();
        render(<ServiceModal isOpen={true} handleClose={handleClose} document={documentMock}  projectId='098'/>);
      
        // Fill out the form. For simplicity, let's assume we're updating "Parameter 1" only.
        fireEvent.change(screen.getByLabelText('Parameter 1'), { target: { value: 'updated example' } });
      
        // Find and click the save button
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
      
        // Wait for the updatingServiceParameterDetailsAPI to be called
        await waitFor(() => {
          expect(updatingProjectServiceParameterDetailsAPI).toHaveBeenCalledWith(expect.anything(),expect.anything(),expect.anything());
        });
      
        // Check if the modal is requested to close after submission
        expect(handleClose).toHaveBeenCalled();
      });
      


      it('No Parameters', () => {
        const handleClose = jest.fn();
        render(<ServiceModal isOpen={true} handleClose={handleClose} document={anotherdocumentMock}  projectId='098'/>);
        
        expect(screen.getByText('Service Name')).toBeInTheDocument();
        expect(screen.getByText('Test Service')).toBeInTheDocument();
        expect(screen.getByText('Service Description')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('Service Parameters')).toBeInTheDocument();
        expect(screen.getByText('No Parameters')).toBeInTheDocument();
        expect(screen.queryByText('Parameter 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Parameter 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Parameter 3')).not.toBeInTheDocument();
      });
});
  