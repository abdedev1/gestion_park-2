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
          nom: park?.nom || "",
          adresse: park?.adresse || "",
          numberSpots: park?.numberSpots || 0,
        }}
        className="py-4"
      >
        <Form.Item
          name="nom"
          label={<span className="font-medium">Park Name</span>}
          rules={[{ required: true, message: 'Please input the park name!' }]}
        >
          <Input placeholder="Enter park name" />
        </Form.Item>

        <Form.Item
          name="adresse"
          label={<span className="font-medium">Address</span>}
          rules={[{ required: true, message: 'Please input the address!' }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          name="numberSpots"
          label={<span className="font-medium">Number of Spots</span>}
          rules={[{ required: true, message: 'Please input the number of spots!' }]}
        >
          <InputNumber min={0} className="w-full" />
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
          nom: spot?.nom || "",
          status: spot?.status || "disponible",
          type: spot?.type || "",
        }}
        className="py-4"
      >
        <Form.Item
          name="nom"
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
            <Select.Option value="Moteur voiture">Moteur voiture</Select.Option>
            <Select.Option value="Handicap">Handicap</Select.Option>
            <Select.Option value="Electric Vehicle">Electric Vehicle</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-medium">Status</span>}
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select className="rounded">
            <Select.Option value="disponible">Available</Select.Option>
            <Select.Option value="reserve">Reserved</Select.Option>
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