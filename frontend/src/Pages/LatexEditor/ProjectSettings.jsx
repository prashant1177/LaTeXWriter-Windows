import { useState } from "react";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";
import { useEffect } from "react";
import api from "../../api";
import { CircleMinus, CirclePlus, MoveLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ToastLayout from "../../ui/Toast";

export default function ProjectSettings({ projectid }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [newEditor, setNewEditor] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/projects/settings/${projectid}`);
        setTitle(res.data.project.title);
        setOwner(res.data.project.owner.email);
        setCollaborators(res.data.project.editors);
      } catch (err) {
        console.error("Error fetching project:", err);
        setToast("Error fetching project!");
        setTimeout(() => {
          setToast(null);
        }, 1500);
      }
    };
    fetchData();
  }, [projectid]);

  const removeAccess = (id) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const saveChanges = async () => {
    try {
      await api.put(`/projects/settings/${projectid}`, {
        title,
      });
      setToast("Changes Saved!");
    } catch (error) {
      setToast("Error saving changes");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const addEditor = async () => {
    try {
      await api.put(`/projects/editoracces/${projectid}`, {
        email: newEditor,
      });
      setToast("Access Given To New User!");
    } catch (error) {
      setToast("Error occured!");
    } finally {
      setNewEditor("");
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  const deleteProject = async () => {
    try {
      await api.delete(`/projects/delete/${projectid}`);
      navigate(`/`);
    } catch (e) {
      setToast("Failed to delete project");
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  return (
    <div className="h-full w-full  overflow-y-auto">
      {toast && <ToastLayout message={toast} />}
      <div className="flex justify-between py-2 px-8 bg-gray-50  border-b border-gray-200 text-sm ">
        <h2 className="flex items-center text-gray-950 gap-2">
          {" "}
          <Settings size={18} />
          Project Settings
        </h2>
        <div className="flex items-center gap-8">
          <Button onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
      <div className="space-y-8 rounded-2xl w-full p-6">
        {/* Title */}

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
          />
        </div>

        {/* Collaborators */}
        <div>
          <div className="space-y-2 ">
            <label className="block text-sm font-medium mb-2">Editors</label>
            <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md">
              <span>{owner}</span>
            </div>
            {collaborators.length > 0 &&
              collaborators.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 px-3  py-2 rounded-md"
                >
                  <span>{c.email}</span>
                  <button
                    onClick={() => removeAccess(c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <CircleMinus />
                  </button>
                </div>
              ))}
          </div>

          {/* Add New Editor */}
          <div className="flex gap-2 mt-3">
            <Input
              value={newEditor}
              onChange={(e) => setNewEditor(e.target.value)}
              placeholder="Enter email to add editor"
            />
            <Button onClick={addEditor}>
              <CirclePlus />
            </Button>
          </div>
        </div>
        <Button onClick={deleteProject} varient="danger">
          Delete Project
        </Button>
      </div>
    </div>
  );
}
