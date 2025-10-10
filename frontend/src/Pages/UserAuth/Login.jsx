import React, { useState } from "react";
import api, { setAuthToken } from "../../api";
import { User, Lock, ArrowRight, EyeOff, Eye } from "lucide-react";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import logo from "../../assets/logo.png";
import ToastLayout from "../../ui/Toast";
function Login({ onLogin }) {
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/login", form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("username", res.data.username);

      setAuthToken(token);

      localStorage.getItem("token");
      onLogin(token);
    } catch (err) {
      setToast(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  return (
    <div className="w-full h-screen">
      {toast && <ToastLayout message={toast} />}

      <div className="grid sm:grid-cols-2 w-full h-full gap-4 sm:gap-0">
        <div className="w-full h-fit lg:px-32 px-4  flex flex-col items-center pt-16">
          <div className="flex items-center w-full gap-2">
            <img src={logo} alt="Logo" className="h-8 aspect-square rounded" />
            <h1 className="text-xl font-bold">LaTeXWriter</h1>
          </div>
          <div className="w-full mt-16">
            <h1 className="text-2xl">Welcome Back!</h1>
            <p className="text-sm mt-4 text-gray-600">
              Securely sign in to your account to access personalized tools,
              saved documents, and your workspace.
            </p>
          </div>
          <div className="w-full mt-12">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 text-gray-700  w-full"
            >
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-sm">
                  <User className="w-4 h-4 text-chart-1" />
                  Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-2 relative">
                <label className="flex items-center gap-2 font-medium text-sm">
                  <Lock className="w-4 h-4 text-chart-2" />
                  Password
                </label>
                <Input
                  type={showPasswordInput ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="absolute right-3 top-0 text-gray-500 hover:text-gray-700"
                >
                  {showPasswordInput ? (
                    <div className="flex items-center gap-2 text-sm">
                      Hide <EyeOff size={16} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      Show <Eye size={16} />
                    </div>
                  )}
                </button>
              </div>

              <div className="w-full flex justify-center my-8 ">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2 ">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className=" text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <a
                  href="https://latexwriter.com/user/register"
                  target="_blank"
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-950 h-full flex items-center p-8 w-full">
          <div className="grid grid-rows-3 h-full py-16 w-full">
            <div className="row-span-2 flex flex-col justify-center  items-start w-full">
              <h1 className="text-5xl lg:text-6xl  bg-gradient-to-r from-gray-200  to-gray-300 text-transparent bg-clip-text">
                Fast & Simple <br />
                Way to Write LaTeX
              </h1>

              <p className="text-lg text-gray-400 mt-6 ">
                Experience modern LaTeX writing like never before - collaborate
                online, compile locally, and save seamlessly to the cloud or
                your device.
              </p>
              <div className="flex items-center gap-4 mt-12">
                <a href="https://latexwriter.com/features" target="_blank">
                  <Button varient="muted">Explore Features</Button>
                </a>{" "}
                <a
                  href="https://latexwriter.com/documentation/latexwriter"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-200 bg-gray-800 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Get Help
                </a>
              </div>
            </div>
            <div className="row-span-2 flex flex-col justify-center  items-center w-full text-gray-400">
              <div className="flex gap-4 items-center">
                Connect With Community{" "}
              </div>
              <ul className="flex justify-center mt-5 space-x-5">
                <li>
                  <a href="https://www.youtube.com/@LaTeXWriter">
                    <svg
                      viewBox="0 0 576 512"
                      fill="white"
                      height="1.6em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"></path>
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://www.reddit.com/r/LaTeXWriters">
                    <svg
                      viewBox="0 0 512 512"
                      fill="white"
                      height="1.6em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M373 138.6c-25.2 0-46.3-17.5-51.9-41l0 0c-30.6 4.3-54.2 30.7-54.2 62.4l0 .2c47.4 1.8 90.6 15.1 124.9 36.3c12.6-9.7 28.4-15.5 45.5-15.5c41.3 0 74.7 33.4 74.7 74.7c0 29.8-17.4 55.5-42.7 67.5c-2.4 86.8-97 156.6-213.2 156.6S45.5 410.1 43 323.4C17.6 311.5 0 285.7 0 255.7c0-41.3 33.4-74.7 74.7-74.7c17.2 0 33 5.8 45.7 15.6c34-21.1 76.8-34.4 123.7-36.4l0-.3c0-44.3 33.7-80.9 76.8-85.5C325.8 50.2 347.2 32 373 32c29.4 0 53.3 23.9 53.3 53.3s-23.9 53.3-53.3 53.3zM157.5 255.3c-20.9 0-38.9 20.8-40.2 47.9s17.1 38.1 38 38.1s36.6-9.8 37.8-36.9s-14.7-49.1-35.7-49.1zM395 303.1c-1.2-27.1-19.2-47.9-40.2-47.9s-36.9 22-35.7 49.1c1.2 27.1 16.9 36.9 37.8 36.9s39.3-11 38-38.1zm-60.1 70.8c1.5-3.6-1-7.7-4.9-8.1c-23-2.3-47.9-3.6-73.8-3.6s-50.8 1.3-73.8 3.6c-3.9 .4-6.4 4.5-4.9 8.1c12.9 30.8 43.3 52.4 78.7 52.4s65.8-21.6 78.7-52.4z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://x.com/LaTeXWriter">
                    <svg
                      viewBox="0 0 512 512"
                      height="1.7em"
                      xmlns="http://www.w3.org/2000/svg"
                      className="svgIcon"
                      fill="white"
                    >
                      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
