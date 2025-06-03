import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    teacherCode: String,
    teacherName: String
});

const Teacher = mongoose.model("teacher", teacherSchema);


const courseSchema = new mongoose.Schema({
    courseCode: String,
    courseName: String
});

const Course = mongoose.model("course", courseSchema);

const groupSchema = new mongoose.Schema({
    groupName: String
});

const Group = mongoose.model("group", groupSchema);

const roomSchema = new mongoose.Schema({
    roomName: String
});

const Room = mongoose.model("room", roomSchema);

export { Teacher, Course, Group, Room }
