import { useState } from "react";
import { useEffect } from "react";
import api from "../../api";
import Button from "../../ui/Button/Button";
import TextArea from "../../ui/Input/TextArea";
import { Info, Mail, User2, MoveLeft } from "lucide-react";
import Input from "../../ui/Input/Input";
import { Link } from "react-router-dom";
import ToastLayout from "../../ui/Toast";

export default function UserEdit({ handleLogout }) {
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    fullname: "",
    userabout: "",
    username: "",
    email: "",
  });
  const [premium, setPremium] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/user");
      setForm(res.data.user);
      setPremium(res.data.user.isPremium);
    } catch (error) {
      console.error(error);
    }
  };

  // saveChanges
  const saveChanges = async () => {
    try {
      await api.put("/user", form);
      setToast("Changed Saved!");
    } catch (error) {
      console.error(error);
      setToast("Error Saving Changes!");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center">
      {toast && <ToastLayout message={toast} />}

      <Link
        to="/"
        className="fixed top-8 left-8 flex items-center text-gray-50 gap-2 bg-gray-900 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:bg-gray-800 focus:ring-gray-600"
      >
        <MoveLeft size={18} /> Home
      </Link>
      <div className="grid sm:grid-cols-2 w-full h-full gap-4 sm:gap-0">
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
        <div className="w-full px-4 sm:px-8 lg:px-16 p-8">
          <div className="pb-2">
            <div className="w-full mt-16 mb-4 ">
              <h1 className="text-2xl text-blue-600">Account Details</h1>
              <p className=" mt-2 text-gray-600 italic">@{form.username}</p>
            </div>
            <div className="w-full border-t-1 border-gray-300">
              <div className="grid grid-cols-2 border-b-1 border-gray-300 py-4">
                <label className="flex items-center gap-2 font-medium text-sm">
                  <Mail className="h-4 w-4" /> Email{" "}
                </label>
                <span className="text-sm text-gray-600 italic">
                  {form.email}
                </span>
              </div>
              <div className="grid grid-cols-2 border-b-1 border-gray-300 py-4">
                <label className="flex items-center gap-2 font-medium text-sm">
                  <Mail className="h-4 w-4" /> Premium Details{" "}
                </label>
                {premium ? (
                  <div className="flex items-center gap-2 flex-col md:flex-row ">
                    <div className="group relative">
                      <a
                        href="https://latexwriter.com/user/login"
                        className="  bg-gradient-to-br from-blue-500 to-blue-700 text-gray-50 px-4 py-2 rounded-md  font-semibold"
                      >
                        Premium User
                      </a>
                      <p className="text-sm top-10 px-4 py-2 rounded-md bg-gray-100/70 text-gray-950 group-hover:block hidden absolute shadow-xl border-1 border-gray-200 w-48">
                        See More Details
                      </p>
                    </div>
                    <a
                      href="https://latexwriter.com/user/login"
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Cancel Premium
                    </a>
                  </div>
                ) : (
                  <a
                    href="https://latexwriter.com/user/login"
                    className="px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-gray-50 hover:bg-blue-400 focus:ring-blue-300"
                  >
                    Buy Premium
                  </a>
                )}
              </div>
              <div className="space-y-6 text-gray-700  w-full  pt-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-sm">
                    <User2 className="w-4 h-4 text-chart-1" />
                    Full Name
                  </label>{" "}
                  <Input
                    id="fullname"
                    required
                    value={form.fullname}
                    onChange={(e) =>
                      setForm({ ...form, fullname: e.target.value })
                    }
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="flex items-center gap-2 font-medium text-sm">
                    <Info className="h-4 w-4" /> About{" "}
                  </label>
                  <TextArea
                    id="about"
                    rows={4}
                    value={form.userabout}
                    onChange={(e) =>
                      setForm({ ...form, userabout: e.target.value })
                    }
                    placeholder="A short bio about you"
                  />
                </div>

                <div className="flex  justify-between">
                  <div className="flex gap-4">
                    <Button
                    type="button"
                      onClick={saveChanges}
                      className="rounded-2xl"
                      varient="primary"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={fetchData}
                      className="rounded-2xl"
                      varient="transparent"
                    >
                      Reset
                    </Button>
                  </div>
                  <Button
                    type="button"
                    varient="transparent"
                    onClick={handleLogout}
                    className="rounded-2xl"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
