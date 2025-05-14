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




  const handleSubmit = async (values) => {
    try {
      setLoading(true)

      // Format the date properly
      const formattedValues = {
        ...values,
        birth_date: values.birth_date ? values.birth_date.format("YYYY-MM-DD") : user.birth_date,
      }

      const response = await axios.put(`/profile/${user.id}`, formattedValues)

      if (response.data) {
        console.log(response.data)
        dispatch(
          updateUser({
            ...user,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
            email: response.data.email,
            birth_date: response.data.birth_date,
            role_data: response.data.role_data,
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
        <div className="bg-primary h-32 relative">
          <div className="absolute -bottom-16 left-8 flex items-end">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              {avatar ? (
                <img
                  src={avatar || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-primary">
                  {getInitials()}
                </div>
              )}
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
            ]}
          />
        </div>
      </div>
    </div>
  )
}
