import { useState, useRef, useEffect } from "react"
import { addPark,updatePark,updateSpot, getParks, deleteMultipleSpots, addSpot } from "../../../assets/api/parks/park"
import { Button, Tabs, Form, message, Modal, Input, Table, Space, Popconfirm, Select, Spin } from "antd"
import { Loader2, Plus } from "lucide-react"
import { UpdateParkModal, UpdateSpotModal } from "./updateModals";

import { EditOutlined, DeleteOutlined, ArrowRightOutlined } from "@ant-design/icons"

export default function ParkList() {
  const [parks, setParks] = useState([])
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

  const [isUpdateParkModalOpen, setIsUpdateParkModalOpen] = useState(false)
  const [isUpdateSpotModalOpen, setIsUpdateSpotModalOpen] = useState(false)
  const [currentPark, setCurrentPark] = useState(null)
  const [currentSpot, setCurrentSpot] = useState(null)

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

  
  
  const handleAddPark = async (values) => {
    try {
      const res = await addPark(values)
      messageApi.success("Park added successfully")
      setIsAddModalOpen(false)
      form.resetFields()
      const updatedParks = [...parks, res.parc]
      setParks(updatedParks)
    } catch (error) {
      console.error("Error adding park:", error)
      messageApi.error(error.response?.data?.message || "Failed to add park. Please try again.")
    }
  }



  const handleAddSpot = async (values) => {
    try {
      values.parc_id = activeKey // Add the current park ID
      const res = await addSpot(values)
      messageApi.success("Spot added successfully")
      setIsAddSpotModalOpen(false)
      spotForm.resetFields()
      const updatedParks = parks.map((park) => park.id === activeKey ? { ...park, spots: [...park.spots, res.spot] }: park);
      setParks(updatedParks);
    } catch (error) {
      console.error("Error adding spot:", error)
      messageApi.error(error.response?.data?.message || "Failed to add spot. Please try again.")
    }
  }

  
  

  const handleDeleteSpots = async () => {
    try {
      const res = await deleteMultipleSpots(selectedRowKeys);
      if (res.success) {
        messageApi.success(`${selectedRowKeys.length} Spots deleted successfully`);
        setSelectedRowKeys([]);
  
        const updatedParks = parks.map((park) => park.id === activeKey ? { ...park, spots: park.spots.filter(spot => !selectedRowKeys.includes(spot.id))}: park);
        setParks(updatedParks);
      }
    } catch (error) {
      console.error("Error deleting spots:", error);
      messageApi.error(error.response?.data?.message || "Failed to delete spots. Please try again.");
    }
  };

  const handleUpdatePark = async (updatedData) => {
    try {
      
      const res = await updatePark(currentPark.id, updatedData);
      const updatedParks = parks.map((park) => (park.id === currentPark.id ? res : park))

      setParks(updatedParks)
      messageApi.success("Park updated successfully")
    } catch (error) {
      console.error("Error updating park:", error)
      messageApi.error("Failed to update park. Please try again.")
    }
  }
  

  const handleUpdateSpot = async (updatedData) => {
    try {
      const res = await updateSpot(currentSpot.id, updatedData);
      const updatedParks = parks.map((park) => {
        if (park.id === activeKey) {
          const updatedSpots = park.spots.map((spot) =>
            spot.id === currentSpot.id ? res.spot : spot,
          )
          return { ...park, spots: updatedSpots }
        }
        return park
      })

      setParks(updatedParks)
      messageApi.success("Spot updated successfully")
    } catch (error) {
      console.error("Error updating spot:", error)
      messageApi.error("Failed to update spot. Please try again.")
    }
  }
  

  useEffect(() => {
    fetchParks()
  }, [])

  const onChange = (key) => {
    setActiveKey(Number(key))
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }
  const openUpdateParkModal = (park) => {
    setCurrentPark(park)
    setIsUpdateParkModalOpen(true)
  }

  // Open update spot modal
  const openUpdateSpotModal = (spot) => {
    setCurrentSpot(spot)
    setIsUpdateSpotModalOpen(true)
  }


  const hasSelected = selectedRowKeys.length > 0

  const columns = [
    {
      title: "Name of spot",
      dataIndex: "nom",
      key: "nom",
      className: "font-medium",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <span className="text-gray-700">{text || "No restrictions"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusClass = "bg-gray-100 text-gray-800"
        if (status === "disponible") statusClass = "bg-green-100 text-green-800"
        else if (status === "reserve") statusClass = "bg-yellow-100 text-yellow-800"
        else if (status === "maintenance") statusClass = "bg-red-100 text-red-800"

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{status || "Unknown"}</span>
        )
      },
    },
    {
      title: "Park ID",
      dataIndex: "parc_id",
      key: "parc_id",
      className: "text-gray-600",
    },

    {
      title: "Actions",
      key: "action",

      render: (_, record) => (
        <Space size="middle">
           <Button
            type="text"
            icon={<EditOutlined className="text-gray-600 hover:text-gray-900" />}
            className="hover:bg-gray-100"
            onClick={() => openUpdateSpotModal(record)}
          />
          <Button
            type="text"
            icon={<ArrowRightOutlined className="text-gray-600 hover:text-gray-900" />}
            className="hover:bg-gray-100"
          />
        </Space>
      ),
    },
  ]


  const parkTabs = parks.map((park) => ({
    label: (
      <div className="flex items-center">
        <span>{park.nom || `Park ${park.id}`}</span>
        <Button
          type="text"
          icon={<EditOutlined className="text-gray-600 hover:text-gray-900" />}
          className="ml-2 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation() 
            openUpdateParkModal(park)
          }}
        />
      </div>
    ),
      children: (
        <div className="bg-white rounded-lg shadow-sm">
        <div className="park-details p-4 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{park.nom}</h3>
          <p className="text-sm text-gray-600">Number of spots: {park.spots.length || 0}</p>
        </div>
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              type="primary"
              onClick={() => setIsAddSpotModalOpen(true)}
              icon={<Plus className="h-4 w-4 mr-2" />}
              style={{
                backgroundColor: "#0891b2",
                display: "flex",
                alignItems: "center",
              }}
              className="hover:opacity-90 transition-opacity shadow-sm"
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
              <Button danger disabled={!hasSelected} icon={<DeleteOutlined />} className="flex items-center">
                Delete
              </Button>
            </Popconfirm>
            <span className="flex items-center text-sm text-gray-500">
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
            </span>
          </div>

          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={park.spots}
            rowKey="id"
           
            className="spots-table"
            loading={{
              indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-cyan-600" />} />,
              spinning: loading,
            }}
            pagination={{
              pageSize: 5,
              className: "flex justify-end",
            }}
            rowClassName="hover:bg-gray-50"
          />
        </div>
      </div>
    ),
    key: park.id,
  }))

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 min-h-screen">
      {contextHolder}
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">Parks Management</h1>
      <div className="mb-4">
        <Button
          onClick={() => {
            form.resetFields()
            setIsAddModalOpen(true)
          }}
          type="primary"
          icon={<Plus className="h-4 w-4 mr-2" />}
          style={{
            backgroundColor: "#0891b2",
            display: "flex",
            alignItems: "center",
          }}
          className="hover:opacity-90 transition-opacity shadow-sm"
        >
          ADD PARK
        </Button>
      </div>

      {!loading && !error && parks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            type="card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={() => {
              form.resetFields()
              setIsAddModalOpen(true)
            }}
            items={parkTabs}
            className="p-1"
            tabBarGutter={5}
          />
        </div>
      )}
      {!loading && !error && parks.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No parks found. Click "ADD PARK" to create one.</p>
        </div>
      )}

      {/* Add Park Modal */}
      <Modal
        title={<span className="text-lg font-medium">Add New Park</span>}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPark} className="py-4">
          <Form.Item
            name="nom"
            label={<span className="font-medium">Park Name</span>}
            rules={[{ required: true, message: "Please enter park name" }]}
          >
            <Input className="rounded" placeholder="Enter park name" />
          </Form.Item>
          <Form.Item
            name="adresse"
            label={<span className="font-medium">Address</span>}
            rules={[{ required: true, message: "Please enter park address" }]}
          >
            <Input className="rounded" placeholder="Enter park address" />
          </Form.Item>
          <Form.Item
            name="numberSpots"
            label={<span className="font-medium">Number of Spots</span>}
            rules={[{ required: true, message: "Please enter number of spots" }]}
          >
            <Input type="number" className="rounded" placeholder="Enter number of spots" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)} className="rounded">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#0891b2" }}
              className="rounded hover:opacity-90"
            >
              Add Park
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Spot Modal */}
      <Modal
        title={<span className="text-lg font-medium">Add New Spot</span>}
        open={isAddSpotModalOpen}
        onCancel={() => setIsAddSpotModalOpen(false)}
        footer={null}
      >
        <Form form={spotForm} layout="vertical" onFinish={handleAddSpot} className="py-4">
         
          <Form.Item name="type" label={<span className="font-medium">Type</span>}>
            <Select placeholder="Select a type" className="rounded">
              <Select.Option value="voiture">Voiture</Select.Option>
              <Select.Option value="handicap">Handicap</Select.Option>
              <Select.Option value="electric">Electric Vehicle</Select.Option>
              <Select.Option value="moto">Moto</Select.Option>
              <Select.Option value="velo">Velo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label={<span className="font-medium">Status</span>} initialValue="disponible">
            <Select className="rounded">
              <Select.Option value="disponible">Available</Select.Option>
              <Select.Option value="reserve">Reserved</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddSpotModalOpen(false)} className="rounded">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#0891b2" }}
              className="rounded hover:opacity-90"
            >
              Add Spot
            </Button>
          </div>
        </Form>
      </Modal>
      {currentPark && (
        <UpdateParkModal
          isOpen={isUpdateParkModalOpen}
          onClose={() => {
            setIsUpdateParkModalOpen(false)
            setCurrentPark(null)
          }}
          park={currentPark}
          onUpdate={handleUpdatePark}
        />
      )}
      {currentSpot && (
        <UpdateSpotModal
          isOpen={isUpdateSpotModalOpen}
          onClose={() => {
            setIsUpdateSpotModalOpen(false)
            setCurrentSpot(null)
          }}
          spot={currentSpot}
          onUpdate={handleUpdateSpot}
        />
      )}
    </div>
  )
}
