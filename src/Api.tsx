export const ApiCall = async (accessToken:string) => {
    try {
      const response = await fetch('https://bimvistaapi.azurewebsites.net/api/ADX/TestAuthorization', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'          
        },
      });

      if (response.ok) {
        const data = await response.json();
        //console.log('API response:', data);
      } else {
        console.error('Failed to call API:', response.statusText);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };