import { useState } from "react"
import { Modal, Form, Input, Select, Button, Switch } from "antd"

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

export function UpdateMultipleSpotModal({ isOpen, onClose, park_id, selected, setSelected, spots, setSpots, setRows, setColumns }) {
  const [form] = Form.useForm()
  const [empty, setEmpty] = useState(false)

  const handleSubmit = async () => {
    const values = await form.validateFields()
  
    let updatedSpots = [...spots]
  
    if (empty) {
      // Remove selected spots
      updatedSpots = updatedSpots.filter(
        (spot) => !selected.some(sel => sel.x === spot.x && sel.y === spot.y)
      )
    } else {
      // Update existing spots and add new ones
      selected.forEach((sel, i) => {
        const existingSpotIndex = updatedSpots.findIndex(
          spot => spot.x === sel.x && spot.y === sel.y
        )
  
        const newOrUpdatedSpot = {
          ...updatedSpots[existingSpotIndex],
          name: `${values.name} ${i + 1}`,
          type: values.type,
          status: values.status,
          x: sel.x,
          y: sel.y,
          park_id,
        }
  
        if (existingSpotIndex !== -1) {
          updatedSpots[existingSpotIndex] = newOrUpdatedSpot
        } else {
          updatedSpots.push(newOrUpdatedSpot)
        }
      })
    }
  
    setSpots(updatedSpots)
    setSelected([])
    form.resetFields()
    setEmpty(false)
    setRows(1)
    setColumns(1)
    onClose()
  }
  

  return (
    <Modal
      title={<span className="text-lg font-medium">Edit {selected.length} Spots</span>}
      open={isOpen}
      onCancel={() => {
        form.resetFields()
        setEmpty(false)
        onClose()
      }}
      footer={null}
    >
      <Form
        form={form}
        labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
        layout="horizontal"
        className="py-4"
      >
        <Form.Item label="Empty Spots" valuePropName="checked">
          <Switch
            value={empty}
            onChange={(checked) => {
              checked && form.resetFields()
              setEmpty(checked)
            }}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label={<span className="font-medium">Spot Name</span>}
          rules={!empty ? [{ required: true, message: 'Please enter a prefix for the name' }] : []}
        >
          <Input disabled={empty} placeholder="Enter a prefix for the name" />
        </Form.Item>

        <Form.Item
          name="type"
          label={<span className="font-medium">Type</span>}
          rules={!empty ? [{ required: true, message: 'Please select a type!' }] : []}
        >
          <Select disabled={empty} placeholder="Select a type" className="rounded">
            <Select.Option value="">Select a type</Select.Option>
            <Select.Option value="standard">Standard</Select.Option>
            <Select.Option value="accessible">Accessible</Select.Option>
            <Select.Option value="electric">Electric</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-medium">Status</span>}
          rules={!empty ? [{ required: true, message: 'Please select a status!' }] : []}
        >
          <Select disabled={empty} placeholder="Select a status" className="rounded">
            <Select.Option value="available">Available</Select.Option>
            <Select.Option value="reserved">Reserved</Select.Option>
            <Select.Option value="maintenance">Maintenance</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-between gap-2 mt-4">
          <Button onClick={() => {
            form.resetFields()
            setEmpty(false)
            onClose()
          }} className="rounded">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            className="rounded"
          >
            Confirm
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

