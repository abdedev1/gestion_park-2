import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchParcs } from "../Redux/slices/parcsSlice"
import { fetchPricingRates } from "../Redux/slices/pricingRatesSlice"
import { X, Check } from "lucide-react"
import { message } from "antd"
import { createSubscription } from "../Redux/slices/demandCardsSlice"

export default function ClientSubscription({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPark, setSelectedPark] = useState("")
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const dispatch = useDispatch()
  const { parks, status } = useSelector((state) => state.parks)
  const { pricingRates } = useSelector((state) => state.pricingRates)
  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchParcs())
    }
    dispatch(fetchPricingRates())
  }, [dispatch, status])


  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
  }

  const handleSubmitSubscription = () => {
    if (!selectedPark) {
      messageApi.error("Please select a park.")
      return
    }

    setLoading(true)
    dispatch(
      createSubscription({
        clientId: user.role_data.id,
        parkId: selectedPark,
        base_rate_id: selectedPlan.id,
        status: "pending",
        token,
      })
    )
      .unwrap()
      .then(() => {
        messageApi.success("Subscription created successfully!")
        setTimeout(() => {
          onClose()
        }, 1500)
      })
      .catch((error) => {
        messageApi.error(error.message || "Failed to create subscription.")
      })
      .finally(() => {
        setLoading(false)
      })
  }

 
  

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      {contextHolder}
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Parking Subscription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!selectedPlan ? (
            <>
              <p className="text-gray-600 mb-6">Choose a subscription plan that fits your parking needs</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pricingRates.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 hover:shadow-md transition relative ${
                      plan.recommended ? "border-2 border-primary shadow-lg" : ""
                    }`}
                  >
                    
                    {plan.recommended ? (
                      <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
                        RECOMMENDED
                      </div>
                    ):""}
                    <h3 className="text-xl font-bold mb-2">{plan.rate_name}</h3>
                    <p className="text-3xl font-bold mb-4">
                      {plan.price} MAD<span className="text-sm text-gray-500">/Lifetime</span>
                    </p>
                    <div className="mb-6 flex items-center">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span className="text-gray-600">{plan.feature}</span>
      
                    </div>
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-3 rounded-lg font-medium transition ${
                        plan.recommended
                          ? "btn btn-primary"
                          : "btn btn-soft"
                      }`}
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-md mx-auto">
              <h3 className="font-medium text-lg mb-4">
                {selectedPlan.name} Plan - {selectedPlan.price} MAD/Lifetime
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={user?.first_name || ""}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={user?.last_name || ""}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Park</label>
                <select
                  value={selectedPark}
                  onChange={(e) => setSelectedPark(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a Park --</option>
                  {status === "loading" ? (
                    <option>Loading parks...</option>
                  ) : (
                    parks.map((park) => (
                      <option key={park.id} value={park.id}>
                        {park.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitSubscription}
                  className="flex-1px-4 py-2 rounded-md btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Confirm Subscription"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}