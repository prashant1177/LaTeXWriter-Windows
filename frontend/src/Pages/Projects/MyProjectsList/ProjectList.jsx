import { NoteCard, NoteCardHeader, NoteCardTitle } from "../../../ui/Card/Card";
import { Link } from "react-router-dom";

export default function ProjectList({ projects }) {
  return (
    <div>
      {" "}
      {projects && projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/latexeditor/${project._id}`}
              className="border-b-2 border-gray-400 py-4 hover:bg-gray-200 transition-all duration-200 rounded p-4"
            >
                <div className="overflow-hidden">
                  <h6 className="text-2xl">{project.title.slice(0, 60)}</h6>
                </div>
                <span className="text-sm text-gray-500 mt-2 block">
                  Created on: {" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-sm text-gray-500 mt-2 block">
                 Owned By:  {" "}
                  {project.owner.fullname}
                </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-6 w-full">
          No project is created by the user.
        </div>
      )}
    </div>
  );
}
