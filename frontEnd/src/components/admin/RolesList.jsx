import { useEffect, useState } from "react"
import { Edit, Loader2, MoreHorizontal, Plus, RefreshCw, Shield, Trash2 } from "lucide-react"
import { Button, Table, Modal, Form, Input, Dropdown, Spin, message } from "antd"
import {addRole, deleteRole, getRoles, updateRole} from "../../assets/api/roles/roles"
import TextArea from "antd/es/input/TextArea"


export default function RolesList() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  // Fetch roles from API
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
    fetchRoles();
  }, []);

  // Open edit modal with role data
  const handleEditClick = (role) => {
    setCurrentRole(role)
    editForm.setFieldsValue({
      name: role.name,
      description: role.description,
    })
    setIsEditModalOpen(true)
  }

  // Open delete confirmation modal
  const handleDeleteClick = (role) => {
    setCurrentRole(role)
    setIsDeleteModalOpen(true)
  }

  // Add new role
  const handleAddRole = async (values) => {
    try {
      await addRole(values);
      messageApi.success("Role added successfully");
      setIsAddModalOpen(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      console.error("Error adding role:", error);
      messageApi.error(error.response?.data?.message || "Failed to add role. Please try again.");
    }
  };

  // Update existing role
  const handleUpdateRole = async (values) => {
    if (!currentRole) return;

    try {
      await updateRole(currentRole.id, values);
      messageApi.success("Role updated successfully");
      setIsEditModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      messageApi.error(error.response?.data?.message || "Failed to update role. Please try again.");
    }
  };

  // Delete role
  const handleDeleteRole = async () => {
    if (!currentRole) return;

    try {
      await deleteRole(currentRole.id);
      messageApi.success("Role deleted successfully");
      setIsDeleteModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      messageApi.error(error.response?.data?.message || "Failed to delete role. Please try again.");
    }
  };

  // Define dropdown menu items for each row
  const getDropdownItems = (role) => [
    {
      key: "edit",
      label: (
        <a onClick={() => handleEditClick(role)} className="flex items-center">
          <Edit className="mr-2 h-4 w-4 text-cyan-600" />
          Edit
        </a>
      ),
    },
    {
      key: "delete",
      label: (
        <a onClick={() => handleDeleteClick(role)} className="flex items-center text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </a>
      ),
    },
  ]

  // Define table columns
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-600" />
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      responsive: ["lg"],
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Dropdown menu={{ items: getDropdownItems(record) }} placement="bottomRight">
          <Button type="text" icon={<MoreHorizontal className="h-4 w-4" />} />
        </Dropdown>
      ),
    },
  ]

  return (
    <div className="container mx-auto py-6">
      {contextHolder}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Roles Management</h1>
         
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchRoles()}
            icon={<RefreshCw className="h-4 w-4 mr-2" />}
            style={{ display: "flex", alignItems: "center" }}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.resetFields()
              setIsAddModalOpen(true)
            }}
            icon={<Plus className="h-4 w-4 mr-2" />}
            style={{
              backgroundColor: "#0891b2",
              display: "flex",
              alignItems: "center",
            }}
          >
            Add New Role
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Add Role Modal */}
      <Modal title="Add New Role" open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddRole} className="py-4">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter role name" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter role description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#0891b2" }}>
              Add Role
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Role Modal */}
      <Modal title="Edit Role" open={isEditModalOpen} onCancel={() => setIsEditModalOpen(false)} footer={null}>
        <Form form={editForm} layout="vertical" onFinish={handleUpdateRole} className="py-4">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter role name" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter role description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#0891b2" }}>
              Update Role
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Role"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger onClick={handleDeleteRole}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this role? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
