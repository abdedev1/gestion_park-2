import { useState } from "react"

export function UpdateParkModal({ isOpen, onClose, park, onUpdate }) {
  const [formData, setFormData] = useState({
    nom: park?.nom || "",
    adresse: park?.adresse || "",
    numberSpots: park?.numberSpots || 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberSpots" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-5">Update Park</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Park Name
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Update Park
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function UpdateSpotModal({ isOpen, onClose, spot, onUpdate }) {
  const [formData, setFormData] = useState({
    nom: spot?.nom || "",
    status: spot?.status || "disponible",
    type: spot?.type || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-5">Update Spot</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Spot Name
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">Select a type</option>
              <option value="Moteur voiture">Moteur voiture</option>
              <option value="Handicap">Handicap</option>
              <option value="Electric Vehicle">Electric Vehicle</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            >
              <option value="disponible">Available</option>
              <option value="reserve">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Update Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
