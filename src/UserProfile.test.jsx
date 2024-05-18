import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserProfile from './UserProfile'; 


jest.mock("@azure/msal-react", () => ({
    useMsal: () => ({
      instance: {
        acquireTokenSilent: jest.fn().mockResolvedValue({
          accessToken: "mockAccessToken123",
          account: { name: "John Doe" },
        }),
      },
      accounts: [{ name: "John Doe" }],
    })
  }));


  describe('UserProfile Component', () => {
    it('displays user details after successful token acquisition', async () => {
      const {getByText}=render(<UserProfile />);
  
      await waitFor(() => expect(screen.getByText(/John Doe/)).toBeInTheDocument());
    });
    it('testing accessToken', async () => {
      const {getByText}=render(<UserProfile />);
      await waitFor(() => expect(screen.getByText(/Your token is: mockAccessToken123/)).toBeInTheDocument());

 
    });
  });
  