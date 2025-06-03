import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useNavigate } from "react-router-dom";
import timetableStore from "../store/timetableStore";

function Course() {
  const {
    CreateCourse,
    ReadCourse,
    UpdateCourse,
    DeleteCourse,
    error,
    utilsCourse
  } = timetableStore();

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    ReadCourse();
  }, [ReadCourse]);

  const handleEditCourse = (course) => {
    setCourseCode(course.courseCode);
    setCourseName(course.courseName);
    setEditingId(course._id);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await DeleteCourse(id);
      await ReadCourse(); 
    } catch (error) {
      console.error("Failed to delete course", error);
      alert("Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await UpdateCourse(editingId, { courseCode, courseName });
        alert("Course updated successfully!");
      } else {
        await CreateCourse({ courseCode, courseName });
        alert("Course created successfully!");
      }

      setCourseCode("");
      setCourseName("");
      setEditingId(null);
      navigate(0); 
    } catch (error) {
      console.error(error);
      alert("Failed to submit course");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-4 text-black">
        {editingId ? "Edit Course" : "Create a Course"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Enter course code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
        <p className="text-red-500">{error}</p>

        <Input
          placeholder="Enter course name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
        />

        <div className="text-center">
          <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
            {editingId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>

      <div className="max-h-48 overflow-y-auto mt-4">
        <h3 className="text-black mb-2">Course List</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-800 mt-4">
          {utilsCourse.data?.map((course) => (
            <li
              key={course._id}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-gray-800 font-medium">
                {course.courseCode} — {course.courseName}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Course;
