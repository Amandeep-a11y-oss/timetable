import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import timetableStore from "../store/timetableStore";
import UpdateSemesterForm from "../components/UpdateSemesterSchedule";

const SemesterList = ({ users }) => {
  const {
    users2,
    getDepartmentbyId,
    removesemester,
    loading,
    error,
  } = timetableStore();

  const [departmentId, setDepartmentId] = useState("");
  const [editingSemester, setEditingSemester] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (users2?._id) {
      getDepartmentbyId(users);
      setDepartmentId(users2._id); 
    }
  }, []);

  const allSemesters = Array.isArray(users2?.semesters) ? users2.semesters : [];

  const handleDelete = async (semesterId) => {
    if (!departmentId) return alert("No department ID found");
    const confirmDelete = window.confirm("Are you sure you want to delete this semester?");
    if (confirmDelete) {
      await removesemester({ timetableId: departmentId, semesterId });
      navigate(0);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-6 text-white">Semesters</h2>

      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

      {!loading && allSemesters.length === 0 && (
        <p className="text-center text-gray-400">No semesters found.</p>
      )}

      <ul className="space-y-4">
        {allSemesters.map((sem) => (
          <li
            key={sem._id}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition duration-200"
          >
            <span className="text-lg font-medium text-white">
              {sem.semester || "Unnamed Semester"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingSemester(sem)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200 shadow"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(sem._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 shadow"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingSemester && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-black mb-4">Edit Semester</h3>
          <UpdateSemesterForm
            semester={editingSemester}
            onClose={() => {
              setEditingSemester(null);
              getDepartmentbyId(departmentId); 
            }}
          />
        </div>
      )}
    </div>

  );
};

export default SemesterList;
