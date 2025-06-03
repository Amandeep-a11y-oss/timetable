import { useEffect, useState } from "react";
import timetableStore from "../store/timetableStore";

function TodayWithTimeFilter() {
  const { todayperiods, today, ReadCourse, utilsCourse, ReadTeacher, utilsTeacher } = timetableStore();

  const [now, setNow] = useState(getCurrentTime());
  const [error, setError] = useState(null);
  const [courseMap, setCourseMap] = useState({});
  const [teacherMap, setTeacherMap] = useState({});


  useEffect(() => {
    ReadCourse();
  }, []);

  useEffect(() => {
    ReadTeacher();
  }, [])

  useEffect(() => {
    if (Array.isArray(utilsCourse?.data)) {
      const course = Object.fromEntries(
        utilsCourse.data.map(course => [course.courseCode, course.courseName])
      );
      setCourseMap(course);
    }
  }, [utilsCourse]);

  useEffect(() => {
    if (Array.isArray(utilsTeacher?.data)) {
      const course = Object.fromEntries(
        utilsTeacher.data.map(course => [course.teacherCode, course.teacherName])
      );
      setTeacherMap(course);
    }
  }, [utilsTeacher]);

  function getCurrentTime() {
    const date = new Date();
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function timeToMinutes(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }

  useEffect(() => {
    todayperiods().catch((err) => {
      setError("Failed to load periods");
      console.error(err);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentTime());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const allPeriods =
    today?.flatMap((semester) =>
      semester.periods?.map((period) => ({
        ...period,
        department: semester.department,
        academicYear: semester.academicYear,
        semester: semester.semester,
        scheduleDay: semester.scheduleDay,
      })) || []
    ) || [];

  const current = allPeriods.filter((p) => {
    const nowMin = timeToMinutes(now);
    const start = timeToMinutes(p.startTime);
    const end = timeToMinutes(p.endTime);
    return nowMin >= start && nowMin < end;
  });

  const groupedByDepartment = current.reduce((acc, period) => {
    const dept = period.department || "Unknown Department";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(period);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-white rounded-xl shadow-md m-4">
      <h2 className="text-xl font-bold mb-2 text-center">Current Periods by Department</h2>
      <h3 className="text-md text-gray-700 mb-4 text-center">Current Time: {now}</h3>

      {error && <p className="text-red-500">{error}</p>}

      {Object.keys(groupedByDepartment).length > 0 ? (
        Object.entries(groupedByDepartment).map(([dept, periods]) => (
          <div key={dept} className="mb-6">
            <h4 className="font-semibold text-lg mb-2">{dept}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-sky-200 text-gray-800">
                  <tr>
                    <th className="px-4 py-2 border">Semester</th>
                    <th className="px-4 py-2 border">Period</th>
                    <th className="px-4 py-2 border">Group</th>
                    <th className="px-4 py-2 border">Start Time</th>
                    <th className="px-4 py-2 border">End Time</th>
                    <th className="px-4 py-2 border">Teacher</th>
                    <th className="px-4 py-2 border">Subject</th>
                    <th className="px-4 py-2 border">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period, idx) =>
                    period.lectures?.map((lec, i) => (
                      <tr key={`${idx}-${i}`} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-2 border">{period.semester || "N/A"}</td>
                        <td className="px-4 py-2 border">
                          {period?.period || period?.name || period?.slot || "Unknown"}
                        </td>
                        <td className="px-4 py-2 border">{lec.group || "No Group"}</td>
                        <td className="px-4 py-2 border">{period.startTime}</td>
                        <td className="px-4 py-2 border">{period.endTime}</td>
                        <td className="px-4 py-2 border">
                          {teacherMap[lec.facultyInitials] || "No Teacher"} ({lec.facultyInitials})
                        </td>
                        <td className="px-4 py-2 border">
                          {courseMap[lec.courseCode] || "No Subject"} ({lec.courseCode})
                        </td>
                        <td className="px-4 py-2 border">
                          {lec.room || "No Room"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No current periods.</p>
      )}
    </div>
  );
}

export default TodayWithTimeFilter;
