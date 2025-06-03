import React, { useEffect, useState } from "react";
import timetableStore from "../store/timetableStore";
import { useNavigate } from "react-router-dom";

const SemesterScheduler = ({ users }) => {
  const {
    removelecture,
    UpdateLecture,
    ReadRoom,
    utilsRoom,
    ReadGroup,
    utilsGroup,
    ReadTeacher,
    utilsTeacher,
    ReadCourse,
    utilsCourse,
  } = timetableStore();

  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedDayId, setSelectedDayId] = useState("");
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState("");

  const [validationRoom, setValidationRoom] = useState([]);
  const [validationGroup, setValidationGroup] = useState([]);
  const [validationTeacher, setValidationTeacher] = useState([]);
  const [validationCourse, setValidationCourse] = useState([]);

  const [lectureData, setLectureData] = useState({
    subject: "",
    teacher: "",
    room: "",
    group: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    ReadRoom();
    ReadGroup();
    ReadTeacher();
    ReadCourse();
  }, []);

  useEffect(() => {
    if (utilsRoom?.data?.length) {
      setValidationRoom(utilsRoom.data.map(room => room.roomName).filter(Boolean));
    }
  }, [utilsRoom]);

  useEffect(() => {
    if (utilsGroup?.data?.length) {
      setValidationGroup(utilsGroup.data.map(g => g.groupName).filter(Boolean));
    }
  }, [utilsGroup]);

  useEffect(() => {
    if (utilsTeacher?.data?.length) {
      setValidationTeacher(utilsTeacher.data.map(t => t.teacherCode));
    }
  }, [utilsTeacher]);

  useEffect(() => {
    if (utilsCourse?.data?.length) {
      setValidationCourse(utilsCourse.data.map(c => c.courseCode));
    }
  }, [utilsCourse]);

  const normalizedUsers = Array.isArray(users) ? users : [users];
  const allSemesters = normalizedUsers.flatMap((u) => u.semesters || []);
  const selectedSemester = allSemesters.find((s) => s._id === selectedSemesterId);
  const days = selectedSemester?.schedule?.map((day) => ({
    semesterId: selectedSemester._id,
    semesterName: selectedSemester.semester,
    dayId: day._id,
    dayName: day.day,
  })) || [];

  const selectedDaySchedule = selectedSemester?.schedule?.find((day) => day._id === selectedDayId);
  const dayPeriods = selectedDaySchedule?.periods?.map((period) => ({
    ...period,
    periodId: period._id,
    lectures: period.lectures || [],
  })) || [];

  const selectedPeriod = dayPeriods.find((p) => p.periodId === selectedPeriodId) || null;
  const selectedLecture = selectedPeriod?.lectures.find((l) => l._id === selectedLectureId) || null;

  useEffect(() => {
    if (selectedLecture) {
      setLectureData({
        subject: selectedLecture.courseCode || "",
        teacher: selectedLecture.facultyInitials || "",
        room: selectedLecture.room || "",
        group: selectedLecture.group || "",
      });
    }
  }, [selectedLecture]);

  useEffect(() => {
    setSelectedLectureId("");
    setLectureData({
      subject: "",
      teacher: "",
      room: "",
      group: "",
    });
  }, [selectedDayId, selectedSemesterId, selectedPeriodId]);

  const validateInput = () => {
    const { subject, teacher, room, group } = lectureData;
    if (!validationGroup.includes(group.trim())) {
      alert("❌ Please enter a valid group (e.g., B1)");
      return false;
    }
    if (!validationCourse.includes(subject.trim())) {
      alert("❌ Please enter a valid courseCode (e.g., CS4001)");
      return false;
    }
    if (!validationTeacher.includes(teacher.trim())) {
      alert("❌ Please enter a valid teacher code (e.g., KKA)");
      return false;
    }
    if (!validationRoom.includes(room.trim())) {
      alert("❌ Please enter a valid room (e.g., A107)");
      return false;
    }
    return true;
  };

  const handlePeriodUpdate = async () => {
    if (!selectedLectureId || !validateInput()) return;
    try {
      await UpdateLecture(selectedLectureId, {
        courseCode: lectureData.subject,
        facultyInitials: lectureData.teacher,
        room: lectureData.room,
        group: lectureData.group,
      });
      alert("Lecture updated");
      navigate(0);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handlePeriodDelete = async () => {
    if (!selectedLectureId || !selectedPeriod?.periodId || !validateInput()) return;
    try {
      await removelecture(selectedPeriod.periodId, selectedLectureId);
      alert("Lecture deleted");
      navigate(0);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow text-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Semester Schedule Editor</h2>

      <div className="mb-4">
        <label className="block mb-1">Select Semester</label>
        <select
          value={selectedSemesterId}
          onChange={(e) => {
            setSelectedSemesterId(e.target.value);
            setSelectedDayId("");
            setSelectedPeriodId("");
          }}
          className="w-full p-2 rounded bg-white text-black"
        >
          <option value="">Select a semester</option>
          {allSemesters.map((s) => (
            <option key={s._id} value={s._id}>
              {s.semester}
            </option>
          ))}
        </select>
      </div>

      {days.length === 0 && (
        <p className="text-center text-gray-300 italic mt-4">
          No day schedules found. Please add days to your semesters.
        </p>
      )}

      {days.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1">Select Day</label>
          <select
            value={selectedDayId}
            onChange={(e) => {
              setSelectedDayId(e.target.value);
              setSelectedPeriodId("");
            }}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Select Day</option>
            {days.map((d) => (
              <option key={d.dayId} value={d.dayId}>
                {d.dayName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDaySchedule?.periods?.length === 0 && (
        <p className="text-center text-gray-300 italic mt-4">
          No periods scheduled for this day.
        </p>
      )}

      {dayPeriods.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1">Select Period</label>
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Select Period</option>
            {dayPeriods.map((p) => (
              <option key={p.periodId} value={p.periodId}>
                {p.period} ({p.startTime} - {p.endTime})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedPeriod?.lectures?.length === 0 && (
        <p className="text-center text-gray-400 italic mt-4">
           No lectures added for this period.
        </p>
      )}

      {selectedPeriod?.lectures?.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1">Select Lecture</label>
          <select
            value={selectedLectureId}
            onChange={(e) => setSelectedLectureId(e.target.value)}
            className="w-full p-2 rounded bg-white text-black"
          >
            <option value="">Select Lecture</option>
            {selectedPeriod.lectures.map((lecture) => (
              <option key={lecture._id} value={lecture._id}>
                {lecture.group} | {lecture.courseCode} | {lecture.facultyInitials}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedLecture && (
        <div className="bg-white text-black p-6 rounded mt-6">
          <h3 className="text-xl font-semibold mb-4">Edit Lecture</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["subject", "teacher", "room", "group"].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={lectureData[field]}
                  onChange={(e) =>
                    setLectureData((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded"
                />
                {field === "subject" && lectureData.subject && !validationCourse.includes(lectureData.subject.trim()) && (
                  <p className="text-red-500 text-sm mt-1">Invalid course code</p>
                )}
                {field === "teacher" && lectureData.teacher && !validationTeacher.includes(lectureData.teacher.trim()) && (
                  <p className="text-red-500 text-sm mt-1">Invalid teacher code</p>
                )}
                {field === "room" && lectureData.room && !validationRoom.includes(lectureData.room.trim()) && (
                  <p className="text-red-500 text-sm mt-1">Invalid room name</p>
                )}
                {field === "group" && lectureData.group && !validationGroup.includes(lectureData.group.trim()) && (
                  <p className="text-red-500 text-sm mt-1">Invalid group</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={handlePeriodUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              Update
            </button>
            <button
              onClick={handlePeriodDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterScheduler;
