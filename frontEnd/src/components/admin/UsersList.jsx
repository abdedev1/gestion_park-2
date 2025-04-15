import React, { useEffect, useState } from "react";
import {axios} from "../../assets/api/axios";
import { Link } from "react-router-dom";
import { message, Popconfirm, Modal, Form, Input, Select ,Table,Spin,} from "antd";
import { HelpCircle as CircleHelp, Pencil, Trash2 ,Loader2,Shield } from "lucide-react";
import { getUsers, updateUser } from "../../assets/api/admin/users";
import { getRoles } from "../../assets/api/roles/roles";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage()
  




  const fetchUsers = async () => {
      setLoading(true)
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching Users:", error);
        messageApi.error(error.response?.data?.message || "Failed to load Users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        messageApi.error(error.response?.data?.message || "Failed to load roles. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchUsers();
      fetchRoles();
    }, []);





  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      message.success("User deleted successfully");
    } catch (error) {
      message.error("Error deleting user");
    }
  };

  const showUpdateModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleUpdateUser = async (values) => {
    try {
      if (!selectedUser) return;
      
      // Format the data properly before sending
      const formattedValues = {
        ...values,
        birth_date: values.birth_date || selectedUser.birth_date,
        role_id: values.role_id
      };
  
      const updatedUser = await updateUser(selectedUser.id, formattedValues);
      
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      
      message.success("User updated successfully");
      handleModalCancel();
    } catch (error) {
      console.error("Update error:", error);
      message.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "Error updating user"
      );
    }
  };

  
  const columns = [
      {
        title: "#",
        dataIndex: "index",
        key: "index",
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: "first_name",
        dataIndex: "first_name",
        key: "first_name",
        render: (text) => (
          <div className="flex items-center gap-2">
            
            {text}
          </div>
        ),
      },
      {
        title: "last_name",
        dataIndex: "last_name",
        key: "last_name",
        responsive: ["md"],
      },
      {
        title: "birth_date",
        dataIndex: "birth_date",
        key: "birth_date",
        responsive: ["lg"],
       
      },
      {
        title: "email",
        dataIndex: "email",
        key: "email",
        responsive: ["lg"],
       
      },
      {
        title: "role",
        dataIndex: "role",
        key: "role",
        responsive: ["lg"],
       
      },
      {
        title: "Actions",
        key: "actions",
        align: "right",
        render: (user) => (
          <>
            <Popconfirm
              placement="topLeft"
              title="Delete the User?"
              description={`Are you sure you want to delete this User ID ${user.id}?`}
              okText="Yes"
              cancelText="No"
              icon={<CircleHelp size={16} className="m-1" />}
              onConfirm={() => handleDelete(user.id)}
            >
              <button className="join-item btn btn-outline btn-secondary btn-sm">
                <Trash2 size={16} /> 
              </button>
            </Popconfirm>
            <button
              className="join-item btn btn-outline ml-5 btn-primary btn-sm"
              onClick={() => showUpdateModal(user)}
            >
              <Pencil size={16} /> 
            </button>
          </>
        ),
      },
    ]

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Users List</h1>
          {/* <span className="badge badge-outline badge-lg m-3 count">
            {users.length}
          </span> */}
        </div>
      </div>

      <div className="flex justify-end p-3 gap-3">
        <div className="flex gap-1.5">
          {["admin", "manager", "employee", "guest"].map((role) => (
            <button
              key={role}
              className="btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize"
            >
              {role}
            </button>
          ))}
        </div>

        <label className="input input-sm w-1/6">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </svg>
          <input type="search" className="grow" placeholder="Search" />
        </label>
      </div>

      <div className=" after:bg-gray-700 before:bg-gray-700 my-0 mx-4" />
      
      <div className="overflow-x-auto">
      <div className="bg-white rounded-lg shadow  container mx-auto py-6">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 6}}
        />
      </div>
      </div>

      <Modal
        title="Update User"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose // This ensures form is reset when modal closes
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateUser}
          initialValues={{
            birth_date: selectedUser?.birth_date?.split('T')[0] // Format date for input[type="date"]
          }}
          className="mt-4"
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birth_date"
            label="Birth Date"
            rules={[{ required: true, message: "Please enter birth date" }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <button
              type="button"
              className="btn btn-outline btn-sm mr-2"
              onClick={handleModalCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              // Add loading state if needed
            >
              Update User
            </button>
          </Form.Item>
        </Form>
      </Modal>
      
    </div>
    
  );
}

export default UsersList;