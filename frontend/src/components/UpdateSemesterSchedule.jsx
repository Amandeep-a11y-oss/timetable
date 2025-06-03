import React, { useState } from "react";
import timetableStore from "../store/timetableStore";
import { useNavigate } from "react-router-dom";

const UpdateSemesterForm = ({ semester, onClose }) => {
  const { updatesemesterSchedule } = timetableStore();
  const [semesterName, setSemesterName] = useState(semester?.semester || "");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const semesterRegex = /^(I{1,3}|IV|V|VI|VII|VIII)\sSemester$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (!semesterRegex.test(semesterName.trim())) {
            alert("❌ Invalid format. Use 'I Semester', 'II Semester', etc.");
            return;
        }

    try {
      await updatesemesterSchedule(semester._id, { semester: semesterName });
      setMessage("Updated successfully.");
      onClose?.(); 
      navigate(0);
    } catch (err) {
      setMessage("Update failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
  <h3 className="text-xl font-semibold mb-4 text-gray-800">Edit Semester</h3>

  <input
    type="text"
    value={semesterName}
    onChange={(e) => setSemesterName(e.target.value)}
    placeholder="Semester name"
    required
    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
  />
  {semesterName && !semesterRegex.test(semesterName) && (
                    <p className="text-red-500 text-sm mt-1">Format should be like "I Semester"</p>
                )}

  <div className="flex justify-end gap-4">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
    >
      Update
    </button>
    <button
      type="button"
      onClick={onClose}
      className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md transition"
    >
      Cancel
    </button>
  </div>

  {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
</form>

  );
};

export default UpdateSemesterForm;
