import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api/auth" : "/api/auth";

const useUserStore = create((set) => ({

  users: [],
  timetables: [],
  user1: null,
  users2: [],
  today: null,
  loading: false,
  error: null,
  scheduledata: [],
  utils: [],
  utilsRoom: [],
  utilsTeacher: [],
  utilsCourse: [],
  utilsGroup: [],
  remove: null,
  teachers: [],
  utilsRoom: {
    data: [],
  },
  courses: [],
  utilsGroup: {
    data: [],
  },

  fetchUsers: async () => {

    set({ loading: true, error: null });

    try {
      const res = await axios.get(`${API_URL}/get-timetable`);
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }

  },

  getDepartment: async () => {
    try {
      const res = await axios.get(`${API_URL}/get-Department`);
      set({ users: res.data, loading: false });
    } catch {
      set({ error: err.message, loading: false });

    }
  },

  getDepartmentbyId: async (id) => {

    set({ loading: true });

    try {
      const res = await axios.get(`${API_URL}/get-Department/${id}`);
      set({ users2: res.data, loading: false }); 
    } catch (err) {
      set({ error: err.message, loading: false });

    }
  },

  DepartmentbyId: async (id) => {

    set({ loading: true });

    try {
      const res = await axios.get(`${API_URL}/get-Department/${id}`);
      set({ users1: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });

    }
  },

  todayperiods: async () => {
    try {
      const res = await axios.get(`${API_URL}/today-periods`);
      set({ today: res.data, loading: false });
    } catch {
      set({ error: err.message, loading: false });
    }
  },

  timefunction: async ({ department, academicYear, effectiveFrom, semesters }) => {
    try {
      const res = await axios.post(`${API_URL}/time`, { department, academicYear, effectiveFrom, semesters });
      set({ users1: res.data, loading: false });
    } catch (err) {
      console.error("Frontend error submitting timetable:", err);
      const isConflict = err.response && err.response.status === 409;
      const message = isConflict
        ? "Timetable already exists for this department and academic year."
        : err.response?.data?.error || "Failed to create timetable";

      set({ error: message, loading: false });
    }
  },

  addsemesters: async ({ timetableId, semester, schedule }) => {
    try {
      const res = await axios.post(`${API_URL}/add-semesters`, { timetableId, semester, schedule });
      set({ users2: res.data, loading: false });
    } catch (err) {
      const isConflict = err.response && err.response.status === 409;
      set({
        error: isConflict ? "Timetable already exists for this semester." : err.message,
        loading: false,
      });
    }
  },

  addschedule: async ({ semesterScheduleId, newSchedule }) => {
    try {
      const res = await axios.post(`${API_URL}/semester/add-schedule`, { semesterScheduleId, newSchedule })
      set({ users1: res.data, loading: false });
    } catch (err) {
      const isConflict = err.response && err.response.status === 409;
      set({
        error: isConflict ? "Timetable already exists for this schedule." : err.message,
        loading: false,
      });
    }
  },

  addperiod: async ({ dailyScheduleId, newPeriod }) => {
    try {
      const res = await axios.post(`${API_URL}/schedule/add-period`, { dailyScheduleId, newPeriod });
      set({ users1: res.data, loading: false });
    } catch (err) {
      const isConflict = err.response && err.response.status === 409;
      set({
        error: isConflict ? "Timetable already exists for this schedule." : err.message,
        loading: false,
      });
    }
  },

  addlecture: async ({ periodId, lecture }) => {
    try {
      const res = await axios.post(`${API_URL}/periods/add-lecture`, { periodId, lecture })
      set({ users1: res.data, loading: false });
    } catch (err) {
      const isConflict = err.response && err.response.status === 409;
      set({
        error: isConflict ? "Timetable already exists for this lecture." : err.message,
        loading: false,
      });
    }
  },

  CreateRoom: async ({ roomName }) => {
    try {
      const res = await axios.post(`${API_URL}/room`, { roomName });
      set({ utils: res.data, loading: false });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: message, loading: false });
      throw new Error(message); 
    }
  },

  CreateCourse: async ({ courseCode, courseName }) => {
    try {
      const res = await axios.post(`${API_URL}/course`, { courseCode, courseName });
      set({ utils: res.data, loading: false });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: message, loading: false });
      throw new Error(message); 
    }
  },

  CreateTeacher: async ({ teacherCode, teacherName }) => {
    try {
      const res = await axios.post(`${API_URL}/teacher`, { teacherCode, teacherName });
      set({ utils: res.data, loading: false });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: message, loading: false });
      throw new Error(message); 
    }
  },

  CreateGroup: async ({ groupName }) => {
    try {
      const res = await axios.post(`${API_URL}/group`, { groupName });
      set({ utils: res.data, loading: false });
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: message, loading: false });
      throw new Error(message); 
    }
  },

  ReadRoom: async () => {
    try {
      const res = await axios.get(`${API_URL}/get-room`);
      set({ utilsRoom: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  ReadCourse: async () => {
    try {
      const res = await axios.get(`${API_URL}/get-course`);
      set({ utilsCourse: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  ReadTeacher: async () => {
    try {
      const res = await axios.get(`${API_URL}/get-teacher`);
      set({ utilsTeacher: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  ReadGroup: async () => {
    try {
      const res = await axios.get(`${API_URL}/get-group`);
      set({ utilsGroup: res.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  removesemester: async ({ timetableId, semesterId }) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${API_URL}/timetable/remove-semester`, {
        data: { timetableId, semesterId },
      });
      const refreshed = await axios.get(`${API_URL}/timetable`);
      set({ timetables: refreshed.data, loading: false });
    } catch (err) {
      console.error("Remove semester error:", err.response?.data || err.message);
      set({ error: err.message, loading: false });
    }
  },

  getTimetables: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/get-timetable`);
      set({ timetables: res.data, loading: false });
    } catch (err) {
      console.error("Error fetching timetable:", err);
      set({ error: err.message, loading: false });
    }
  },

  updatesemesterSchedule: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${API_URL}/semester-schedule/${id}`, data);
      set({ loading: false });
      return res.data;
    } catch (err) {
      console.error("Update semester error:", err.response?.data || err.message);
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  getSemesterSchedule: async (id) => {
    try {
      const res = await axios.get(`${API_URL}/semester/${id}/schedules`);
      return res.data;
    } catch (err) {
      console.error("Error fetching schedules:", err);
      throw err;
    }
  },

  updateSchedule: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`${API_URL}/schedule/${id}`, data);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.delete(`${API_URL}/semester/remove-schedule/${id}`);
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
  removeperiod: async (scheduleId, periodId) => {
    try {
      await axios.delete(`${API_URL}/schedule/remove-period`, {
        data: { scheduleId, periodId },
      });
    } catch (err) {
      console.error("Failed to delete period", err);
      throw err;
    }
  },

  Updaeperiod: async (periodId, data) => {
    try {
      await axios.put(`${API_URL}/period/${periodId}`, data);
    } catch (err) {
      console.error("Failed to update period", err);
      throw err;
    }
  },

  removelecture: async (periodId, lectureId) => {
    try {
      await axios.delete(`${API_URL}/period/remove-lecture`, {
        data: { periodId, lectureId },
      });
    } catch (err) {
      console.error("Failed to delete lecture", err);
      throw err;
    }
  },

  UpdateLecture: async (lectureId, data) => {
    try {
      await axios.put(`${API_URL}/Lecture/${lectureId}`, data);
    } catch (err) {
      console.error("Failed to update lecture", err);
      throw err;
    }
  },

  UpdateTeacher: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_URL}/edit-teacher/${id}`, updatedData);
      const updatedTeacher = res.data;

      const teachers = get().teachers.map(t =>
        t._id === id ? updatedTeacher : t
      );

      set({ teachers, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  DeleteTeacher: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/delete-teacher/${id}`);

      const teachers = get().teachers.filter(t => t._id !== id);
      set({ teachers, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  UpdateCourse: async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/edit-course/${id}`, data);
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === id ? res.data : course
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update course' });
    }
  },

  DeleteCourse: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-course/${id}`);
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== id),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete course' });
    }
  },

  UpdateGroup: async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/edit-group/${id}`, updatedData);
      set((state) => ({
        utilsGroup: {
          data: state.utilsGroup.data.map((group) =>
            group._id === id ? res.data : group
          ),
        },
        error: null,
      }));
    } catch (err) {
      set({ error: 'Failed to update group' });
    }
  },

  DeleteGroup: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-group/${id}`);
      set((state) => ({
        utilsGroup: {
          data: state.utilsGroup.data.filter((group) => group._id !== id),
        },
        error: null,
      }));
    } catch (err) {
      set({ error: 'Failed to delete group' });
    }
  },

  UpdateRoom: async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/edit-room/${id}`, updatedData);
      set((state) => ({
        utilsRoom: {
          data: state.utilsRoom.data.map((room) =>
            room._id === id ? res.data : room
          ),
        },
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to update room' });
    }
  },

  DeleteRoom: async (id) => {
    try {
      await axios.delete(`${API_URL}/delete-room/${id}`);
      set((state) => ({
        utilsRoom: {
          data: state.utilsRoom.data.filter((room) => room._id !== id),
        },
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to delete room' });
    }
  },

}));

export default useUserStore;
