import { useState, useEffect } from "react";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import timetableStore from "../store/timetableStore";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";


export default function UpdateSchedule({ semesterArray }) {

    const { addschedule, error } = timetableStore();

    const [name, setName] = useState("");
    const [day, setDay] = useState("");
    const navigate = useNavigate();

    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validDays.includes(day.trim())) {
            alert("❌ Please enter a valid day (e.g., Monday, Tuesday...)");
            return;
        }

        try {
            await addschedule({
                semesterScheduleId: name,
                newSchedule: {
                    day: day,
                    periods: [],
                },
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
                Create a Day
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="w-full">
                    <select
                        id="department-select"
                        name="department"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white text-black"
                        required
                    >
                        <option value="" disabled>
                            Select Department
                        </option>
                        {semesterArray?.map((val) => (
                            <option key={val._id} value={val._id}>
                                {val.semester}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    bg="gray.100"
                    color="blue.900"
                    className="P-6"
                    placeholder="Enter Day..."
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                />
                {day && !validDays.includes(day.trim()) && (
                    <p className="text-red-500 text-sm mt-1">Enter a valid weekday (e.g., Monday)</p>
                )}

                <div className="text-center">
                    <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create Day
                    </Button>
                </div>

            </form>

        </div>
    );
}

