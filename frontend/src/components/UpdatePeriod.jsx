import { useState } from "react";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import timetableStore from "../store/timetableStore";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function UpdateSchedule({ semesterArray }) {

  const { addperiod, error } = timetableStore();

  const [semesterId, setSemesterId] = useState("");
  const [dayId, setDayId] = useState("");
  const [period, setPeriod] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const periodRegex = /^(I{1,3}|IV|V|VI|Lunch)$/i;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; 

  const days = semesterArray?.flatMap(sem =>
    sem.schedule?.map(dayObj => ({
      semesterId: sem._id,
      semesterName: sem.semester,
      dayId: dayObj._id,
      dayName: dayObj.day
    }))
  );

  const filteredDays = days?.filter(d => d.semesterId === semesterId);


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!periodRegex.test(period.trim())) {
      alert("Enter valid period: I, II, III, IV, V, VI, Lunch");
      return;
    }

    if (!timeRegex.test(startTime.trim())) {
      alert("Start time must be in HH:MM (24-hour) format");
      return;
    }

    if (!timeRegex.test(endTime.trim())) {
      alert("End time must be in HH:MM (24-hour) format");
      return;
    }

    try {
      await addperiod({
        dailyScheduleId: dayId,
        newPeriod: {
          period: period,
          startTime: startTime,
          endTime: endTime,
          lectures: [
          ]
        }
      });
      alert("Schedule added successfully!");
        navigate(0);
    } catch (error) {
      console.error(error);
      alert("Failed to add schedule.");
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
        Create a Period
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="w-full">
          <label className="text-white">Select Semester</label>
          <select
            value={semesterId}
            onChange={(e) => {
              setSemesterId(e.target.value);
              setDayId(""); 
            }}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            required
          >
            <option value="" disabled>Select Semester</option>
            {semesterArray?.map((sem) => (
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
            onChange={(e) => setDayId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white text-black"
            required
          >
            <option value="" disabled>Select Day</option>
            {filteredDays?.map((d) => (
              <option key={d.dayId} value={d.dayId}>
                {d.dayName}
              </option>
            ))}
          </select>
        </div>

        <Input
          bg="gray.100"
          color="blue.900"
          className="P-6"
          placeholder="Enter Period.."
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          required
        />
        {period && !periodRegex.test(period.trim()) && (
          <p className="text-red-500 text-sm mt-1">Enter valid period: I, II, III, IV, V, VI, Lunch</p>
        )}

        <Input
          bg="gray.100"
          color="blue.900"
          className="P-6"
          placeholder="Enter StartTime..."
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        {startTime && !timeRegex.test(startTime.trim()) && (
          <p className="text-red-500 text-sm mt-1">Start time must be in HH:MM (24-hour) format</p>
        )}

        <Input
          bg="gray.100"
          color="blue.900"
          className="P-6"
          placeholder="Enter EndTime..."
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        {endTime && !timeRegex.test(endTime.trim()) && (
          <p className="text-red-500 text-sm mt-1">End time must be in HH:MM (24-hour) format</p>
        )}

        <div className="text-center">
          <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
            Create Period
          </Button>
        </div>
      </form>
    </div>
  );
}



