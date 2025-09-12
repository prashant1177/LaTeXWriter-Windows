import { NoteCard, NoteCardHeader, NoteCardTitle } from "../../../ui/Card/Card";
import { Link } from "react-router-dom";

export default function ProjectList({ projects }) {
  return (
    <div className="mt-8 flex flex-col w-full px-4">
      {" "}
      {projects && projects.length > 0 ? (
        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            <NoteCard key={project._id} className="hover:shadow-lg transition-shadow">
              <NoteCardHeader className="overflow-hidden">
                  <NoteCardTitle>{project.title.slice(0, 60)}</NoteCardTitle>
                <Link to={`/latexeditor/${project._id}`}>
                  <button className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                    Open in Editor
                  </button>
                </Link>
              </NoteCardHeader>
            </NoteCard>
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
