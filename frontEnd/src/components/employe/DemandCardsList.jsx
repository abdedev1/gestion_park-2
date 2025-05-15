import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Spin, Alert, Select, Button, message } from "antd";
import { fetchDemandCards, updateDemandCardStatus } from "../Redux/slices/demandCardsSlice";
import { createCart } from "../Redux/slices/cartsSlice";
import { fetchPricingRates } from "../Redux/slices/pricingRatesSlice";
import dayjs from "dayjs";
import { generateCartPDF } from "./ticketPdf"; 
import {Loader2} from "lucide-react";
export default function DemandCardsList() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const parkId = user?.role_data?.park?.id;
  const { demandCards, status, error } = useSelector((state) => state.demandCards);
  const { pricingRates } = useSelector((state) => state.pricingRates);
  const [messageApi, contextHolder] = message.useMessage();


  // Track status changes per row
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDemandCards());
      dispatch(fetchPricingRates());
    }
  }, [dispatch, status]);
 

  const filtered = demandCards.filter((d) => d.park_id === parkId && d.status === "pending");
  const getRateName = (base_rate_id) => {
    const rate = pricingRates.find((r) => r.id === base_rate_id);
    return rate ? rate.rate_name : "N/A";
  };
  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (record) => {
  const newStatus = statusMap[record.id];
  try {
    await dispatch(
      updateDemandCardStatus({
        id: record.id,
        status: newStatus,
        token,
      })
    ).unwrap();

    if (newStatus === "accepted") {
      await dispatch(
        createCart({
          client_id: record.client_id,
          base_rate_id: record.base_rate_id,
          park_id: record.park_id,
          status: "active",
          token,
        })
      ).unwrap();

      const clientName = record.client.user ? `${record.client.user.first_name} ${record.client.user.last_name}` : "Client";
      const rateName = getRateName(record.base_rate_id);
      generateCartPDF(record, clientName, rateName);

      messageApi.success("Cart created!");
    } else if (newStatus === "rejected") {
      messageApi.success("Demand rejected!");
    }

    // Refresh demand cards data
    await dispatch(fetchDemandCards());

    setStatusMap((prev) => {
      const copy = { ...prev };
      delete copy[record.id];
      return copy;
    });
  } catch (e) {
    messageApi.error("Error processing demand");
  }
};

  const getStatusColor = (value) => {
    if (value === "accepted") return "#52c41a";
    if (value === "rejected") return "#ff4d4f"; 
    return "#faad14"; 
  };

  const optionStyles = {
    pending: { background: "#faad14", color: "#fff", fontWeight: "bold", padding: "2px 12px", borderRadius: 4 },
    accepted: { background: "#52c41a", color: "#fff", fontWeight: "bold", padding: "2px 12px", borderRadius: 4 },
    rejected: { background: "#ff4d4f", color: "#fff", fontWeight: "bold", padding: "2px 12px", borderRadius: 4 },
  };

  const columns = [
    {
    title: "#",
    key: "index",
    render: (text, record, index) => index + 1,
    },
    {
      title: "Client",
      dataIndex: ["client", "first_name"],
      key: "client",
      render: (_, record) =>
        record?.client?.user ? `${record.client.user.first_name} ${record.client.user.last_name}` : "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        // Use statusMap if changed, otherwise DB status
        const value = statusMap[record.id] !== undefined ? statusMap[record.id] : record.status;
        const color = getStatusColor(value);
        const isChanged = statusMap[record.id] !== undefined && statusMap[record.id] !== record.status;
        return (
          <div className="flex items-center gap-2">{contextHolder}
            <div
              style={{
                background: color,
                borderRadius: 6,
                padding: "2px 8px",
                width: 130,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Select
                value={value}
                style={{
                  width: 110,
                  background: "transparent",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                }}
                dropdownStyle={{ color: "#000" }}
                optionLabelProp="label"
                onChange={(v) => handleStatusChange(record.id, v)}
                variant="borderless"
              >
                <Select.Option value="pending" label={<span style={optionStyles.pending}>Pending</span>}>
                  <span style={optionStyles.pending}>Pending</span>
                </Select.Option>
                <Select.Option value="accepted" label={<span style={optionStyles.accepted}>Accepted</span>}>
                  <span style={optionStyles.accepted}>Accepted</span>
                </Select.Option>
                <Select.Option value="rejected" label={<span style={optionStyles.rejected}>Rejected</span>}>
                  <span style={optionStyles.rejected}>Rejected</span>
                </Select.Option>
              </Select>
            </div>
            {isChanged && (
              <Button type="primary" size="small" onClick={() => handleSave(record)}>
                Save
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (status === "loading")
    return (
      <div className="flex justify-center my-8">
        <Spin 
        indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />}
        />
      </div>
    );
  if (status === "failed") return <Alert type="error" message={error} />;

  return (
    <div className="bg-white rounded-lg shadow p-6 my-4">
      <h2 className="text-xl font-bold mb-4">Demand Cards for Your Park</h2>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
}





