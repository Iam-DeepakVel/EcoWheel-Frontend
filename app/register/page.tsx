"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";
import config from "@/config";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const router = useRouter();
  const { setUserInfo } = useUserContext();

  const [loading, setLoading] = useState(false);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signupToast = toast.loading("Signing up...");
    try {
      setLoading(true);
      const res = await axios.post(`${config.apiUrl}/register`, formData);

      if (res.data.token) {
        Cookies.set("token", res.data.token);

        const response = await axios.get(`${config.apiUrl}/profile`, {
          headers: {
            token: res.data.token,
          },
        });

        if (response) {
          // set user details in cookie
          Cookies.set("user-details", JSON.stringify(response.data));

          // Update user details in global context
          setUserInfo(response.data);
          toast.success("Successfully Signed up", {
            id: signupToast,
          });
          router.push("/upload");
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message, {
        id: signupToast,
      });
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex items-center gap-2 justify-center">
          <img
            className="h-14 w-auto"
            src="/assets/ecowheel-logo.png"
            alt="EcoWheel"
          />
          <h2 className="text-2xl font-bold">EcoWheel</h2>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up to create an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-40"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
