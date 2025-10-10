import { useState } from "react";
import api from "../../api";
import TextArea from "../../ui/Input/TextArea";
import Button from "../../ui/Button/Button";
import ToastLayout from "../../ui/Toast";

export default function Commit({ projectid }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const commitChanges = async () => {
    try {
      await api.post(`/versions/commit/${projectid}`, {
        message,
      });
      setToast("Commit Saved!");
    } catch (error) {
      setToast("Error Saving Commit!");
    } finally {
      setTimeout(() => {
        setToast(null);
      }, 1500);
    }
  };
  return (
    <div className="p-8">
      {toast && <ToastLayout message={toast} />}
      <label className="text-gray-900 block mb-2 text-sm font-medium mt-4">
        Enter Message To Commit
      </label>
      <TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        varient="transparent"
      />
      <div className="flex gap-4 my-4">
        <Button onClick={commitChanges} varient="primary">
          Commit Changes
        </Button>
      </div>
    </div>
  );
}
