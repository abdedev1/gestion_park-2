import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { updateUser } from "./Redux/slices/AuthSlice"
import { axios } from "../assets/api/axios"
import { message, Tabs, Form, Input, Button, Upload, DatePicker } from "antd"
import { User, Mail, Calendar, Camera, Shield, MapPin } from "lucide-react"
import moment from "moment"

export default function Profile() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [messageApi, contextHolder] = message.useMessage()
  const [activeTab, setActiveTab] = useState("1")
  const [parkingHistory, setParkingHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birth_date: user.birth_date ? moment(user.birth_date) : null,
      })
    }
  }, [user, form])
// hadi mzl fiha mochkil hit khas ntfahmo f discord kifach gha ykon blan carte
//   useEffect(() => {
//     if (user && activeTab === "2") {
//       fetchParkingHistory()
//     }
//   }, [user, activeTab])



  const handleSubmit = async (values) => {
    try {
      setLoading(true)

      // Format the date properly
      const formattedValues = {
        ...values,
        birth_date: values.birth_date ? values.birth_date.format("YYYY-MM-DD") : user.birth_date,
      }

      const response = await axios.put(`/users/${user.id}`, formattedValues)

      if (response.data) {
        // Update the user in Redux store
        dispatch(
          updateUser({
            ...user,
            ...response.data,
          }),
        )

        messageApi.success("Profile updated successfully")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      messageApi.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setAvatar(info.file.response.url)
      messageApi.success("Avatar updated successfully")
    }
  }

  // Generate initials for avatar
  const getInitials = () => {
    if (!user) return ""
    return `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
  }

  // Get role display name
  const getRoleDisplay = () => {
    if (!user?.role) return ""
    return user.role.charAt(0).toUpperCase() + user.role.slice(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {contextHolder}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 h-32 relative">
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              {avatar ? (
                <img
                  src={avatar || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
                  {getInitials()}
                </div>
              )}
              <Upload
                name="avatar"
                action="/api/upload-avatar"
                showUploadList={false}
                onChange={handleAvatarChange}
                className="absolute bottom-0 right-0"
              >
                <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                  <Camera size={16} />
                </button>
              </Upload>
            </div>
            <div className="ml-4 mb-4 text-white">
              <h1 className="text-2xl font-bold">
                {user?.first_name} {user?.last_name}
              </h1>
              <div className="flex items-center">
                <Shield size={14} className="mr-1" />
                <span>{getRoleDisplay()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 px-8 pb-8">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: "1",
                label: "Profile Information",
                children: (
                  <div className="max-w-2xl mx-auto mt-6">
                    <Form
                      form={form}
                      layout="vertical"
                      onFinish={handleSubmit}
                      initialValues={{
                        first_name: user?.first_name || "",
                        last_name: user?.last_name || "",
                        email: user?.email || "",
                        birth_date: user?.birth_date ? moment(user.birth_date) : null,
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                          name="first_name"
                          label="First Name"
                          rules={[{ required: true, message: "Please enter your first name" }]}
                        >
                          <Input prefix={<User size={16} className="text-gray-400 mr-2" />} placeholder="First Name" />
                        </Form.Item>

                        <Form.Item
                          name="last_name"
                          label="Last Name"
                          rules={[{ required: true, message: "Please enter your last name" }]}
                        >
                          <Input prefix={<User size={16} className="text-gray-400 mr-2" />} placeholder="Last Name" />
                        </Form.Item>
                      </div>

                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: "Please enter your email" },
                          { type: "email", message: "Please enter a valid email" },
                        ]}
                      >
                        <Input prefix={<Mail size={16} className="text-gray-400 mr-2" />} placeholder="Email Address" />
                      </Form.Item>

                      <Form.Item
                        name="birth_date"
                        label="Birth Date"
                        rules={[{ required: true, message: "Please select your birth date" }]}
                      >
                        <DatePicker
                          className="w-full"
                          format="YYYY-MM-DD"
                          placeholder="Select birth date"
                          suffixIcon={<Calendar size={16} className="text-gray-400" />}
                        />
                      </Form.Item>

                      {user?.role === "client" && (
                        <Form.Item name="address" label="Address">
                          <Input
                            prefix={<MapPin size={16} className="text-gray-400 mr-2" />}
                            placeholder="Your address"
                          />
                        </Form.Item>
                      )}

                      <Form.Item className="mt-6">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                          className="px-6"
                          style={{ backgroundColor: "#0082ce" }}
                        >
                          Save Changes
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: "2",
                label: "Parking History",
                children: (
                  <div className="mt-6">
                    {historyLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : parkingHistory.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Spot
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Entry Time
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Exit Time
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Price
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {parkingHistory.map((ticket) => (
                              <tr key={ticket.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {ticket.spotName || `#${ticket.spot_id}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {new Date(ticket.entry_time).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {ticket.exit_time ? new Date(ticket.exit_time).toLocaleString() : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      ticket.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : ticket.status === "completed"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {ticket.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                  {ticket.total_price ? `${ticket.total_price.toFixed(2)} MAD` : "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No parking history available</div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
