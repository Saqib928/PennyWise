// Register.tsx
import { useState } from "react";
import { AuthService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import CountrySelect from "../components/CountrySelect";

interface RegisterForm {
  firstName: string;
  lastName: string;
  gender: string;
  country: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    gender: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await AuthService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        country: form.country,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <h1 className="mb-6 text-3xl font-semibold text-center">Register</h1>

        <div className="space-y-4">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            value={form.firstName}
          />

          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            value={form.lastName}
          />

          <div className="flex items-center gap-4">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>

          <CountrySelect
            value={form.country}
            onChange={(value) => setForm({ ...form, country: value })}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            value={form.email}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            value={form.password}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            value={form.confirmPassword}
          />

          <button
            onClick={handleRegister}
            className="w-full py-2 font-medium text-white bg-black rounded-lg"
          >
            Create Account
          </button>
        </div>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-center text-blue-600 underline cursor-pointer"
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}
