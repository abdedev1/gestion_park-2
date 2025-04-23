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

  const [query, setQuery] = useState("");
  const [types, setTypes] = useState([]);

  const ticketsFuse = new Fuse(getRes(), {keys: ["client_first_name", "client_last_name"], threshold: 0.3})
  const items = query ? ticketsFuse.search(query).map(r => r.item) : getRes();

  function getRes() {
    let res = types.length ? parkingT.filter(c => types.includes(c.status)) : parkingT
    return res
  }

  function toggleType(type) {
    types.includes(type) ? setTypes(types.filter(t => t !== type)) : setTypes([...types, type])
  }

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
        title: "First Name",
        dataIndex: "client_first_name",
        key: "client_first_name",
        render: (text) => (
          <div className="flex items-center gap-2">
            {text}
          </div>
        ),
        responsive: ["lg"],
    },
    {
        title: "last Name",
        dataIndex: "client_last_name",
        key: "client_last_name",
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
        <div className="flex justify-end p-3 gap-3">
        <div className="flex gap-1.5">
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("active") ? "btn-active" : ""}`} onClick={() => toggleType("active")}>active</button>
          <button className={`btn btn-outline px-4 btn-primary border-primary/50 btn-sm rounded-full capitalize ${types.includes("completed") ? "btn-active" : ""}`} onClick={() => toggleType("completed")}>completed</button>
        </div>
        <label className="input input-primary input-sm w-1/2">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search" />
        </label>
      </div>
        
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={items}
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
