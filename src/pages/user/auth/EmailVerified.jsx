import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/context";

const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const navigate = useNavigate();
  const { verifyLink } = useAuth();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await verifyLink(email, token);
        console.log("Verification response:", res);

        if (!res) throw new Error("Verification failed");

        setStatus("success");

        navigate("/hub/home");
      } catch (err) {
        setStatus("error" + err);
      }
    };

    if (email && token) {
      verifyEmail();
    } else {
      setStatus("error");
    }
  }, [email, token, navigate]);

  const handleLoginRedirect = () => navigate("/login");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <p className="text-gray-600 text-lg">Verifying your email...</p>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now log in.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Go to Login
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired.
            </p>
            <button
              onClick={() => navigate("/resend-verification")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Resend Verification Email
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerified;
