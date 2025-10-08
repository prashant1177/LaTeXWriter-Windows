import { useEffect, useState } from "react";
import api from "../../../api";
import ProjectList from "./ProjectList";
import {  PencilLine, User } from "lucide-react";
import { Link } from "react-router-dom";
import { NoteCard, NoteCardHeader } from "../../../ui/Card/Card";

export default function MyProfileIndex() {
  const [projects, setprojects] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/MyProject`);
        setprojects(res.data.projects);
        setUser(res.data.author.fullname);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div
        className="sticky top-0 flex justify-between px-8 backdrop-blur-md  p-4
"
      >
        <h1 className="text-gray-800 text-xl font-medium flex items-center gap-2 ">
          YOUR PROJECTS
        </h1>
        <div className="flex gap-4">
          <Link
            to={`/create/project`}
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-900 text-gray-50 hover:bg-gray-700 focus:ring-gray-500"
          >
            <PencilLine className="w-4 h-4" /> New Project
          </Link>
          <Link
            to={`/user`}
            className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-gray-800 hover:bg-gray-200 focus:ring-gray-500"
          >
            <User className="w-4 h-4" />{user ? user : "User Profile" }
          </Link>
        </div>
      </div>

      <div className="px-8 ">
          {projects ? (
            <ProjectList projects={projects} />
          ) : (
            <NoteCard className="bg-gray-50 animate-pulse text-gray-500 mt-8">
              <NoteCardHeader>
                <h1 className="text-center w-full">Loading you content...</h1>
              </NoteCardHeader>
            </NoteCard>
          )}
      </div>
    </div>
  );
}
