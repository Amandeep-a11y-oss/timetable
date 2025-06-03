import React, { useState } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import timetableStore from "../store/timetableStore";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";



function CreateDepartment() {

  const { timefunction, error } = timetableStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: '',
    academicYear: '',
    effectiveFrom: dayjs(),
    semesters: [],
  });

  const handleChange = (path, value) => {
    const keys = path.split('.');
    const newFormData = { ...formData };
    let current = newFormData;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const nextKey = keys[i + 1];

      if (!isNaN(key)) {
        const index = parseInt(key);
        if (!Array.isArray(current)) return;
        if (!current[index]) {
          current[index] = isNaN(nextKey) ? {} : [];
        }
        current = current[index];
      } else {
        if (!current[key]) {
          current[key] = isNaN(nextKey) ? {} : [];
        }
        current = current[key];
      }
    }

    const finalKey = keys[keys.length - 1];
    if (!isNaN(finalKey)) {
      const index = parseInt(finalKey);
      if (!Array.isArray(current)) return;
      current[index] = value;
    } else {
      current[finalKey] = value;
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        effectiveFrom: formData.effectiveFrom.format("YYYY-MM-DD"),
      };
      await timefunction(payload);
      alert('Timetable submitted successfully!');
        navigate(0);
    } catch (error) {
      console.error(error);
      alert('Failed to submit timetable');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-4 text-black">Create a Department</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">


          <Input
            w="90%"
            bg="gray.100"
            color="blue.900"
            placeholder="Enter Department..."
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            required
          />


          <Input
            w="90%"
            bg="gray.100"
            color="blue.900"
            value={formData.academicYear}
            onChange={(e) => handleChange('academicYear', e.target.value)}
            placeholder="Enter Academic Year..."
            variant="solid"
            required
          />
        </div>

        <div className="w-full">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                label="Effective From"
                value={formData.effectiveFrom}
                onChange={(newDate) => handleChange('effectiveFrom', newDate)}
                sx={{ width: '100%', backgroundColor: 'white', borderRadius: '5px' }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div className="text-center">
          <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
            Create Department
          </Button>
        </div>
      </form>
    </>
  )
}


export default CreateDepartment;