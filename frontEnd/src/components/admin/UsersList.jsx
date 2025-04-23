import { useEffect, useState } from "react"
import { axios } from "../../assets/api/axios"
import { message, Popconfirm, Modal, Form, Input, Select, Table, Spin } from "antd"
import { CircleHelp, Pencil, Trash2, Loader2 } from "lucide-react"
import { getEmployes, getUsers, updateUser } from "../../assets/api/admin/users"
import { getRoles } from "../../assets/api/roles/roles"
import { getParks } from "../../assets/api/parks/park"

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
  const [parks, setParks] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [employeeData, setEmployeeData] = useState({})

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
      setFilteredUsers(data)
      const employeeIds = data.filter((user) => user.role === "employe").map((user) => user.id)
      if (employeeIds.length > 0) {
        await fetchEmployeeData(employeeIds)
      }
    } catch (error) {
      console.error("Error fetching Users:", error)
      messageApi.error(error.response?.data?.message || "Failed to load Users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployeeData = async (userIds) => {
    try {
      const response = await getEmployes(userIds)
      const employeeMapping = {}
      response.forEach((emp) => {
        employeeMapping[emp.user_id] = emp
      })

      setEmployeeData(employeeMapping)
    } catch (error) {
      console.error("Error fetching employee data:", error)
      messageApi.error("Failed to load employee data. Please try again.")
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

  const fetchParks = async () => {
    try {
      const data = await getParks()
      setParks(data)
    } catch (error) {
      console.error("Error fetching parks:", error)
      messageApi.error("Failed to load parks. Please try again.")
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
    fetchParks()
  }, [])

  useEffect(() => {
    let result = [...users]
    if (activeFilter) {
      result = result.filter((user) => user.role && user.role.toLowerCase() === activeFilter.toLowerCase())
    }
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
    const roleId = getRoleIdByName(user.role)
    setSelectedRole(user.role)

    const employeeInfo = employeeData[user.id] || {}

    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date?.split("T")[0],
      role_id: roleId,
      park_id: employeeInfo.park_id || undefined,
    })
    setIsModalOpen(true)
  }

  const getRoleIdByName = (roleName) => {
    const role = roles.find((r) => r.name === roleName)
    return role ? role.id : null
  }

  const getRoleNameById = (roleId) => {
    const role = roles.find((r) => r.id === roleId)
    return role ? role.name : null
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    setSelectedRole(null)
    form.resetFields()
  }

  const handleUpdateUser = async (values) => {
    try {
      if (!selectedUser) return

      const formattedValues = {
        ...values,
        birth_date: values.birth_date || selectedUser.birth_date,
      }

      const { park_id, ...userData } = formattedValues

      const updatedUser = await updateUser(selectedUser.id, userData)

      const roleName = getRoleNameById(values.role_id)

      if (roleName === "employe") {
        try {
          const employeeExists = employeeData[selectedUser.id]

          if (employeeExists) {
            await axios.put(`http://localhost:8000/api/employes/${employeeData[selectedUser.id].id}`, {
              park_id: park_id,
            })
          } else {
            await axios.post(`http://localhost:8000/api/employes`, {
              user_id: selectedUser.id,
              park_id: park_id,
            })
          }

          setEmployeeData((prev) => ({
            ...prev,
            [selectedUser.id]: {
              ...(prev[selectedUser.id] || {}),
              user_id: selectedUser.id,
              park_id: park_id,
            },
          }))
        } catch (error) {
          console.error("Error updating employee data:", error)
          messageApi.error("User updated but failed to update employee data.")
        }
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...updatedUser,
                role: roleName, 
              }
            : user,
        ),
      )

      message.success("User updated successfully")
      handleModalCancel()
    } catch (error) {
      console.error("Update error:", error)
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating user")
    }
  }

  const handleRoleChange = (value) => {
    const roleName = getRoleNameById(value)
    setSelectedRole(roleName)
  }

  const handleFilterClick = (role) => {
    setActiveFilter(activeFilter === role ? null : role)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Function to get park name by ID
  const getParkName = (parkId) => {
    const park = parks.find((p) => p.id === parkId)
    return park ? park.name : `Park ${parkId}`
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
      title: "Assigned Park",
      key: "park",
      responsive: ["lg"],
      render: (_, record) => {
        // Only show park for employees
        if (record.role !== "employe") return "Not applicable"

        // Get employee data for this user
        const employee = employeeData[record.id]
        if (!employee || !employee.park_id) return "Not assigned"

        return getParkName(employee.park_id)
      },
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
        <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Users Management
        </h1>
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

      <Modal title="Update User" open={isModalOpen} onCancel={handleModalCancel} footer={null}>
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
            <Select onChange={handleRoleChange}>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Park ID field - only visible when role is "employe" */}
          {selectedRole === "employe" && (
            <Form.Item
              name="park_id"
              label="Assigned Park"
              rules={[{ required: true, message: "Please select a park for this employee" }]}
            >
              <Select placeholder="Select a park">
                {parks.map((park) => (
                  <Select.Option key={park.id} value={park.id}>
                    {park.name || `Park ID: ${park.id}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

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
