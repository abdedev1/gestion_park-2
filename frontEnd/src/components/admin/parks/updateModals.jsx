import { useState } from "react"
import { Modal, Form, Input, Select, InputNumber, Button } from "antd"

export function UpdateParkModal({ isOpen, onClose, park, onUpdate }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      onUpdate(values)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={<span className="text-lg font-medium">Update Park</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: park?.name || "",
          address: park?.address || "",
          
        }}
        className="py-4"
      >
        <Form.Item
          name="name"
          label={<span className="font-medium">Park Name</span>}
          rules={[{ required: true, message: 'Please input the park name!' }]}
        >
          <Input placeholder="Enter park name" />
        </Form.Item>

        <Form.Item
          name="address"
          label={<span className="font-medium">Address</span>}
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <div className="flex justify-between gap-2 mt-4">
          <Button onClick={onClose} className="rounded">
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            className="rounded"
          >
            Update Park
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export function UpdateSpotModal({ isOpen, onClose, spot, onUpdate }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      onUpdate(values)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={<span className="text-lg font-medium">Update Spot</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: spot?.name || "",
          status: spot?.status || "available",
          type: spot?.type || "",
        }}
        className="py-4"
      >
        <Form.Item
          name="name"
          label={<span className="font-medium">Spot Name</span>}
        >
          <Input placeholder="Enter spot name" />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="font-medium">Type</span>}
        >
          <Select placeholder="Select a type" className="rounded">
            <Select.Option value="">Select a type</Select.Option>
            <Select.Option value="standard">Standard</Select.Option>
            <Select.Option value="accessible">Accessible</Select.Option>
            <Select.Option value="electric">Electric</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-medium">Status</span>}
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select className="rounded">
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="reserved">Reserved</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-between gap-2 mt-4">
          <Button onClick={onClose} className="rounded">
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            className="rounded"
          >
            Update Spot
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export function UpdateMultipleSpotModal({ isOpen, onClose, selected, setSpots }) {
  const [form] = Form.useForm()
  const [empty, setEmpty] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      onUpdate(values)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={<span className="text-lg font-medium">Edit {selected.length} Spots</span>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        className="py-4"
      >
        <Form.Item
          name="name"
          label={<span className="font-medium">Spot Name</span>}
        >
          <Input placeholder="Enter spot name" />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="font-medium">Type</span>}
        >
          <Select placeholder="Select a type" className="rounded">
            <Select.Option value="">Select a type</Select.Option>
            <Select.Option value="standard">Standard</Select.Option>
            <Select.Option value="accessible">Accessible</Select.Option>
            <Select.Option value="electric">Electric</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-medium">Status</span>}
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select className="rounded">
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="reserved">Reserved</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-between gap-2 mt-4">
          <Button onClick={onClose} className="rounded">
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            loading={loading}
            className="rounded"
          >
            Update Spot
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
