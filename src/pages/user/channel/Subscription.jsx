import React, { useEffect, useState } from "react";
import { useAuth, useChannel } from "../../../context/context";
import {
  paymentSession,
  listSubscriptionPlans,
  verifyPaymentService,
} from "../../../api/services/paymentService";

const mbToGB = (mb) => Math.floor(Number(mb) / 1024);

const formatDuration = (days) => {
  const d = Number(days);
  if (d >= 36500) return "Lifetime";
  if (d >= 365) return `${Math.floor(d / 365)} Years`;
  return `${d} Days`;
};

const RAZORPAY_KEY_ID = "rzp_test_RqwWzgHgoIe4Eu";

function Subscription() {
  const { user } = useAuth();
  const { chanID } = useChannel();

  const [plans, setPlans] = useState([]);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chanID) return;

    const fetchPlans = async () => {
      try {
        const data = await listSubscriptionPlans(chanID);
        setPlans(data.plans || []);
        setCurrentPlanId(data.currentPlanId); // ✅ backend driven
      } catch (err) {
        console.error(err);
        setError("Failed to load subscription plans");
      }
    };

    fetchPlans();
  }, [chanID]);

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    if (!plan?.id) return;

    setIsLoading(true);

    let orderId;
    try {
      const data = await paymentSession(chanID, plan.id);
      orderId = data.razorpayOrderId;
      console.log("orderID:", orderId);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return;
    }

    const loaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!loaded) {
      setIsLoading(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: plan.priceInr * 100, // ✅ INR → paise
      currency: "INR",
      name: "StreamHub Storage",
      description: `${mbToGB(plan.storageLimitMb)} GB Plan`,
      order_id: orderId,

      handler: async (response) => {
        console.log("handler res: ", response);
        await verifyPaymentService(response);
      },

      prefill: {
        name: user?.username,
        email: user?.email,
      },

      theme: { color: "#0ea5e9" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
    setIsLoading(false);
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!plans.length) {
    return <div className="p-6">Loading subscription plans...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Channel Subscription Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isActive = plan.id === currentPlanId;

          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 shadow-sm
                ${isActive ? "border-sky-600 bg-sky-50" : "bg-white"}`}
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-bold uppercase">{plan.name}</h3>
                {isActive && (
                  <span className="text-xs bg-sky-600 text-white px-2 py-1 rounded">
                    Current
                  </span>
                )}
              </div>

              <p>Storage: {mbToGB(plan.storageLimitMb)} GB</p>
              <p>Duration: {formatDuration(plan.durationDays)}</p>
              <p>
                Price:{" "}
                {plan.priceInr === undefined ? "Free" : `₹${plan.priceInr}`}
              </p>

              <button
                disabled={isActive || isLoading}
                onClick={() => handlePayment(plan)}
                className={`mt-4 w-full py-2 rounded-lg text-white
                  ${
                    isActive
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-sky-600 hover:bg-sky-700"
                  }`}
              >
                {isActive ? "Active Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Subscription;
