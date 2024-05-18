import { Button, Form, Input, Modal } from "antd"
import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid';
import { addOrganizationAdmin, setOrganizationAdminDuplicacyToNull } from "../state/new actions/organizationAction";
import { useMsal } from "@azure/msal-react";
import { RootState } from "../state/reducers";
import { connect } from "react-redux";
import { useLogoutRedirect, useToken } from "../utils/getToken";
interface IServiceModal{
    duplicacy:null | boolean,
    newEmail:string | null,
    isOpen:boolean,
    orgName:string,
    orgId:string,
    handleClose:()=>void,
    usersList:any | null,
    handleAddUser:(userEmail:string)=>void
}
function AddUserModal({isOpen,handleClose,usersList,orgName,orgId,handleAddUser,...prps}:IServiceModal){
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);
  const [formData, setFormData] = useState({});
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()

  const errorMessage="* User already present in this organization with different role"

    useEffect(()=>{

      if(prps.duplicacy==false)
        {
          setOpen(false);
          handleClose()
          setOrganizationAdminDuplicacyToNull()
          if(prps.newEmail!=null)
            handleAddUser(prps.newEmail)

        }
    },[prps.duplicacy])

  function onFormChange(v:any){
      setFormData(v);
  }

  const handleFormSubmit = () => {
    form.submit()
  };

  const handleCancel = () => {
    setOrganizationAdminDuplicacyToNull()
    handleClose()
  };

  const onFinish=async (v:any)=>{
    await addOrganizationAdmin(v,orgName,getToken(),handleLogoutRedirect)
  }


  const validateDuplicateEntry = (_: any, value: string, callback: any) => {
    const isDuplicate = usersList.some((item:any) => item.userEmail === value);

    if (isDuplicate) {
      callback("User already present in this organization")
    } 

    else {
      callback();
    }
  };

    return(
        <>
            <Modal 
                open={open}
                title="Add Organization Admin"
                onOk={handleFormSubmit}
                onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={handleFormSubmit}>
            Add
          </Button>,
          
        ]}
                >
        <Form layout="vertical" form={form}  onFinish={onFinish} >
        {prps.duplicacy && <p style={{color:'red'}}>{errorMessage}</p>}
          <Form.Item label="First Name" name="firstName"   style={{textAlign:'left'}} required
            rules={[
                {
                  required: true,
                  message: 'Please enter user first name!',
                },
              ]}>
                <Input />
            </Form.Item>
          <Form.Item label="Last Name" name="lastName"   style={{textAlign:'left'}} required
            rules={[
                {
                  required: true, 
                  message: 'Please enter user last name!',
                },

              ]}>
                <Input />
            </Form.Item>
            <Form.Item label="User Email" name="userEmail"   style={{textAlign:'left'}} required
            rules={[
                {
                  required: true,
                  message: 'Please enter user email!',
                },
                {
                    type:'email',
                    message:'Please enter valid emailId!'
                },
                { validator: validateDuplicateEntry }
              ]}>
                <Input placeholder="Ex: abc@example.com" />
            </Form.Item>
            
        </Form>
        </Modal>
        </>
    )
}
const mapStateToProps = (state: RootState) => {
  return {
    duplicacy:state.OrganizationFetchReducer.duplicacy,
    newEmail:state.OrganizationFetchReducer.newEmail

  };
};

export default connect(mapStateToProps)(AddUserModal)