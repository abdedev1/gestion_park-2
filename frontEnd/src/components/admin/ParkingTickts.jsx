import { useEffect, useState } from "react"
import { Edit, Loader2, MoreHorizontal, Plus, RefreshCw, Shield, Trash2 } from "lucide-react"
import { Button, Table, Modal, Form, Input, Dropdown, Spin, message } from "antd"
import Fuse from 'fuse.js'
import {getParksTickets,deleteparkSpot} from "../../assets/api/parks/Parktickets"
import TextArea from "antd/es/input/TextArea"


export default function ParkingTickets() {
  const [parkingT, setParkingT] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()
  const TicketFuse = new Fuse(parkingT, {
    keys: [ "clientName", "entry_time", "exit_time", "status", "base_rate_id", "total_price", "client_id"],})



  // Fetch roles from API
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getParksTickets();
      setParkingT(data);
    } catch (error) {
      console.error("Error fetching parking tickets:", error);
      messageApi.error(error.response?.data?.message || "Failed to load parking tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);



  const handleDeleteClick = (ticket) => {
    setCurrentTicket(ticket)
    setIsDeleteModalOpen(true)
  }



  const handleDeleteTicket = async () => {
    if (!currentTicket) return;

    try {
      await deleteparkSpot(currentTicket.id);
      messageApi.success("park ticket deleted successfully");
      setIsDeleteModalOpen(false);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting park ticket :", error);
      messageApi.error(error.response?.data?.message || "Failed to delete park ticket . Please try again.");
    }
  };

  // Define dropdown menu items for each row
  const getDropdownItems = (ticket) => [
    // {
    //   key: "edit",
    //   label: (
    //     <a  className="flex items-center">
    //       <Edit className="mr-2 h-4 w-4 text-cyan-600" />
    //       Edit
    //     </a>
    //   ),
    // },
    {
      key: "delete",
      label: (
        <a onClick={() => handleDeleteClick(ticket)} className="flex items-center text-red-600">
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
      title: "Spot id",
      dataIndex: "spot_id",
      key: "spot_id",
      render: (text) => (
        <div className="flex items-center gap-2">
          
          {text}
        </div>
      ),
    },
    {
      title: "clientName",
      dataIndex: "clientName",
      key: "clientName",
      responsive: ["md"],
    },
    {
      title: "Entry Time",
      dataIndex: "entry_time",
      key: "entry_time",
      responsive: ["lg"],
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
        title: "Exit Time",
        dataIndex: "exit_time",
        key: "exit_time",
        responsive: ["lg"],
        render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <div className="flex items-center gap-2">
            {text === "active" ? (
              <span className="text-green-500 font-semibold">{text}</span>
            ) : (
              <span className="text-red-500 font-semibold">{text}</span>
            )}
          </div>
        ),
        responsive: ["lg"],
    },
    {
        title: "BasePrice", 
        dataIndex: "base_rate_id",
        key: "base_rate_id",
        render: (text) => (
          <div className="flex items-center gap-2">
            {text}
          </div>
        ),
        responsive: ["lg"],
    },
    {
        title: "Total Price",
        dataIndex: "total_price",
        key: "total_price",
        responsive: ["lg"],
        render: (text) => (
          <div className="flex items-center gap-2">
            {text}
          </div>
        ),
    },
    {
        title: "Client Id",
        dataIndex: "client_id",
        key: "client_id",
        render: (text) => (
          <div className="flex items-center gap-2">
            {text}
          </div>
        ),
        responsive: ["lg"],
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
      <div className="flex items-center mt-7 justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Parking Tickets Management</h1>
         
        </div>
        
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={parkingT}
          rowKey="id"
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 10 }}
        />
      </div>

  
      

     

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Role"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="delete" danger  onClick={handleDeleteTicket}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this ticket? This action cannot be undone.</p>
      </Modal>
    </div>
  )
}
