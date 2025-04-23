import { useState } from "react"
import { X, Check, CreditCard, Calendar, Shield } from "lucide-react"
import { message } from "antd"

export default function ClientSubscription({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentStep, setPaymentStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

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
      features: ["Unlimited daily spots", "24/7 access", "All locations", "VIP support"],
      recommended: false,
    },
  ]

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setPaymentStep(true)
  }

  const handleSubmitPayment = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      messageApi.success("Subscription activated successfully!")
      setTimeout(() => {
        onClose()
      }, 1500)
    }, 2000)
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
          {!paymentStep ? (
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
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CreditCard className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {selectedPlan.name} Plan - {selectedPlan.price} MAD/month
                  </h3>
                  <p className="text-gray-500">Enter your payment details below</p>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-6 bg-gray-50 p-3 rounded-md">
                  <Shield size={18} className="text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    Your payment information is secure. We use encryption to protect your data.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentStep(false)}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        Subscribe
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
