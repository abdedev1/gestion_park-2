import { useState, useRef, useEffect } from "react"
import { addPark, getParks, getSpots, addSpot, deleteSpot } from "../../../assets/api/parks/park"
import { Button, Tabs, Form, message, Modal, Input, Table, Space, Popconfirm, Select } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined, ArrowRightOutlined } from "@ant-design/icons"

export default function ParkList() {
  const [parks, setParks] = useState([])
  const [spots, setSpots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeKey, setActiveKey] = useState("")
  const newTabIndex = useRef(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [spotForm] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const fetchParks = async () => {
    setLoading(true)
    try {
      const data = await getParks()
      setParks(data)

      // Initialize tabs with park data if parks exist
      if (data.length > 0) {
        setActiveKey(data[0].id || "1") // Use park.id or fallback to index
      }
    } catch (error) {
      console.error("Error fetching parks:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpots = async () => {
    setLoading(true)
    try {
      const data = await getSpots()
      setSpots(data)
    } catch (error) {
      console.error("Error fetching spots:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPark = async (values) => {
    try {
      await addPark(values)
      messageApi.success("Park added successfully")
      setIsAddModalOpen(false)
      form.resetFields()
      fetchParks()
    } catch (error) {
      console.error("Error adding park:", error)
      messageApi.error(error.response?.data?.message || "Failed to add park. Please try again.")
    }
  }

  const handleAddSpot = async (values) => {
    try {
      values.parc_id = activeKey // Add the current park ID
      await addSpot(values)
      messageApi.success("Spot added successfully")
      setIsAddSpotModalOpen(false)
      spotForm.resetFields()
      fetchSpots()
      fetchParks()
    } catch (error) {
      console.error("Error adding spot:", error)
      messageApi.error(error.response?.data?.message || "Failed to add spot. Please try again.")
    }
  }

  const handleDeleteSpots = async () => {
    try {
      await deleteSpot(selectedRowKeys)
      messageApi.success("Spots deleted successfully")
      setSelectedRowKeys([])
      fetchSpots()
    } catch (error) {
      console.error("Error deleting spots:", error)
      messageApi.error(error.response?.data?.message || "Failed to delete spots. Please try again.")
    }
  }

  // Remove the handleAllocateSpot function since it's no longer needed
  // Delete or comment out this function:
  // const handleAllocateSpot = (spotId) => {
  //   // Implement spot allocation logic here
  //   messageApi.info(`Allocating spot ${spotId}`)
  // }

  useEffect(() => {
    fetchParks()
    fetchSpots()
  }, [])

  const onChange = (key) => {
    setActiveKey(key)
  }

  const remove = (targetKey) => {
    const newParks = parks.filter((park) => park.id !== targetKey)
    setParks(newParks)

    if (newParks.length && targetKey === activeKey) {
      const newActiveKey = newParks[newParks.length - 1].id
      setActiveKey(newActiveKey)
    } else if (newParks.length === 0) {
      setActiveKey("")
    }
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  const hasSelected = selectedRowKeys.length > 0

  const columns = [
    {
      title: "Name of spot",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text || "No restrictions",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Park ID",
      dataIndex: "parc_id",
      key: "parc_id",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" icon={<ArrowRightOutlined />} />
        </Space>
      ),
    },
  ]

  // Convert parks to tab items
  const parkTabs = parks.map((park) => ({
    label: park.name || `Park ${park.id}`,
    children: (
      <div>
        <div className="park-details">
          <h3>{park.nom}</h3>
          <p>Number of spots: {park.numberSpots || 0}</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => setIsAddSpotModalOpen(true)}
            icon={<PlusOutlined />}
            style={{ marginRight: 8, backgroundColor: "#1677ff" }}
          >
            Add spots
          </Button>
          <Popconfirm
            title="Are you sure you want to delete these spots?"
            onConfirm={handleDeleteSpots}
            okText="Yes"
            cancelText="No"
            disabled={!hasSelected}
          >
            <Button danger disabled={!hasSelected} icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={spots.filter((spot) => spot.parc_id === park.id)}
          rowKey="id"
          pagination={false}
          footer={() => `${spots.filter((spot) => spot.parc_id === park.id).length} Spot(s)`}
          className="spots-table"
        />
      </div>
    ),
    key: park.id,
  }))

  return (
    <div className="flex flex-col gap-4 p-4">
      {contextHolder}
      <h1 className="text-2xl font-bold">Parks List</h1>
      <div style={{ marginBottom: 16 }}>
        <Button
          onClick={() => {
            form.resetFields()
            setIsAddModalOpen(true)
          }}
          type="primary"
          style={{ backgroundColor: "#1677ff" }}
        >
          ADD PARK
        </Button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && parks.length > 0 && (
        <Tabs
          type="card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={() => {
            form.resetFields()
            setIsAddModalOpen(true)
          }}
          items={parkTabs}
        />
      )}
      {!loading && !error && parks.length === 0 && <p>No parks found. Click "ADD PARK" to create one.</p>}

      {/* Add Park Modal */}
      <Modal title="Add New Park" open={isAddModalOpen} onCancel={() => setIsAddModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddPark} className="py-4">
          <Form.Item name="nom" label="Nom" rules={[{ required: true, message: "Please enter park name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="adresse" label="Adresse" rules={[{ required: true, message: "Please enter park address" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="numberSpots"
            label="Number of Spots"
            rules={[{ required: true, message: "Please enter number of spots" }]}
          >
            <Input type="number" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#0891b2" }}>
              Add Park
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Spot Modal */}
      <Modal title="Add New Spot" open={isAddSpotModalOpen} onCancel={() => setIsAddSpotModalOpen(false)} footer={null}>
        <Form form={spotForm} layout="vertical" onFinish={handleAddSpot} className="py-4">
         
          <Form.Item name="type" label="Type"> 
            <Select placeholder="Select a type">
              <Select.Option value="voiture">Voiture</Select.Option>
              <Select.Option value="handicap">Handicap</Select.Option>
              <Select.Option value="electric">Electric Vehicle</Select.Option>
              <Select.Option value="moto">moto</Select.Option>
              <Select.Option value="velo">velo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="available">
            <Select>
              <Select.Option value="disponible">Available</Select.Option>
              <Select.Option value="reserve">reserve</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddSpotModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#0891b2" }}>
              Add Spot
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
