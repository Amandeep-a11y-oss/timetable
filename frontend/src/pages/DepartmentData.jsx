import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import timetableStore from "../store/timetableStore";
import MultipleSelect from "../components/MultipleSelect";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

function DepartmentData() {
    const { id } = useParams();
    const { users1, DepartmentbyId, ReadCourse, utilsCourse, ReadTeacher, utilsTeacher } = timetableStore();

    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [periodFilter, setPeriodFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState("");
    const [groupFilter, setGroupFilter] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [teacherFilter, setTeacherFilter] = useState("");
    const [courseMap, setCourseMap] = useState({});
    const [teacherMap, setTeacherMap] = useState({});

    const navigate = useNavigate();
    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        navigate(`/department123/${id}`, { replace: true });
        DepartmentbyId(id);
    }, [id, DepartmentbyId]);

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

    if (!users1) return <p className="text-white p-4">Loading department...</p>;

    const allRows = [];

    users1.semesters
        .filter((sem) => !selectedSemester || sem.semester === selectedSemester)
        .forEach((sem, i) => {
            sem.schedule?.forEach((day, dayIndex) => {
                if (!selectedDay || day.day === selectedDay) {
                    day.periods?.forEach((period, periodIndex) => {
                        const periodTime = `${period?.startTime || "?"} - ${period?.endTime || "?"}`;

                        period.lectures?.forEach((lecture, lectureIndex) => {
                            const subjectName = courseMap[lecture?.courseCode]
                                ? `${courseMap[lecture.courseCode]} (${lecture.courseCode})`
                                : lecture?.courseCode || "No Subject";

                            const teacherName = teacherMap[lecture?.facultyInitials]
                                ? `${teacherMap[lecture.facultyInitials]} (${lecture.facultyInitials})`
                                : lecture?.facultyInitials || "No Teacher";

                            const passesFilters =
                                (!periodFilter || period?.period === periodFilter) &&
                                (!timeFilter || periodTime === timeFilter) &&
                                (!groupFilter || lecture?.group === groupFilter) &&
                                (!subjectFilter || subjectName === subjectFilter) &&
                                (!teacherFilter || teacherName === teacherFilter);

                            if (passesFilters) {
                                allRows.push({
                                    id: `${i}-${dayIndex}-${periodIndex}-${lectureIndex}`,
                                    semester: sem.semester,
                                    day: day?.day || "N/A",
                                    period: period?.period || "?",
                                    time: periodTime,
                                    group: lecture?.group || "No Group",
                                    subject: subjectName,
                                    teacher: teacherName,
                                    room: lecture?.room || "No Room",
                                });
                            }
                        });
                    });
                }
            });
        });

    const columns = [
        { field: "semester", headerName: "Semester", width: 120 },
        { field: "day", headerName: "Day", width: 100 },
        { field: "period", headerName: "Period", width: 100 },
        { field: "time", headerName: "Time", width: 160 },
        { field: "group", headerName: "Group", width: 100 },
        { field: "subject", headerName: "Subject", width: 220 },
        { field: "teacher", headerName: "Teacher", width: 220 },
        { field: "room", headerName: "Room", width: 120 },
    ];

    return (
        <div className="p-2 text-white">
            <div className="text-center text-white">
                <p className="text-lg">
                    <span className="font-semibold text-white">Department Name:</span> {users1?.department}
                </p>
            </div>

            <div className="mb-2 mt-4">

                <div className="flex gap-4 flex-wrap">
                    <MultipleSelect label="Select Semester" options={users1.semesters.map((s) => s.semester)} value={selectedSemester} onChange={setSelectedSemester} />
                    <MultipleSelect label="Select Day" options={dayOptions} value={selectedDay} onChange={setSelectedDay} />
                    <MultipleSelect label="Filter by Period" options={[...new Set(users1.semesters.flatMap(s => s.schedule?.flatMap(d => d.periods?.map(p => p.period || "?")) || []))]} value={periodFilter} onChange={setPeriodFilter} />
                    <MultipleSelect label="Filter by Group" options={[...new Set(users1.semesters.flatMap(s => s.schedule?.flatMap(d => d.periods?.flatMap(p => p.lectures?.map(l => l.group || "No Group"))) || []))]} value={groupFilter} onChange={setGroupFilter} />
                    <MultipleSelect label="Filter by Subject" options={[...new Set(users1.semesters.flatMap(s => s.schedule?.flatMap(d => d.periods?.flatMap(p => p.lectures?.map(l => courseMap[l.courseCode] ? `${courseMap[l.courseCode]} (${l.courseCode})` : l.courseCode || "No Subject")) || [])) || [])]} value={subjectFilter} onChange={setSubjectFilter} />
                    <MultipleSelect label="Filter by Teacher" options={[...new Set(users1.semesters.flatMap(s => s.schedule?.flatMap(d => d.periods?.flatMap(p => p.lectures?.map(l => teacherMap[l.facultyInitials] ? `${teacherMap[l.facultyInitials]} (${l.facultyInitials})` : l.facultyInitials || "No Teacher")) || [])) || [])]} value={teacherFilter} onChange={setTeacherFilter} />
                </div>
            </div>

            <Paper sx={{ height: 700, width: "100%" }}>
                <DataGrid
                    rows={allRows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 20 } } }}
                    pageSizeOptions={[20, 30, 40]}
                    checkboxSelection
                    sx={{
                        border: 0,
                        color: "black",
                        ".MuiDataGrid-cell": { color: "black" },
                        ".MuiDataGrid-columnHeaders": { backgroundColor: "#1f2937", color: "black" },
                        ".MuiDataGrid-footerContainer": { backgroundColor: "#ffffff", color: "black" },
                    }}
                />
            </Paper>
        </div>
    );
}

export default DepartmentData;
