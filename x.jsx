import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import { useAuth } from "../../../context/context";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      console.log("form: ", form);
      setLoading(false);
    }, 1000);
    if (isLogin) {
      await login(form.email, form.password);
    } else {
      await register(form);
      navigate("/verify");
    }
    if (isAuthenticated) {
      navigate("/hub");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const oauthProviders = [
    {
      name: "Google",
      icon: "🔍",
      color: "from-red-50 to-red-50 hover:shadow-md border-red-200",
    },
    {
      name: "GitHub",
      icon: "💻",
      color: "from-gray-50 to-gray-50 hover:shadow-md border-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-12 justify-between border-r border-white/10 backdrop-blur-sm">
            <div>
              <div className="flex items-center space-x-3 mb-12">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  StreamHub
                </h1>
              </div>

              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Your Central Hub for{" "}
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Files & Collaboration
                </span>
              </h2>

              <p className="text-blue-100/80 text-lg mb-10 leading-relaxed">
                Streamline your workflow with seamless file sharing, real-time
                communication, and smart notifications—all in one powerful
                platform.
              </p>

              <div className="space-y-4">
                {[
                  "Secure file storage & sharing",
                  "Real-time team collaboration",
                  "Smart activity tracking",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-100/90 group-hover:text-blue-100 transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-blue-100/60 text-sm">
              © 2024 StreamHub. All rights reserved.
            </p>
          </div>

          {/* Right Side - Auth Form */}
          <div className="p-8 lg:p-12 bg-gradient-to-br from-white/10 to-white/5 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white">StreamHub</h1>
                </div>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">
                  {isLogin ? "Welcome back" : "Join StreamHub"}
                </h2>
                <p className="mt-2 text-blue-100/70">
                  {isLogin
                    ? "Sign in to continue your workflow"
                    : "Create your account to get started"}
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="mb-8">
                <div className="bg-white/10 rounded-xl p-1.5 backdrop-blur-sm border border-white/20">
                  <div className="grid grid-cols-2 gap-1">
                    {["Sign In", "Sign Up"].map((label, idx) => (
                      <button
                        key={idx}
                        onClick={() => setIsLogin(idx === 0)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          (idx === 0 && isLogin) || (idx === 1 && !isLogin)
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : "text-blue-100/70 hover:text-blue-100"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Container */}
              <div className="space-y-5">
                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {oauthProviders.map((provider) => (
                    <button
                      key={provider.name}
                      className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border border-white/20 transition-all duration-200 bg-white/10 hover:bg-white/20 hover:border-white/40 group backdrop-blur-sm`}
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">
                        {provider.icon}
                      </span>
                      <span className="text-sm font-medium text-white/90 group-hover:text-white">
                        {provider.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-gradient-to-br from-white/10 to-white/5 text-blue-100/70 backdrop-blur-sm">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Username Field */}
                  {!isLogin && (
                    <div className="transition-all duration-300 animate-in">
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          id="username"
                          name="username"
                          type="text"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="Full name"
                          className="w-full bg-white/10 border border-white/20 pl-12 pr-4 py-3 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:border-white/30"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email Field */}
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      required
                      className="w-full bg-white/10 border border-white/20 pl-12 pr-4 py-3 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:border-white/30"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder={isLogin ? "Password" : "Create password"}
                      required
                      className="w-full bg-white/10 border border-white/20 pl-12 pr-12 py-3 text-white placeholder-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm hover:border-white/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-blue-300/50 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Forgot Password */}
                  {isLogin && (
                    <div className="text-right">
                      <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  {!isLogin && (
                    <div className="transition-all duration-300">
                      <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="w-4 h-4 mt-1 flex-shrink-0 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 cursor-pointer accent-blue-500"
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm text-blue-100/80 leading-tight cursor-pointer"
                        >
                          I agree to the{" "}
                          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Terms of Service
                          </button>{" "}
                          and{" "}
                          <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Privacy Policy
                          </button>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  type="button"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 px-4 text-sm font-semibold text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-0 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                >
                  <span>
                    {loading
                      ? "Loading..."
                      : isLogin
                      ? "Sign in to StreamHub"
                      : "Create account"}
                  </span>
                  {!loading && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>

                {/* Switch Auth Mode */}
                <div className="text-center pt-2">
                  <p className="text-sm text-blue-100/70">
                    {isLogin
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
