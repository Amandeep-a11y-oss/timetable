import { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import timetableStore from "../store/timetableStore";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function UpdateSchedule({ semesterArray }) {
  const { addlecture, ReadRoom, ReadGroup, utils, utilsRoom, utilsTeacher, ReadTeacher, utilsCourse, ReadCourse, error, utilsGroup } = timetableStore();

  const [semesterId, setSemesterId] = useState("");
  const [dayId, setDayId] = useState("");
  const [periodId, setPeriodId] = useState("");

  const [group, setGroup] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [facultyInitials, setFacultyInitials] = useState("");
  const [room, setRoom] = useState("");
  const [vaildatioRoom, setVaildatioRoom] = useState([]);
  const [vaildatioGruop, setVaildatioGroup] = useState([]);
  const [vaildatioTeacher, setVaildatioTeacher] = useState([]);
  const [vaildatioCourse, setVaildatioCourse] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ReadRoom();
  }, [ReadRoom]);

  useEffect(() => {
    ReadGroup();
  }, [ReadGroup]);

  useEffect(() => {
    ReadTeacher();
  }, [ReadTeacher]);

  useEffect(() => {
    ReadCourse();
  }, [ReadCourse]);

  useEffect(() => {

    if (utilsGroup?.data?.length) {
      const names = utilsGroup.data
        .filter(room => room.groupName)
        .map(room => room.groupName);
      setVaildatioGroup(names);
    }

  }, [utilsGroup]);

  useEffect(() => {

    if (utilsRoom?.data?.length) {
      const names = utilsRoom.data
        .filter(room => room.roomName)
        .map(room => room.roomName);
      setVaildatioRoom(names);
    }

  }, [utilsRoom]);

  useEffect(() => {
    if (utilsTeacher?.data?.length) {
      const codes = utilsTeacher.data.map(t => t.teacherCode);
      setVaildatioTeacher(codes); 
    }
  }, [utilsTeacher]);


  useEffect(() => {
    if (utilsCourse?.data?.length) {
      const codes = utilsCourse.data.map(course => course.courseCode);
      setVaildatioCourse(codes); 
    }
  }, [utilsCourse]);

  const dayPeriods = semesterArray?.flatMap((sem) =>
    sem.schedule?.flatMap((dayObj) =>
      dayObj.periods?.map((period) => ({
        semesterId: sem._id,
        semesterName: sem.semester,
        dayId: dayObj._id,
        dayName: dayObj.day,
        periodId: period._id,
        periodName: period.period,
      })) || []
    ) || []
  ) || [];

  const filteredDays = [...new Map(
    dayPeriods
      .filter((p) => p.semesterId === semesterId)
      .map((d) => [d.dayId, { dayId: d.dayId, dayName: d.dayName }])
  ).values()];

  const filteredPeriods = dayPeriods.filter((p) => p.dayId === dayId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!periodId || !group || !courseCode || !facultyInitials || !room) {
      alert("Please fill all fields.");
      return;
    }

    if (!vaildatioGruop.includes(group.trim())) {
      alert("❌ Please enter a valid day (e.g., B1, B2 ...)");
      return;
    }

    if (!vaildatioCourse.includes(courseCode.trim())) {
      alert("❌ Please enter a valid courseCode");
      return;
    }

    if (!vaildatioTeacher.includes(facultyInitials.trim())) {
      alert("❌ Please enter a valid teacherCode");
      return;
    }

    if (!vaildatioRoom.includes(room.trim())) {
      alert("❌ Please enter a valid A107");
      return;
    }

    try {
      await addlecture({
        periodId,
        lecture: {
          group,
          courseCode,
          facultyInitials,
          room,
        },
      });

      setGroup("");
      setCourseCode("");
      setFacultyInitials("");
      setRoom("");
      alert("Lecture added successfully!");
        navigate(0);  
    } catch (error) {
      console.error(error);
      alert("Failed to add lecture.");
    }
  };


  if (!semesterArray) {
    return (
      <div className="flex justify-center items-center h-[10vh]">
        <Loader />
      </div>
    );
  }


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-4 text-white">
        Add Lecture
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="w-full">
          <label className="text-white">Select Semester</label>
          <select
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              setDayId("");
              setPeriodId("");
            }}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            required
          >
            <option value="" disabled>Select Semester</option>
            {semesterArray.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semester}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="text-white">Select Day</label>
          <select
            value={dayId}
            onChange={(e) => {
              setDayId(e.target.value);
              setPeriodId("");
            }}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            required
          >
            <option value="" disabled>Select Day</option>
            {filteredDays.map((d) => (
              <option key={d.dayId} value={d.dayId}>
                {d.dayName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="text-white">Select Period</label>
          <select
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            required
          >
            <option value="" disabled>Select Period</option>
            {filteredPeriods.map((p) => (
              <option key={p.periodId} value={p.periodId}>
                {p.periodName}
              </option>
            ))}
          </select>
        </div>

        <Input
          placeholder="Enter Group (e.g., B1, B2)"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          required
        />
        {group && !vaildatioGruop.includes(group.trim()) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid group (e.g., B1)</p>
        )}

        <Input
          placeholder="Enter Course Code (e.g., CS101)"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
        {courseCode && !vaildatioCourse.includes(courseCode.trim()) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid CS4001</p>
        )}

        <Input
          placeholder="Enter Faculty Initials"
          value={facultyInitials}
          onChange={(e) => setFacultyInitials(e.target.value)}
          required
        />
        {facultyInitials && !vaildatioTeacher.includes(facultyInitials.trim()) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid KKA</p>
        )}

        <Input
          placeholder="Enter Room No."
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
        />
        {room && !vaildatioRoom.includes(room.trim()) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid A107</p>
        )}

        <div className="text-center">
          <Button
            type="submit"
            variant="solid"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Lecture
          </Button>
        </div>
      </form>
    </div>
  );
}
