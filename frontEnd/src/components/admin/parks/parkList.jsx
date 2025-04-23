import { useState, useRef, useEffect } from "react";
import { addPark, updatePark, updateSpot, getParks, deleteMultipleSpots, addMultipleSpots, deletePark} from "../../../assets/api/parks/park";
import { Button, Tabs, Form, message, Modal, Input, Table, Space, Popconfirm, Select, Spin, InputNumber, } from "antd";
import { Loader2, Plus, CircleHelp, Trash2, Info, Map } from "lucide-react";
import { UpdateParkModal, UpdateSpotModal } from "./updateModals";
import { EditableParkMap } from "../../ParkMap";

import { EditOutlined, DeleteOutlined, ArrowRightOutlined } from "@ant-design/icons";

export default function ParkList() {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeKey, setActiveKey] = useState("");
  const newTabIndex = useRef(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSpotModalOpen, setIsAddSpotModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [spotForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isUpdateParkModalOpen, setIsUpdateParkModalOpen] = useState(false);
  const [isUpdateSpotModalOpen, setIsUpdateSpotModalOpen] = useState(false);
  const [currentPark, setCurrentPark] = useState(null);
  const [currentSpot, setCurrentSpot] = useState(null);

  const fetchParks = async () => {
    setLoading(true);
    try {
      const data = await getParks();
      setParks(data);

      // Initialize tabs with park data if parks exist
      if (data.length > 0) {
        setActiveKey(data[0].id || "1"); // Use park.id or fallback to index
      }
    } catch (error) {
      console.error("Error fetching parks:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const setParkSpots = (parkId, spots) => {
    setParks((prevParks) =>
      prevParks.map((park) =>
        park.id === parkId ? { ...park, spots: [...spots] } : park
      )
    );
  }

  const handleAddPark = async (values) => {
    try {
      const res = await addPark(values);
      messageApi.success("Park added successfully");
      setIsAddModalOpen(false);
      form.resetFields();
      const updatedParks = [...parks, res.park];
      setParks(updatedParks);
    } catch (error) {
      console.error("Error adding park:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to add park. Please try again."
      );
    }
  };

  const handleDeletePark = async (id) => {
    try {
      const res = await deletePark(id);
      messageApi.success("Park deleted successfully");
      const updatedParks = parks.filter((park) => park.id !== id);
      setParks(updatedParks);
    } catch (error) {
      console.error("Error deleting park:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to delete park. Please try again."
      );
    }
  };

  const handleAddSpot = async (values) => {
    try {
      values.park_id = activeKey; // Add the current park ID
      const res = await addMultipleSpots(values);
      if (res.success) {
        messageApi.success(`${res.spots.length} Spots added successfully`);
        setIsAddSpotModalOpen(false);
        spotForm.resetFields();
        const updatedParks = parks.map((park) =>
          park.id === activeKey
            ? { ...park, spots: [...park.spots, ...res.spots] }
            : park
        );
        setParks(updatedParks);
      }
    } catch (error) {
      console.error("Error adding spot:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to add spot. Please try again."
      );
    }
  };

  const handleDeleteSpots = async () => {
    try {
      const res = await deleteMultipleSpots(selectedRowKeys);
      if (res.success) {
        messageApi.success(`${selectedRowKeys.length} Spots deleted successfully`);
        setSelectedRowKeys([]);

        const updatedParks = parks.map((park) =>
          park.id === activeKey
            ? {
                ...park,
                spots: park.spots.filter(
                  (spot) => !selectedRowKeys.includes(spot.id)
                ),
              }
            : park
        );
        setParks(updatedParks);
      }
    } catch (error) {
      console.error("Error deleting spots:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to delete spots. Please try again."
      );
    }
  };

  const handleUpdatePark = async (updatedData) => {
    try {
      const res = await updatePark(currentPark.id, updatedData);
      const updatedParks = parks.map((park) =>
        park.id === currentPark.id ? res : park
      );

      setParks(updatedParks);
      messageApi.success("Park updated successfully");
    } catch (error) {
      console.error("Error updating park:", error);
      messageApi.error("Failed to update park. Please try again.");
    }
  };

  const handleUpdateSpot = async (updatedData) => {
    try {
      const res = await updateSpot(currentSpot.id, {...currentSpot, ...updatedData});
      const updatedParks = parks.map((park) => {
        if (park.id === activeKey) {
          const updatedSpots = park.spots.map((spot) =>
            spot.id === currentSpot.id ? res.spot : spot
          );
          return { ...park, spots: updatedSpots };
        }
        return park;
      });

      setParks(updatedParks);
      messageApi.success("Spot updated successfully");
    } catch (error) {
      console.error("Error updating spot:", error);
      messageApi.error("Failed to update spot. Please try again.");
    }
  };

  useEffect(() => {
    fetchParks();
  }, []);

  const onChange = (key) => {
    setActiveKey(Number(key));
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const openUpdateParkModal = (park) => {
    setCurrentPark(park);
    setIsUpdateParkModalOpen(true);
  };

  // Open update spot modal
  const openUpdateSpotModal = (spot) => {
    setCurrentSpot(spot);
    setIsUpdateSpotModalOpen(true);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: "Name of Spot",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      className: "text-center",
      render: (text) => (
        <span className="text-gray-700">{text || "No restrictions"}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "text-center",
      render: (status) => {
        let statusClass = "badge badge-neutral";
        if (status === "available") statusClass = "badge badge-success";
        else if (status === "reserved") statusClass = "badge badge-warning";
        else if (status === "maintenance") statusClass = "badge badge-error";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}
          >
            {status || "Unknown"}
          </span>
        );
      },
    },
    {
      title: "Park ID",
      dataIndex: "park_id",
      key: "park_id",
      className: "text-center",
    },

    {
      title: "Actions",
      key: "action",
      className: "text-center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="btn btn-ghost btn-sm"
            onClick={() => openUpdateSpotModal(record)}
          >
            <EditOutlined />
          </Button>
          <Button className="btn btn-ghost btn-sm">
            <ArrowRightOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  function ParkDetails({park}) {
    return (
      <div className="rounded-lg shadow-sm">
          <div className="park-details p-4 border-b border-black-100 relative flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">{park.name}</h3>
              <p className="text-sm">Number of spots: {park.spots.length || 0}</p>
            </div>
  
            <Popconfirm
              placement="topLeft"
              title="Delete the Park?"
              description={`Are you sure you want to delete this Park ID ${park.id}?`}
              okText="Yes"
              cancelText="No"
              icon={<CircleHelp size={16} className="m-1" />}
              onConfirm={() => handleDeletePark(park.id)}
            >
              <button className="btn btn-error btn-sm">
                <Trash2 size={16} /> Delete park
              </button>
            </Popconfirm>
          </div>
  
          <div className="container mx-auto py-6">
            <div className="flex items-center gap-2 mb-4">
              <Button
                onClick={() => setIsAddSpotModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} />
                Add Spot
              </Button>
              <Popconfirm
                title="Are you sure you want to delete these spots?"
                onConfirm={handleDeleteSpots}
                okText="Yes"
                cancelText="No"
                disabled={!hasSelected}
              >
                <Button
                  disabled={!hasSelected}
                  className="btn btn-error ml-auto btn-sm"
                >
                  <DeleteOutlined />
                  Delete {hasSelected ? `${selectedRowKeys.length}` : ""}
                </Button>
              </Popconfirm>
            </div>
  
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={park.spots}
              rowKey="id"
              className="spots-table"
              loading={{
                indicator: (
                  <Spin
                    indicator={
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    }
                  />
                ),
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
    )
  }

  const parkTabs = parks.map((park) => ({
    label: (
      <div className="flex items-center">
        <span>{park.name || `Park ${park.id}`}</span>
        {activeKey == park.id && (
          <Button
            icon={<EditOutlined />}
            className="btn btn-ghost btn-sm ml-3 p-2"
            onClick={(e) => {
              e.stopPropagation();
              openUpdateParkModal(park);
            }}
          />
        )}
      </div>
    ),
    children: (
      <Tabs
        defaultActiveKey="details"
        centered
        items={[
          {
            label: <span className="text-base flex items-center gap-1"><Info strokeWidth={2} size={18} />Details</span>,
            key: "details",
            children: <ParkDetails park={park} />,
          },
          {
            label: <span className="text-base flex items-center gap-1"><Map strokeWidth={2} size={18} />Map</span>,
            key: "map",
            children: <EditableParkMap park={park} setParkSpots={setParkSpots} />,
          },
        ]}
      />
    ),
    key: park.id,
  }));

  return (
    <div className="flex flex-col mt-1 gap-4 p-6 bg-gray-50 min-h-screen">
      {contextHolder}
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
        Parks Management
      </h1>
      <div className="mb-4">
        <Button
          onClick={() => {
            form.resetFields();
            setIsAddModalOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={16} />
          Add Park
        </Button>
      </div>

      {!loading && !error && parks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs
            type="card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={() => {
              form.resetFields();
              setIsAddModalOpen(true);
            }}
            animated
            items={parkTabs}
            className="p-1"
            tabBarGutter={5}
          />
        </div>
      )}
      {!loading && !error && parks.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">
            No parks found. Click "ADD PARK" to create one.
          </p>
        </div>
      )}

      {/* Add Park Modal */}
      <Modal
        title={<span className="text-lg font-medium">Add New Park</span>}
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPark}
          className="py-4"
        >
          <Form.Item
            name="name"
            label={<span className="font-medium">Park Name</span>}
            rules={[{ required: true, message: "Please enter park name" }]}
          >
            <Input className="rounded" placeholder="Enter park name" />
          </Form.Item>
          <Form.Item
            name="address"
            label={<span className="font-medium">Address</span>}
            rules={[{ required: true, message: "Please enter park address" }]}
          >
            <Input className="rounded" placeholder="Enter park address" />
          </Form.Item>
          <Form.Item
            name="numberSpots"
            label={<span className="font-medium">Number of Spots</span>}
            rules={[
              { required: true, message: "Please enter number of spots" },
            ]}
          >
            <Input
              type="number"
              className="rounded"
              placeholder="Enter number of spots"
            />
          </Form.Item>
          <div className="flex justify-between gap-2 mt-4">
            <Button
              onClick={() => setIsAddModalOpen(false)}
              className="rounded"
            >
              Cancel
            </Button>
            <Button htmlType="submit" className="btn btn-primary btn-sm">
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
        <Form
          form={spotForm}
          layout="vertical"
          onFinish={handleAddSpot}
          className="py-4"
        >
          <Form.Item
            name="count"
            initialValue={1}
            label={<span className="font-medium">Spot Count</span>}
          >
            <InputNumber min={1} max={1000} className="w-full" />
          </Form.Item>
          <Form.Item
            name="type"
            label={<span className="font-medium">Type</span>}
          >
            <Select placeholder="Select a type" className="rounded">
              <Select.Option value="standard">Standard</Select.Option>
              <Select.Option value="accessible">Accessible</Select.Option>
              <Select.Option value="electric">Electric</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label={<span className="font-medium">Status</span>}
            initialValue="available"
          >
            <Select className="rounded">
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="reserved">Reserved</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex justify-between gap-2 mt-4">
            <Button
              onClick={() => setIsAddSpotModalOpen(false)}
              className="rounded"
            >
              Cancel
            </Button>
            <Button htmlType="submit" className="btn btn-primary btn-sm">
              Add Spot
            </Button>
          </div>
        </Form>
      </Modal>
      {currentPark && (
        <UpdateParkModal
          isOpen={isUpdateParkModalOpen}
          onClose={() => {
            setIsUpdateParkModalOpen(false);
            setCurrentPark(null);
          }}
          park={currentPark}
          onUpdate={handleUpdatePark}
        />
      )}
      {currentSpot && (
        <UpdateSpotModal
          isOpen={isUpdateSpotModalOpen}
          onClose={() => {
            setIsUpdateSpotModalOpen(false);
            setCurrentSpot(null);
          }}
          spot={currentSpot}
          onUpdate={handleUpdateSpot}
        />
      )}
    </div>
  );
}

