import React from "react";
import { Table, Alert } from "antd";
import { useSelector } from "react-redux";

export default function ParkingHistory() {
  const { user } = useSelector((state) => state.auth);

  // Récupérer les tickets depuis le user (role_data.tickets)
  const tickets = user?.role_data?.tickets || [];
  console.log("Tickets:", tickets);
  console.log("User:", user);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1
    },
    {
      title: "Park Name",
      dataIndex: "  name",
      key: "name",
      render: (_, record) => record.spot?.park?.name || "N/A"
    },
    {
      title: "Entry Time",
      dataIndex: "entry_time",
      key: "entry_time",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Exit Time",
      dataIndex: "exit_time",
      key: "exit_time",
      render: (text) => (text ? new Date(text).toLocaleString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "completed"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    
  ];

  if (!user?.role_data)
    return <Alert type="warning" message="Aucune donnée utilisateur trouvée." />;

  return (
    <div className="bg-white rounded-lg shadow p-6 my-4">
      <h2 className="text-xl font-bold mb-4">Historique de vos tickets</h2>
      <Table
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}