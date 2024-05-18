import { Button, Form, Input, Modal, Select } from "antd"
import { useEffect, useState } from "react";
import { addUser, setUserDuplicacyToNull } from "../state/new actions/userManagementAction";
import { useMsal } from "@azure/msal-react";
import { connect } from 'react-redux';
import { RootState } from "../state/reducers";
import { useLogoutRedirect, useToken } from "../utils/getToken";
const { Option } = Select;

interface IServiceModal{
    isOpen:boolean,
    handleAddUser:(userEmail:string,userRole:string)=>void,
    handleClose:()=>void,
    organizationId:any,
    orgName:string,
    projectNames:any,
    usersList:any | null,
    updateUser_Error:string | null,
    duplicacy:boolean | null,
    newEmail:string | null

}
function UserManagement_AddUserModal({usersList,handleAddUser,orgName,isOpen,handleClose,organizationId,projectNames,updateUser_Error,...prps}:IServiceModal){
  const validateDuplicateEntry = (_: any, value: string, callback: any) => {
    const isDuplicate = usersList.some((item:any) => item.userEmail === value);
    if(updateUser_Error!=null && updateUser_Error==="USER DOES NOT EXIST"){
      callback('User does not exist in arvikasoft');
    }
    // if (isDuplicate) {
    //   callback('Duplicate entry found');
    // } 
    else {
      callback();
    }
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [userRole,setUserRole]=useState("")
  const [projectId,setProjectId]=useState("")
  const [projectExists,setProjectExists]=useState(true)
  const getToken=useToken()
  const handleLogoutRedirect=useLogoutRedirect()

  const errorMessage="* User already present in this organization with different role"



  function onFormChange(v:any){
      setFormData(v);
  }
  

  const handleFormSubmit = () => {
    form.submit()
  };

  const handleCancel = () => {
    // setOpen(false);
    setUserDuplicacyToNull()
    handleClose()
  };
  const onFinish=async(data:any)=>{
    setUserRole(data.userRole)
    if(!projectExists)
      await addUser(data,"#",orgName,getToken(),handleLogoutRedirect)
    
    else{
      const project:any=projectNames.find((project:any) => project.id === projectId);
      await addUser(data,project.name,orgName,getToken(),handleLogoutRedirect)
    }  
  
  }

  const handleSelectProject=(pro:any)=>{
    setProjectId(pro.value)
  }
  const handleChangeRole=(role:any)=>{
      if(role=="OrganizationAdmin")
        setProjectExists(false)
      else 
        setProjectExists(true)
  }
  useEffect(()=>{
    if(prps.duplicacy==false && updateUser_Error==null)
      {
        setOpen(false);
        handleClose()
        if(prps.newEmail!=null)
          handleAddUser(prps.newEmail,userRole)
          setUserDuplicacyToNull()
      }
  },[prps.duplicacy])

  useEffect(()=>{
    if(projectNames.length>0)
      setProjectId(projectNames[0].projectId)
  },[projectNames])

    return(
        <>
            <Modal 
                open={open}
                title="Add User"
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
        <Form layout="vertical" form={form} onFinish={onFinish} onChange={(v:any)=>{onFormChange(v)}} >
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
            <Form.Item label="User Role" name="userRole" style={{textAlign:'left'}} required
              initialValue={"Reader"}
            rules={[
              {
                required:true,
                message: `Please enter user Role !`,
              }
            ]}
            >
              <Select onChange={handleChangeRole}>
                {/* <Option key="superAdmin" value="Super Admin">
                  Super Admin
                </Option> */}
                <Option key="organizationAdmin" value="OrganizationAdmin">
                  Organization Admin
                </Option>
                <Option key="projectAdmin" value="ProjectAdmin">
                  Project Admin
                </Option>
                <Option key="writer" value="Writer">
                  Writer
                </Option>
                <Option key="reader" value="Reader">
                  Reader
                </Option>
              </Select>
            </Form.Item>
            {projectExists==true && <Form.Item label="Project" name="project" style={{textAlign:'left'}} required
                        rules={[
                          {
                            required:true,
                            message: `Please select project!`,
                          }
                        ]}
            >
              <Select 
                  onSelect={handleSelectProject}
                  value={projectId} labelInValue
                  getPopupContainer={node => node.parentNode}
              >
                  {projectNames.map((pro:any)=>{
                      return(
                          <Option key={pro.name} label={pro.name} value={pro.id} props >
                              {pro.name}
                          </Option>
                      )
                  })}
              </Select>
            </Form.Item>}
        </Form>
        </Modal>
        </>
    )
}

const mapStateToProps = (state: RootState) => {
  return {

    updateUser_Error:state.UserManagementReducer.updateUser_Error,
    duplicacy:state.UserManagementReducer.duplicacy,
    newEmail:state.UserManagementReducer.newEmail
  };
};

export default connect(mapStateToProps)(UserManagement_AddUserModal)  
// export default UserManagementAddUserModal

