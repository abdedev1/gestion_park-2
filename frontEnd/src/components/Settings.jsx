"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { axios } from "../assets/api/axios"
import { message, Tabs, Form, Input, Button, Switch, Select, Divider, Alert } from "antd"
import { Bell, Lock, CreditCard, Globe, Moon, Smartphone, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import Auth from "../assets/api/auth/Auth"
import { logout } from "./Redux/slices/AuthSlice"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [passwordForm] = Form.useForm()
  const [notificationForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [loading, setLoading] = useState({
    password: false,
    notifications: false,
    payment: false,
    deleteAccount: false,
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [darkMode, setDarkMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const handlePasswordChange = async (values) => {
    if (values.new_password !== values.confirm_password) {
      messageApi.error("New passwords do not match")
      return
    }

    try {
      setLoading({ ...loading, password: true })

      const response = await axios.post("/change-password", {
        current_password: values.current_password,
        new_password: values.new_password,
      })

      if (response.data.success) {
        messageApi.success("Password changed successfully")
        passwordForm.resetFields()
      } else {
        messageApi.error(response.data.message || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      messageApi.error(error.response?.data?.message || "Current password is incorrect")
    } finally {
      setLoading({ ...loading, password: false })
    }
  }

  const handleNotificationSettings = async (values) => {
    try {
      setLoading({ ...loading, notifications: true })

      const response = await axios.post("/update-notifications", values)

      if (response.data.success) {
        messageApi.success("Notification settings updated")
      } else {
        messageApi.error("Failed to update notification settings")
      }
    } catch (error) {
      console.error("Error updating notification settings:", error)
      messageApi.error("Failed to update notification settings")
    } finally {
      setLoading({ ...loading, notifications: false })
    }
  }

  const handlePaymentMethodUpdate = async (values) => {
    try {
      setLoading({ ...loading, payment: true })

      const response = await axios.post("/update-payment-method", values)

      if (response.data.success) {
        messageApi.success("Payment method updated successfully")
        paymentForm.resetFields()
      } else {
        messageApi.error("Failed to update payment method")
      }
    } catch (error) {
      console.error("Error updating payment method:", error)
      messageApi.error("Failed to update payment method")
    } finally {
      setLoading({ ...loading, payment: false })
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user.email) {
      messageApi.error("Email confirmation does not match")
      return
    }

    try {
      setLoading({ ...loading, deleteAccount: true })

      const response = await axios.delete(`/users/${user.id}`)

      if (response.data.success) {
        messageApi.success("Account deleted successfully")

        // Logout the user
        await Auth.Logout()
        dispatch(logout())

        // Redirect to home page
        setTimeout(() => {
          navigate("/")
        }, 1500)
      } else {
        messageApi.error("Failed to delete account")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      messageApi.error("Failed to delete account")
    } finally {
      setLoading({ ...loading, deleteAccount: false })
      setShowDeleteConfirm(false)
      setDeleteConfirmText("")
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Here you would implement the actual dark mode toggle logic
    // For example, adding/removing a class to the document body or using a theme context
    messageApi.success(`${!darkMode ? "Dark" : "Light"} mode activated`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {contextHolder}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="p-6">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: (
                  <span className="flex items-center">
                    <Lock size={16} className="mr-2" />
                    Security
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
                      <Form.Item
                        name="current_password"
                        label="Current Password"
                        rules={[{ required: true, message: "Please enter your current password" }]}
                      >
                        <Input.Password placeholder="Enter your current password" />
                      </Form.Item>

                      <Form.Item
                        name="new_password"
                        label="New Password"
                        rules={[
                          { required: true, message: "Please enter your new password" },
                          { min: 8, message: "Password must be at least 8 characters" },
                        ]}
                      >
                        <Input.Password placeholder="Enter your new password" />
                      </Form.Item>

                      <Form.Item
                        name="confirm_password"
                        label="Confirm New Password"
                        rules={[
                          { required: true, message: "Please confirm your new password" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("new_password") === value) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error("The two passwords do not match"))
                            },
                          }),
                        ]}
                      >
                        <Input.Password placeholder="Confirm your new password" />
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading.password}
                          style={{ backgroundColor: "#0082ce" }}
                        >
                          Update Password
                        </Button>
                      </Form.Item>
                    </Form>

                    <Divider />

                    <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication</h2>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="font-medium">Enable Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>

                    <Divider />

                    <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
                    <div className="border border-red-200 rounded-md p-4 bg-red-50">
                      <div className="flex items-start">
                        <AlertTriangle className="text-red-500 mr-3 mt-1" />
                        <div>
                          <h3 className="font-semibold text-red-600">Delete Account</h3>
                          <p className="text-sm text-gray-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                          </p>
                          {!showDeleteConfirm ? (
                            <Button danger onClick={() => setShowDeleteConfirm(true)}>
                              Delete Account
                            </Button>
                          ) : (
                            <div className="space-y-3">
                              <Alert
                                message="Are you sure you want to delete your account?"
                                description={`This action cannot be undone. To confirm, please type "${user?.email}" below.`}
                                type="error"
                                showIcon
                              />
                              <Input
                                placeholder="Type your email to confirm"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="mb-3"
                              />
                              <div className="flex gap-3">
                                <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                                <Button
                                  danger
                                  loading={loading.deleteAccount}
                                  onClick={handleDeleteAccount}
                                  disabled={deleteConfirmText !== user?.email}
                                >
                                  Permanently Delete Account
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "2",
                label: (
                  <span className="flex items-center">
                    <Bell size={16} className="mr-2" />
                    Notifications
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                    <Form
                      form={notificationForm}
                      layout="vertical"
                      onFinish={handleNotificationSettings}
                      initialValues={{
                        email_notifications: true,
                        push_notifications: true,
                        sms_notifications: false,
                        parking_reminders: true,
                        payment_notifications: true,
                        promotional_emails: false,
                      }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Form.Item name="email_notifications" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications on your device</p>
                          </div>
                          <Form.Item name="push_notifications" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                          </div>
                          <Form.Item name="sms_notifications" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>

                        <Divider />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Parking Reminders</p>
                            <p className="text-sm text-gray-500">Get reminders about your parking expiration</p>
                          </div>
                          <Form.Item name="parking_reminders" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Payment Notifications</p>
                            <p className="text-sm text-gray-500">Get notified about payments and charges</p>
                          </div>
                          <Form.Item name="payment_notifications" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Promotional Emails</p>
                            <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                          </div>
                          <Form.Item name="promotional_emails" valuePropName="checked" noStyle>
                            <Switch />
                          </Form.Item>
                        </div>
                      </div>

                      <Form.Item className="mt-6">
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading.notifications}
                          style={{ backgroundColor: "#0082ce" }}
                        >
                          Save Preferences
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: "3",
                label: (
                  <span className="flex items-center">
                    <CreditCard size={16} className="mr-2" />
                    Payment
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

                    <div className="mb-6 p-4 border rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-md mr-3">
                            <CreditCard className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/2025</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center mr-3">
                            <CheckCircle size={12} className="mr-1" />
                            Default
                          </span>
                          <Button size="small">Remove</Button>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-3">Add New Payment Method</h3>
                    <Form form={paymentForm} layout="vertical" onFinish={handlePaymentMethodUpdate}>
                      <Form.Item
                        name="card_number"
                        label="Card Number"
                        rules={[{ required: true, message: "Please enter your card number" }]}
                      >
                        <Input placeholder="1234 5678 9012 3456" />
                      </Form.Item>

                      <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                          name="expiry_date"
                          label="Expiry Date"
                          rules={[{ required: true, message: "Please enter expiry date" }]}
                        >
                          <Input placeholder="MM/YY" />
                        </Form.Item>

                        <Form.Item name="cvc" label="CVC" rules={[{ required: true, message: "Please enter CVC" }]}>
                          <Input placeholder="123" />
                        </Form.Item>
                      </div>

                      <Form.Item
                        name="cardholder_name"
                        label="Cardholder Name"
                        rules={[{ required: true, message: "Please enter cardholder name" }]}
                      >
                        <Input placeholder="John Doe" />
                      </Form.Item>

                      <Form.Item name="set_default" valuePropName="checked">
                        <Switch /> Set as default payment method
                      </Form.Item>

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading.payment}
                          style={{ backgroundColor: "#0082ce" }}
                        >
                          Add Payment Method
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                ),
              },
              {
                key: "4",
                label: (
                  <span className="flex items-center">
                    <Globe size={16} className="mr-2" />
                    Preferences
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">App Preferences</h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                        <Switch
                          checked={darkMode}
                          onChange={toggleDarkMode}
                          checkedChildren={<Moon size={14} />}
                          unCheckedChildren={<Moon size={14} />}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-gray-500">Choose your preferred language</p>
                        </div>
                        <Select
                          defaultValue="english"
                          style={{ width: 120 }}
                          options={[
                            { value: "english", label: "English" },
                            { value: "french", label: "French" },
                            { value: "arabic", label: "Arabic" },
                            { value: "spanish", label: "Spanish" },
                          ]}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Time Format</p>
                          <p className="text-sm text-gray-500">Choose your preferred time format</p>
                        </div>
                        <Select
                          defaultValue="24h"
                          style={{ width: 120 }}
                          options={[
                            { value: "12h", label: "12-hour" },
                            { value: "24h", label: "24-hour" },
                          ]}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Distance Unit</p>
                          <p className="text-sm text-gray-500">Choose your preferred distance unit</p>
                        </div>
                        <Select
                          defaultValue="km"
                          style={{ width: 120 }}
                          options={[
                            { value: "km", label: "Kilometers" },
                            { value: "mi", label: "Miles" },
                          ]}
                        />
                      </div>
                    </div>

                    <Divider />

                    <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Location Services</p>
                          <p className="text-sm text-gray-500">Allow app to access your location</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Collection</p>
                          <p className="text-sm text-gray-500">Allow app to collect usage data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Personalized Ads</p>
                          <p className="text-sm text-gray-500">Show personalized advertisements</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>

                    <Button
                      type="primary"
                      className="mt-6"
                      style={{ backgroundColor: "#0082ce" }}
                      onClick={() => messageApi.success("Preferences saved successfully")}
                    >
                      Save Preferences
                    </Button>
                  </div>
                ),
              },
              {
                key: "5",
                label: (
                  <span className="flex items-center">
                    <Smartphone size={16} className="mr-2" />
                    Devices
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Connected Devices</h2>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-md mr-3">
                              <Smartphone className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Current Device</p>
                              <p className="text-sm text-gray-500">Chrome on Windows • Last active now</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Current</span>
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-md mr-3">
                              <Smartphone className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">iPhone 13</p>
                              <p className="text-sm text-gray-500">Safari on iOS • Last active 2 days ago</p>
                            </div>
                          </div>
                          <Button size="small" danger>
                            Revoke
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-2 rounded-md mr-3">
                              <Smartphone className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">MacBook Pro</p>
                              <p className="text-sm text-gray-500">Firefox on macOS • Last active 1 week ago</p>
                            </div>
                          </div>
                          <Button size="small" danger>
                            Revoke
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      danger
                      className="mt-6"
                      onClick={() => messageApi.success("Logged out from all other devices")}
                    >
                      Logout from all other devices
                    </Button>
                  </div>
                ),
              },
              {
                key: "6",
                label: (
                  <span className="flex items-center">
                    <Shield size={16} className="mr-2" />
                    Privacy
                  </span>
                ),
                children: (
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Profile Visibility</h3>
                        <p className="text-sm text-gray-500 mb-3">Control who can see your profile information</p>
                        <Select
                          defaultValue="private"
                          style={{ width: 200 }}
                          options={[
                            { value: "public", label: "Public - Everyone" },
                            { value: "contacts", label: "Contacts Only" },
                            { value: "private", label: "Private - Only Me" },
                          ]}
                        />
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Activity Status</h3>
                        <p className="text-sm text-gray-500 mb-3">Show when you're active on the platform</p>
                        <Switch defaultChecked />
                      </div>

                      <Divider />

                      <div>
                        <h3 className="font-medium mb-2">Data Usage</h3>
                        <p className="text-sm text-gray-500 mb-3">Manage how your data is used</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">Allow data analysis to improve services</p>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm">Share anonymous usage statistics</p>
                            <Switch defaultChecked />
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-sm">Allow personalized recommendations</p>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>

                      <Divider />

                      <div>
                        <h3 className="font-medium mb-2">Download Your Data</h3>
                        <p className="text-sm text-gray-500 mb-3">Request a copy of your personal data that we store</p>
                        <Button onClick={() => messageApi.success("Data export request submitted")}>
                          Request Data Export
                        </Button>
                      </div>
                    </div>
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
