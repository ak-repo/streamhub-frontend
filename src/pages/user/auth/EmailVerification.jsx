import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context/context";

const EmailVerification = ({ onResend }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const { generateLink } = useAuth();

  const email = location.state?.email; // Get email from navigation state

  // Generate verification link on component mount
  useEffect(() => {
    const fetchLink = async () => {
      try {
        const res = await generateLink(email);
        console.log(res);
      } catch (error) {
        console.error("Error generating verification link:", error);
      }
    };

    if (email) {
      fetchLink();
    }
  }, [email]);

  // Handle resend verification email
  const handleResend = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (onResend) {
        await onResend(email); // your resend API function
        setMessage("Verification email sent!");
      } else {
        setMessage("Resend function not available.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to send verification email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-red-500 text-lg">
          No email found. Please go back and register again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          A verification link has been sent to{" "}
          <span className="font-medium">{email}</span>. Please check your inbox
          and click the link to activate your account.
        </p>

        {message && (
          <p
            className={`mb-4 ${
              message.includes("Failed") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleResend}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
        >
          {loading ? "Resending..." : "Resend Verification Email"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
