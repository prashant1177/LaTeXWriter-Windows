import { useState } from "react";
import Button from "../../ui/Button/Button";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/Input/Input";

export default function Connect() {
  const [conntectionID, setConntectionID] = useState(""); // title state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      setLoading(true);
      const res = await api.post("/projects/connect", { conntectionID });
      if (res.data.projectsID) {
        console.log("Project found:", res.data.projectsID);
        const ProjectID = res.data.projectsID;
        navigate(`/latexeditor/${ProjectID}`);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center  w-full p-6">
      <div className="max-w-2xl w-3/6 flex flex-col space-y-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mt-16 ">
        <div className="text-center">
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-medium  gap-2 py-2 uppercase">
            {" "}
            Connect To Project
          </h1>

          <div className="w-16 h-1 bg-gray-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-900 block text-sm font-medium">
              Connection ID
            </label>
            <Input
              disabled={loading}
              value={conntectionID}
              onChange={(e) => setConntectionID(e.target.value)}
              varient="transparent"
              maxLength={70}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="flex items-center justify-center ">
            <Button
              disabled={loading}
              onClick={handleConnect}
              className="w-full sm:w-auto px-8 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95 "
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Connecting…
                </div>
              ) : (
                <div className="flex items-center gap-2">Connect Project</div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
