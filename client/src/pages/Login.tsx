// Login.tsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/auth.service";
import { AuthContext } from "../context/AuthContext";
import GoogleLogo from "../assets/google.svg";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await AuthService.login(form);

      // Depending on your backend adjust this:
      const userData = response.user || response.data?.user;

      setUser(userData);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-sm text-black text-center mb-6">
          Login to continue managing your expenses smartly.
        </h3>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 mb-6 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <hr />
          <span className="absolute top-1/2 left-1/2 px-3 bg-white text-gray-500 text-xs -translate-x-1/2 -translate-y-1/2">
            OR CONTINUE WITH EMAIL
          </span>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/80"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black/80"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 ml-1 hover:underline cursor-pointer"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
