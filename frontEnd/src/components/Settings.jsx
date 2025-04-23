"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { axios } from "../assets/api/axios"
import { message, Form, Input, Button, Divider, Alert } from "antd"
import { AlertTriangle } from "lucide-react"
import Auth from "../assets/api/auth/Auth"
import { logout } from "./Redux/slices/AuthSlice"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [passwordForm] = Form.useForm()
  const [loading, setLoading] = useState({
    password: false,
    deleteAccount: false,
  })
  const [messageApi, contextHolder] = message.useMessage()
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

  return (
    <div className="container mx-auto px-4 py-8">
      {contextHolder}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="p-6">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
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
            </div>

            <Divider />

            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
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
          </div>
        </div>
      </div>
    </div>
  )
}
