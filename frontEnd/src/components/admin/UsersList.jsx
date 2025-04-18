import { useEffect, useState } from "react"
import { axios } from "../../assets/api/axios"
import { message, Popconfirm, Modal, Form, Input, Select, Table, Spin } from "antd"
import { CircleHelp, Pencil, Trash2, Loader2 } from "lucide-react"
import { getUsers, updateUser } from "../../assets/api/admin/users"
import { getRoles } from "../../assets/api/roles/roles"

function UsersList() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const [activeFilter, setActiveFilter] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error("Error fetching Users:", error)
      messageApi.error(error.response?.data?.message || "Failed to load Users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    setLoading(true)
    try {
      const data = await getRoles()
      setRoles(data)
    } catch (error) {
      console.error("Error fetching roles:", error)
      messageApi.error(error.response?.data?.message || "Failed to load roles. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  // Apply filters when users, activeFilter, or searchQuery changes
  useEffect(() => {
    let result = [...users]

    // Apply role filter
    if (activeFilter) {
      result = result.filter((user) => user.role && user.role.toLowerCase() === activeFilter.toLowerCase())
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) =>
          (user.first_name && user.first_name.toLowerCase().includes(query)) ||
          (user.last_name && user.last_name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)),
      )
    }

    setFilteredUsers(result)
  }, [users, activeFilter, searchQuery])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`)
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      message.success("User deleted successfully")
    } catch (error) {
      message.error("Error deleting user")
    }
  }

  const showUpdateModal = (user) => {
    setSelectedUser(user)
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date?.split("T")[0],
      role_id: getRoleIdByName(user.role),
    })
    setIsModalOpen(true)
  }

  const getRoleIdByName = (roleName) => {
    const role = roles.find((r) => r.name === roleName)
    return role ? role.id : null
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    form.resetFields()
  }

  const handleUpdateUser = async (values) => {
    try {
      if (!selectedUser) return

      // Format the data properly before sending
      const formattedValues = {
        ...values,
        birth_date: values.birth_date || selectedUser.birth_date,
      }

      const updatedUser = await updateUser(selectedUser.id, formattedValues)

      // Find the role name for display
      const selectedRole = roles.find((role) => role.id === values.role_id)
      const roleName = selectedRole ? selectedRole.name : ""

      // Update the local state with the updated user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...updatedUser,
                role: roleName, // Make sure the role is updated in the UI
              }
            : user,
        ),
      )

      message.success("User updated successfully")
      handleModalCancel()
    } catch (error) {
      console.error("Update error:", error)
      message.error(error.response?.data?.message || error.response?.data?.error || "Error updating user")
    }
  }

  const handleFilterClick = (role) => {
    setActiveFilter(activeFilter === role ? null : role)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (text) => <div className="flex items-center gap-2">{text}</div>,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      responsive: ["md"],
    },
    {
      title: "Birth Date",
      dataIndex: "birth_date",
      key: "birth_date",
      responsive: ["lg"],
      render: (date) => date?.split("T")[0] || "",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["lg"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <>
          <Popconfirm
            placement="topLeft"
            title="Delete the User?"
            description={`Are you sure you want to delete this User ID ${record.id}?`}
            okText="Yes"
            cancelText="No"
            icon={<CircleHelp size={16} className="m-1" />}
            onConfirm={() => handleDelete(record.id)}
          >
            <button className="join-item btn btn-outline btn-secondary btn-sm">
              <Trash2 size={16} />
            </button>
          </Popconfirm>
          <button className="join-item btn btn-outline ml-5 btn-primary btn-sm" onClick={() => showUpdateModal(record)}>
            <Pencil size={16} />
          </button>
        </>
      ),
    },
  ]

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Users List</h1>
          <span className="badge badge-outline badge-lg m-3 count">{filteredUsers.length}</span>
        </div>
      </div>

      <div className="flex justify-end p-3 gap-3">
        <div className="flex gap-1.5">
          {["admin", "client", "employe"].map((role) => (
            <button
              key={role}
              className={`btn btn-outline px-4 ${activeFilter === role ? "btn-primary" : "btn-outline"} border-primary/50 btn-sm rounded-full capitalize`}
              onClick={() => handleFilterClick(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <label className="input input-sm w-1/6">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </g>
          </svg>
          <input type="search" className="grow" placeholder="Search" value={searchQuery} onChange={handleSearch} />
        </label>
      </div>

      <div className=" after:bg-gray-700 before:bg-gray-700 my-0 mx-4" />

      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg shadow container mx-auto py-6">
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={{
              indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
              spinning: loading,
            }}
            pagination={{ pageSize: 6 }}
          />
        </div>
      </div>

      <Modal title="Update User" open={isModalOpen} onCancel={handleModalCancel} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleUpdateUser} className="mt-4">
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: "Please enter last name" }]}>
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
          <Form.Item name="role_id" label="Role" rules={[{ required: true, message: "Please select a role" }]}>
            <Select>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <button type="button" className="btn btn-outline btn-sm mr-2" onClick={handleModalCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Update User
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UsersList
