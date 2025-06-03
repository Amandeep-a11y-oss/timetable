import React, { useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import { useNavigate } from 'react-router-dom';
import timetableStore from '../store/timetableStore';

function Teacher() {
  const {
    CreateTeacher,
    ReadTeacher,
    DeleteTeacher,
    UpdateTeacher,
    error,
    utilsTeacher,
  } = timetableStore();

  const [teacherCode, setTeacherCode] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    ReadTeacher();
  }, []);

  const handleEditTeacher = (teacher) => {
    setTeacherCode(teacher.teacherCode);
    setTeacherName(teacher.teacherName);
    setEditingId(teacher._id);
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await DeleteTeacher(id);
      await ReadTeacher(); 
    } catch (err) {
      console.error('Failed to delete teacher', err);
      alert('Failed to delete teacher');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await UpdateTeacher(editingId, { teacherCode, teacherName });
        alert('Teacher updated successfully!');
      } else {
        await CreateTeacher({ teacherCode, teacherName });
        alert('Teacher created successfully!');
      }

      setTeacherCode('');
      setTeacherName('');
      setEditingId(null);
      await ReadTeacher();
      navigate(0);
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit teacher');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-4 text-black">
        {editingId ? 'Edit Teacher' : 'Create a Teacher'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <Input
          placeholder="Enter teacher code"
          value={teacherCode}
          onChange={(e) => setTeacherCode(e.target.value)}
          required
        />

        <Input
          placeholder="Enter teacher name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
          required
        />

        <div className="text-center">
          <Button
            type="submit"
            variant="solid"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {editingId ? 'Update Teacher' : 'Create Teacher'}
          </Button>
        </div>
      </form>

      <div className="max-h-64 overflow-y-auto mt-8">
        <h3 className="text-black mb-2">Teacher List</h3>
        <ul className="space-y-2">
          {utilsTeacher.data?.map((teacher) => (
            <li
              key={teacher._id}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded shadow-sm"
            >
              <span className="text-gray-800 font-medium">
                {teacher.teacherCode} — {teacher.teacherName}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditTeacher(teacher)}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher._id)}
                  className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Teacher;
