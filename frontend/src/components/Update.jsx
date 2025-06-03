import React, { useState, useEffect } from 'react';
import CreateDepartment from "../components/CreateDepartment";
import UpdateSemester from "../components/UpdateSemester";
import UpdateSchedule from "../components/UpdateSchedule";
import timetableStore from "../store/timetableStore";
import UpdatePeriod from "../components/UpdatePeriod"
import UpdateLecture from "../components/UpdateLecture";
import DeletePage from "../pages/DeletePage"
import SemesterSelector from "../components/SemesterSelector";
import SemesterScheduler from "../components/SemesterScheduler ";
import PeriodLecture from "../components/PeriodLecture";
import Room from "../components/Room";
import Teacher from "../components/Teacher";
import Course from "../components/Course";
import Group from "../components/Group"
import { Link } from "react-router-dom";


function TimetableForm() {

  const { getDepartment, users, getDepartmentbyId, users2 } = timetableStore();
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenRoom, setIsModalOpenRoom] = useState(false);
  const [isModalOpenTeacher, setIsModalOpenTeacher] = useState(false);
  const [isModalOpenCourse, setIsModalOpenCourse] = useState(false);
  const [isModalOpenGroup, setIsModalOpenGroup] = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPeroidModalOpen, setIsPeroidModalOpen] = useState(false);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [isSemesterDelete, setIsSemesterDelete] = useState(false);
  const [isSemesterSelector, setIsSemesterSelector] = useState(false);
  const [isSemesterScheduler, setIsSemesterScheduler] = useState(false);
  const [isPeriodLecture, setIsPeriodLecture] = useState("");

  useEffect(() => {
    getDepartment();
    getDepartmentbyId(selectedDeptId)
  }, [getDepartment, getDepartmentbyId, selectedDeptId]);

  const handleDepartmentCreated = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h2 className="text-white text-center text-3xl font-bold my-6">Create and Update Timetable</h2>

      <div className='flex gap-4 justify-center' >

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Create a New Department
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              <CreateDepartment onCreated={handleDepartmentCreated} />

            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenRoom(true)}
          >
            Create a New Room
          </button>
        </div>

        {isModalOpenRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setIsModalOpenRoom(false)}
              >
                &times;
              </button>
              <Room onCreated={handleDepartmentCreated} />

            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenTeacher(true)}
          >
            Create a New Teacher
          </button>
        </div>

        {isModalOpenTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setIsModalOpenTeacher(false)}
              >
                &times;
              </button>
              <Teacher onCreated={handleDepartmentCreated} />

            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenCourse(true)}
          >
            Create a New Course
          </button>
        </div>

        {isModalOpenCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setIsModalOpenCourse(false)}
              >
                &times;
              </button>
              <Course onCreated={handleDepartmentCreated} />

            </div>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => setIsModalOpenGroup(true)}
          >
            Create a New Group
          </button>
        </div>

        {isModalOpenGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                onClick={() => setIsModalOpenGroup(false)}
              >
                &times;
              </button>
              <Group onCreated={handleDepartmentCreated} />

            </div>
          </div>
        )}

      </div>

      <div className="flex flex-wrap justify-center gap-6 px-6 mb-6">
        <div className="bg-sky-100 p-6 rounded-lg shadow w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4 text-black">All Departments</h2>
          <ul className="space-y-3">
            {users.map((dept) => (
              <li key={dept._id} className='text-center'>
                <button
                  onClick={() => setSelectedDeptId(dept._id)}
                  className="text-lg font-bold mb-4 p-4 rounded-xl text-white hover:underline w-full bg-blue-600 hover:bg-blue-700"
                >
                  {dept.department}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {users2 && selectedDeptId && (

          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-6xl w-full relative">
              <button
                className="absolute top-2 right-3 text-3xl font-bold text-red-400 hover:text-red-600"
                onClick={() => setSelectedDeptId("")}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Manage Timetable for: {users2.department}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsSemesterModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Create Semesters
                  </button>

                  {isSemesterModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsSemesterModalOpen(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Create Semesters</h3>
                        <UpdateSemester departmentById={users2._id} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Create Schedule
                  </button>

                  {isScheduleModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsScheduleModalOpen(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Create Schedule</h3>
                        <UpdateSchedule semesterArray={users2?.semesters} />                                </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsPeroidModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Create Period
                  </button>

                  {isPeroidModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsPeroidModalOpen(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Create Period</h3>
                        <UpdatePeriod semesterArray={users2?.semesters} />                              </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsLectureModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Create Lecture
                  </button>

                  {isLectureModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsLectureModalOpen(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Create Lecture</h3>
                        <UpdateLecture semesterArray={users2?.semesters} />
                      </div>

                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsSemesterDelete(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Update + Delete Semesters
                  </button>

                  {isSemesterDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsSemesterDelete(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Update + Delete Semesters</h3>
                        <DeletePage users={users2?._id} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsSemesterSelector(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Update + Delete Day
                  </button>

                  {isSemesterSelector && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsSemesterSelector(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Update + Delete Day</h3>
                        <SemesterSelector semesterArray={users2?.semesters} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsSemesterScheduler(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Update + Delete Period
                  </button>

                  {isSemesterScheduler && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsSemesterScheduler(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Update + Delete Period</h3>
                        <SemesterScheduler users={users2} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg shadow">
                  <button
                    onClick={() => setIsPeriodLecture(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                  >
                    Update + Delete Leutuce
                  </button>

                  {isPeriodLecture && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative">
                        <button
                          className="absolute top-2 right-2 text-gray-600 text-xl hover:text-red-600"
                          onClick={() => setIsPeriodLecture(false)}
                        >
                          &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 text-black">Update + Delete Leutuce</h3>
                        <PeriodLecture users={users2} />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

    </>
  );
}

export default TimetableForm;
