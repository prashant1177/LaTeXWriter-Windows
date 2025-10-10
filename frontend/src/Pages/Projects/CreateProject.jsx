import { useState } from "react";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { MoveLeft } from "lucide-react";
import ToastLayout from "../../ui/Toast";
export default function CreateProject() {
  const [toast, setToast] = useState(null);

  const [title, setTitle] = useState("");
  const [documentClass, setDocumentClass] = useState("Blank");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(`/`);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const Project = {
        title: title,
        documentClass: documentClass,
      };
      const res = await api.post("/projects/create", Project);
      const ProjectID = res.data.id;
      navigate(`/latexeditor/${ProjectID}`);
    } catch (err) {
      if (err.response && err.response.data.message) {
        setToast(err.response.data.message);
        if (err.response.data.requiredpremium) {
          navigate(`/pricing`);
        }
      } else {
        setToast("Error creating project. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };

  const docs = ["Blank", "Article", "Report", "Book", "Letter"];
  return (
    <div className="min-h-screen flex flex-col items-center  w-full p-6">
      {toast && <ToastLayout message={toast} />}

      <div className="max-w-2xl w-3/6 flex flex-col space-y-8 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 ">
        <div className="text-center">
          <h1 className="text-gray-800 text-2xl sm:text-3xl font-medium  gap-2 py-2 uppercase">
            {" "}
            Create New Project
          </h1>

          <div className="w-16 h-1 bg-gray-500 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-900 block text-sm font-medium">
              Title
            </label>
            <Input
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              varient="transparent"
              maxLength={70}
              className="transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-900 block text-sm font-medium">
              Document Template
            </label>
            <div className="flex w-full justify-between border px-4 py-1 rounded-lg ">
              {docs.map((doc, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg  cursor-pointer transition-all
     
     hover:bg-gray-50  `}
                >
                  <input
                    type="radio"
                    name="documentClass"
                    value={doc}
                    checked={documentClass === doc}
                    onChange={(e) => setDocumentClass(e.target.value)}
                    className={`w-4 h-4 cursor-pointer  appearance-none border-2 rounded-full  ${
                      documentClass == doc
                        ? "bg-gray-500 border-gray-300"
                        : "border-gray-300"
                    }
  `}
                  />
                  <span className="text-sm text-gray-700">{doc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-2 pt-4 border-t border-white/10">
          <div className="order-1 sm:order-2">
            <Button
              varient="transparent"
              disabled={loading}
              onClick={handleBack}
              className="w-full sm:w-auto  py-2.5 transition-all duration-200 hover:scale-105 active:scale-95 "
            >
              {loading ? null : (
                <div className="text-gray-800 flex items-center gap-3 hover:text-gray-950 transition">
                  <MoveLeft />
                </div>
              )}
            </Button>
          </div>
          <div className="order-1 sm:order-2">
            <Button
              disabled={loading}
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95 "
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Just a moment…
                </div>
              ) : (
                <div className="flex items-center gap-2">Create Project</div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
