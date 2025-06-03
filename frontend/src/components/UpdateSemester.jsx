import { useState, useEffect } from "react";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import timetableStore from "../store/timetableStore";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function CreateSemester({ departmentById }) {

    const { addsemesters, getDepartmentbyId, users2, error } = timetableStore();

    const [semester, setSEmester] = useState("");
    const navigate = useNavigate();

    const semesterRegex = /^(I{1,3}|IV|V|VI|VII|VIII)\sSemester$/;

    useEffect(() => {
        getDepartmentbyId(departmentById);
    }, [getDepartmentbyId, departmentById]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!semesterRegex.test(semester.trim())) {
            alert("❌ Invalid format. Use 'I Semester', 'II Semester', etc.");
            return;
        }

        try {
            await addsemesters({
                timetableId: departmentById,
                semester: semester,
                schedule: [],
            });
                navigate(0);            

            alert("Semester created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create semester.");
        }
    };

    if (!departmentById) {
        return (
            <div className="flex justify-center items-center h-[10vh]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow">
            
            <h2 className="text-2xl font-semibold text-center mb-4 text-white">
                Create a Semester
            </h2>

            <h3 className="text-white mb-2 ">Department: {users2?.department}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">

                <Input
                    bg="gray.100"
                    color="blue.900"
                    className="P-6"
                    placeholder="Enter Semester..."
                    value={semester}
                    onChange={(e) => setSEmester(e.target.value)}
                    required
                />
                {semester && !semesterRegex.test(semester.trim()) && (
                    <p className="text-red-500 text-sm mt-1">Format should be like "I Semester"</p>
                )}

                <div className="text-center">
                    <Button type="submit" variant="solid" className="w-full bg-blue-600 hover:bg-blue-700">
                        Create Semester
                    </Button>
                </div>
            </form>

        </div>
    );
}
