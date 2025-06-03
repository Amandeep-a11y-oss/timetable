import React, { useEffect, useState } from "react";
import timetableStore from "../store/timetableStore";
import { useNavigate } from "react-router-dom";

const SemesterScheduler = ({ semesterArray }) => {
  const {
    getTimetables,
    getSemesterSchedule,
    updateSchedule,
    deleteSchedule,
  } = timetableStore();

  const [selectedId, setSelectedId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validDays = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  useEffect(() => {
    getTimetables();
  }, []);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      getSemesterSchedule(selectedId)
        .then((data) => setSchedules(data?.schedule || []))
        .catch((err) => console.error("Error loading schedule", err))
        .finally(() => setLoading(false));
    }
  }, [selectedId]);

  const refreshSchedules = async () => {
    try {
      const data = await getSemesterSchedule(selectedId);
      setSchedules(data?.schedule || []);
    } catch (err) {
      console.error("Failed to refresh schedules", err);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateSchedule(id, updatedData);
      alert("Schedule updated");
      refreshSchedules();
      navigate(0);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id);
        alert("Schedule deleted");
        refreshSchedules();
        navigate(0);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Select a Semester</h1>

      <select
        onChange={(e) => setSelectedId(e.target.value)}
        value={selectedId || ""}
        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select Semester
        </option>
        {semesterArray?.map((s) => (
          <option key={s._id} value={s._id}>
            {s.semester}
          </option>
        ))}
      </select>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-300">Loading schedules...</p>
        ) : selectedId ? (
          schedules.length > 0 ? (
            <ScheduleList
              schedules={schedules}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              validDays={validDays}
            />
          ) : (
            <p className="text-yellow-300">No schedules found for this semester.</p>
          )
        ) : (
          <p className="text-gray-400">Please select a semester to view schedules.</p>
        )}
      </div>
    </div>
  );
};

const ScheduleList = ({ schedules, onUpdate, onDelete, validDays }) => {
  const [editedDays, setEditedDays] = useState(
    schedules.reduce((acc, sch) => ({ ...acc, [sch._id]: sch.day }), {})
  );

  const handleInputChange = (id, value) => {
    setEditedDays((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-4">
      {schedules.map((sch) => (
        <div
          key={sch._id}
          className="border border-gray-300 rounded-md p-4 bg-white shadow-sm"
        >
          <div className="mb-3">
            <label className="font-semibold text-gray-700 mr-2">Day:</label>
            <select
              value={editedDays[sch._id] || ""}
              onChange={(e) => handleInputChange(sch._id, e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-black w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Select a day</option>
              {validDays.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onUpdate(sch._id, { day: editedDays[sch._id] })}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              onClick={() => onDelete(sch._id)}
              className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>

  );
};

export default SemesterScheduler;
