import React, { useEffect, useState } from "react";
import timetableStore from "../store/timetableStore";
import { useNavigate } from "react-router-dom";

const SemesterScheduler = ({ users }) => {
  const {
    Updaeperiod,
    removeperiod,
  } = timetableStore();

  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const navigate = useNavigate();

  const normalizedUsers = Array.isArray(users) ? users : [users];

  const allSemesters = normalizedUsers.flatMap((t) => t.semesters || []);

  const days = allSemesters.flatMap((sem) =>
    Array.isArray(sem.schedule)
      ? sem.schedule.map((dayObj) => ({
        semesterId: sem._id,
        semesterName: sem.semester,
        dayId: dayObj._id,
        dayName: dayObj.day,
      }))
      : []
  );

  const filteredDays = days.filter((d) => d.semesterId === selectedSemesterId);
  const selectedSemester = allSemesters.find((sem) => sem._id === selectedSemesterId);
  const selectedDaySchedule = selectedSemester?.schedule?.find(
    (day) => day._id === selectedDayId
  );

  const handlePeriodUpdate = async (periodId, formData) => {
    try {
      await Updaeperiod(periodId, formData);
      alert("Period updated");
      navigate(0);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handlePeriodDelete = async (scheduleId, periodId) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await removeperiod(scheduleId, periodId);
        alert("Period deleted");
        navigate(0)
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Semester Schedule Editor
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-2">
          Select Semester
        </label>
        <select
          value={selectedSemesterId}
          onChange={(e) => {
            setSelectedSemesterId(e.target.value);
            setSelectedDayId("");
          }}
          className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a semester</option>
          {allSemesters.map((s) => (
            <option key={s._id} value={s._id}>
              {s.semester}
            </option>
          ))}
        </select>
      </div>

      {allSemesters.length === 0 && (
        <p className="text-center text-gray-400 italic mt-4">
          No semesters available.
        </p>
      )}

      {selectedSemesterId && filteredDays.length === 0 && (
        <p className="text-center text-gray-300 italic mt-4">
          No days scheduled for this semester.
        </p>
      )}

      {filteredDays.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-white mb-2">
            Select Day
          </label>
          <select
            value={selectedDayId}
            onChange={(e) => setSelectedDayId(e.target.value)}
            className="w-full bg-white text-black border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Day</option>
            {filteredDays.map((d) => (
              <option key={d.dayId} value={d.dayId}>
                {d.dayName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDaySchedule && (
        <div className="mt-8 bg-gray-700 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedDaySchedule?.periods?.length === 0 && (
              <p className="text-center text-gray-300 italic mt-4">
                No periods added yet.
              </p>
            )}
          </h3>

          <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
            {selectedDaySchedule.periods?.map((period) => (
              <PeriodEditor
                key={period._id}
                period={period}
                scheduleId={selectedDaySchedule._id}
                onUpdate={handlePeriodUpdate}
                onDelete={handlePeriodDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>

  );
};


const periodRegex = /^(I{1,3}|IV|V|VI|Lunch)$/i;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; 

const PeriodEditor = ({ period, scheduleId, onUpdate, onDelete }) => {
  const [form, setForm] = useState({
    period: period.period || "",
    startTime: period.startTime || "",
    endTime: period.endTime || "",
  });

  const [errors, setErrors] = useState({
    period: "",
    startTime: "",
    endTime: "",
  });

  const validate = () => {
    const newErrors = {};

    if (!periodRegex.test(form.period.trim())) {
      newErrors.period = "Use I, II, III, IV, V, VI or Lunch";
    }

    if (!timeRegex.test(form.startTime.trim())) {
      newErrors.startTime = "Invalid time format (HH:MM)";
    }

    if (!timeRegex.test(form.endTime.trim())) {
      newErrors.endTime = "Invalid time format (HH:MM)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); 
  };

  const handleUpdate = () => {
    if (validate()) {
      onUpdate(period._id, form);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6 bg-white p-4 rounded-md shadow">
      <div>
        <input
          name="period"
          value={form.period}
          onChange={handleChange}
          placeholder="Period (I, II, ... Lunch)"
          className={`w-24 px-3 py-2 border ${errors.period ? "border-red-500" : "border-gray-300"
            } rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.period && (
          <p className="text-red-500 text-sm mt-1">{errors.period}</p>
        )}
      </div>

      <div>
        <input
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          placeholder="Start Time (HH:MM)"
          className={`w-28 px-3 py-2 border ${errors.startTime ? "border-red-500" : "border-gray-300"
            } rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.startTime && (
          <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
        )}
      </div>

      <div>
        <input
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          placeholder="End Time (HH:MM)"
          className={`w-28 px-3 py-2 border ${errors.endTime ? "border-red-500" : "border-gray-300"
            } rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.endTime && (
          <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition duration-200"
        >
          Update
        </button>
        <button
          onClick={() => onDelete(scheduleId, period._id)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md shadow transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};


export default SemesterScheduler;
