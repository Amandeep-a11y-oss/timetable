import express from "express";
import {
	login,
	logout,
	signup,
	checkAuth,
	timefunction,
	gettimetable,
	addsemesters,
	addschedule,
	addperiod,
	addlecture,
	removesemester,
	deleteSchedule,
	removeperiod,
	removelecture,
	UpdateTimetable,
	UpdatesemesterSchedule,
	updateSchedule,
	Updaeperiod,
	UpdateLecture,
	todayperiods,
	getbyid,
	getDepartment,
	getDepartmentbyId,
	DepartmentbyId,
	getSemesterSchedule,
} from "../controllers/auth.controller.js";
import { 
	CreateRoom, 
	CreateCourse, 
	CreateTeacher, 
	CreateGroup,  
	ReadRoom, 
	ReadCourse, 
	ReadTeacher, 
	ReadGroup,
	UpdateRoom,
	UpdateCourse,
	UpdateTeacher,
	UpdateGroup,
	DeleteRoom,
	DeleteCourse,
	DeleteTeacher,
	DeleteGroup  } from "../controllers/utils.controller.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();

router.get("/check-auth", isAuthenticated, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/time", timefunction);
router.post("/add-semesters", addsemesters);
router.post("/semester/add-schedule" , addschedule);
router.post("/schedule/add-period", addperiod);
router.post("/periods/add-lecture", addlecture);

router.delete("/timetable/remove-semester", removesemester);
router.delete("/semester/remove-schedule/:id", deleteSchedule);
router.delete("/schedule/remove-period", removeperiod); 
router.delete("/period/remove-lecture", removelecture);  

router.put("/:id/", UpdateTimetable)
router.put("/semester-Schedule/:id", UpdatesemesterSchedule );
router.put("/schedule/:id",updateSchedule );  
router.put("/period/:id", Updaeperiod); 
router.put("/Lecture/:id", UpdateLecture);  

router.get("/get-timetable", gettimetable);
router.get("/today-periods", todayperiods);
router.get("/getbyid/:id", getbyid);

router.get("/get-Department", getDepartment);
router.get("/get-Department/:id", getDepartmentbyId);
router.get("/Department/:id", DepartmentbyId);

router.post("/room", CreateRoom);
router.post("/course", CreateCourse);
router.post("/teacher", CreateTeacher);
router.post("/group", CreateGroup);

router.get("/get-room", ReadRoom);
router.get("/get-course", ReadCourse);
router.get("/get-teacher", ReadTeacher);
router.get("/get-group", ReadGroup);

router.put("/edit-room/:id", UpdateRoom);
router.put("/edit-course/:id", UpdateCourse);
router.put("/edit-teacher/:id", UpdateTeacher);
router.put("/edit-group/:id", UpdateGroup);

router.delete("/delete-room/:id", DeleteRoom);
router.delete("/delete-course/:id", DeleteCourse);
router.delete("/delete-teacher/:id", DeleteTeacher);
router.delete("/delete-group/:id", DeleteGroup);

router.get("/semester/:id/schedules", getSemesterSchedule); 

export default router;
