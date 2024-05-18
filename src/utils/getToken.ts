import { useMsal } from "@azure/msal-react";


export function useToken() {
  const st = useMsal();

  const getToken = (): string => {
    if (st) {
      const { instance }=st
      const activeAccount = instance.getActiveAccount();
      const prop = activeAccount?.idTokenClaims;
      if (!activeAccount || !prop) return "";
      
      const homeAccId: string = activeAccount.homeAccountId;
      const tenantId: string = activeAccount.tenantId;
      const aud: any = prop.aud;
      const sId = `${homeAccId}-login.windows.net-idtoken-${aud}-${tenantId}---`;
      const sessionValue: any = sessionStorage.getItem(sId);
      const jsonObj = JSON.parse(sessionValue || '{}');
      const token = jsonObj.secret;
      return token;
    }
    return "";
  };

  // Return the getToken function for use within components
  return getToken;
}

// Correctly named custom hook for handling logout redirect
export function useLogoutRedirect() {
  const st = useMsal();

  const handleLogoutRedirect = () => {
    if(st){
    const { instance }=st
    instance.logoutRedirect().catch((error: any) => console.log(error));
    }
    else{
      console.log("Please login again")
    }
  };

  // Return the handleLogoutRedirect function for use within components
  return handleLogoutRedirect;
}


