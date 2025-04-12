import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { message, Popconfirm, Modal, Form, Input, Select } from "antd";
import { HelpCircle as CircleHelp, Pencil, Trash2 } from "lucide-react";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  


  useEffect(()=>{
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  })
  useEffect(() => {
    const source = axios.CancelToken.source();
    
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          cancelToken: source.token,
        });
        
        setUsers(response.data.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError("Error fetching users");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      source.cancel("Component unmounted, request canceled");
    };
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
      const response = await axios.put(
        `http://localhost:8000/api/users/${selectedUser.id}`,
        values
      );
      
      // Check if response.data exists and has a data property
      const updatedUser = response.data?.data || response.data;
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      message.success("User updated successfully");
      handleModalCancel();
    } catch (error) {
      console.error("Update error:", error);
      message.error(error.response?.data?.message || "Error updating user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-4xl text-center">User List</h1>
          <span className="badge badge-outline badge-lg m-3 count">
            {users.length}
          </span>
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

      <div className="divider after:bg-gray-700 before:bg-gray-700 my-0 mx-4" />
      
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthday</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-base-300">
                <td>
                  <div className="font-bold">{user.id}</div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <Link to={`/users/${user.id}`} />
                      </div>
                    </div>
                    <div className="font-bold capitalize">{user.first_name}</div>
                  </div>
                </td>
                <td>
                  <div className="font-bold">{user.last_name}</div>
                </td>
                <td>
                  <div className="font-bold">{user.birth_date}</div>
                </td>
                <td>
                  <div className="font-bold">{user.email}</div>
                </td>
                <td>
                  <div className="font-bold capitalize">{user.role}</div>
                </td>
                <td>
                  <div className="join">
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
                        <Trash2 size={16} /> Delete
                      </button>
                    </Popconfirm>
                    <button
                      className="join-item btn btn-outline btn-primary btn-sm"
                      onClick={() => showUpdateModal(user)}
                    >
                      <Pencil size={16} /> Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Update User"
        open={isModalOpen}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          
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
            <button type="submit" className="btn btn-primary btn-sm">
              Update User
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UsersList;