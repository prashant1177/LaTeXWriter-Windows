import { useState } from "react";
import Input from "../../ui/Input/Input";
import TextArea from "../../ui/Input/TextArea";
import Button from "../../ui/Button/Button";
import { useEffect } from "react";
import api from "../../api";
import {
  CircleMinus,
  CirclePlus,
  MoveLeft,
  MoveRight,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProjectSettings({ projectid, handleViewRight }) {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [topics, setTopics] = useState("");
  const [owner, setOwner] = useState("");
  const [collaborators, setCollaborators] = useState({});
  const [newEditor, setNewEditor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/projects/settings/${projectid}`);
        setTitle(res.data.project.title);
        setAbout(res.data.project.about);
        setTopics(res.data.project.topics);
        setOwner(res.data.project.owner.email);
        setCollaborators(res.data.project.editors);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchData();
  }, [projectid]);
  const removeAccess = (id) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const saveChanges = async () => {
    await api.put(`/projects/settings/${projectid}`, {
      title,
      about,
      topics,
    });
  };
  const addEditor = async () => {
    await api.put(`/projects/editoracces/${projectid}`, {
      email: newEditor,
    });
    setNewEditor("");
  };
  const deleteProject = async () => {
    try {
      await api.delete(`/projects/delete/${projectid}`);
      navigate(`/`);
    } catch (e) {
      alert("Failed to delete project");
    }
  };

  return (
    <div className="h-full w-full  overflow-y-auto">
      <div className="flex justify-between py-2 px-8 bg-gray-50  border-b border-gray-200 text-sm ">
        <h2 className="flex items-center text-gray-950 gap-2">
          {" "}
          <Settings size={18} />
          Project Settings
        </h2>
        <div className="flex items-center gap-8">
          <button
            className="text-gray-800 flex items-center gap-3 hover:text-gray-950 transition"
            onClick={() => handleViewRight("Editor")}
          >
            <MoveLeft /> Back To Editor
          </button>

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

        {/* About */}
        <div>
          <label className="block text-sm font-medium mb-1">About</label>
          <TextArea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Enter project description"
            rows={4}
          />
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium mb-2">Topics</label>
          <Input
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Enter topics (comma separated)"
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
              collaborators.map((c) => (
                <div
                  key={c.id}
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
