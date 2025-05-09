import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux" // Redux hooks
import { fetchParcs } from "../Redux/slices/parcsSlice" // Fetch parks action
import { X, Check } from "lucide-react"
import { message } from "antd"
import Auth from "../../assets/api/auth/Auth"
import { createSubscription } from "../Redux/slices/demandCardsSlice"; // Import the action
export default function ClientSubscription({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedPark, setSelectedPark] = useState("") // Selected park
  const [duration, setDuration] = useState(1) // Duration in months
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const dispatch = useDispatch()
  const { parks, status } = useSelector((state) => state.parks) // Get parks from Redux
  const { user, token, isLoading } = useSelector((state) => state.auth) // Get user and token from auth slice

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchParcs()) // Fetch parks when component loads
    }
  }, [dispatch, status])

  const subscriptionPlans = [
    {
      id: 1,
      name: "Basic",
      price: 50,
      features: ["3 spots/day", "Access from 8am to 6pm", "Email support"],
      recommended: false,
    },
    {
      id: 2,
      name: "Standard",
      price: 100,
      features: ["6 spots/day", "Extended access hours", "Standard support"],
      recommended: true,
    },
    {
      id: 3,
      name: "Unlimited",
      price: 200,
      features: ["Unlimited daily spots", "24/7 access", "All locations"],
      recommended: false,
    },
  ]

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
  }
  console.log(user)
  const handleSubmitSubscription = () => {
    if (!selectedPark) {
      messageApi.error("Please select a park.");
      return;
    }
  
    setLoading(true);
  
    dispatch(
      createSubscription({
        userId: user?.id,
        parkId: selectedPark,
        duration,
        totalPrice,
        token,
      })
    )
      .unwrap()
      .then(() => {
        messageApi.success("Subscription created successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      })
      .catch((error) => {
        messageApi.error(error.message || "Failed to create subscription.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const totalPrice = selectedPlan ? selectedPlan.price * duration : 0

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
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-6 hover:shadow-md transition relative ${
                      plan.recommended ? "border-2 border-blue-600" : ""
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                        RECOMMENDED
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold mb-4">
                      {plan.price} MAD<span className="text-sm text-gray-500">/month</span>
                    </p>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check size={16} className="text-green-500 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`w-full py-2 rounded-md font-medium transition ${
                        plan.recommended
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
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
                {selectedPlan.name} Plan - {selectedPlan.price} MAD/month
              </h3>

              {/* Client First Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={user?.first_name || ""}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Client Last Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={user?.last_name || ""}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 focus:outline-none"
                />
              </div>

              {/* Park Selection */}
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

              {/* Duration Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Total Price */}
              <div className="mb-6">
                <p className="text-lg font-medium">
                  Total Price: <span className="text-blue-600">{totalPrice} MAD</span>
                </p>
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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