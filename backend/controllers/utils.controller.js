import { Teacher, Course, Group, Room } from "../models/utils.model.js";

export const CreateRoom = async (req, res) => {
    try {
        const { roomName } = req.body;

        const existingRoom = await Room.findOne({ roomName });
        if (existingRoom) {
            return res.status(409).json({ message: "Room already exists", data: existingRoom });
        }

        const room = await Room.create({ roomName });
        res.status(201).json({ message: "Room created", data: room });
    } catch (error) {
        res.status(500).json({ message: "Failed to create room", error: error.message });
    }
}

export const CreateCourse = async (req, res) => {
    try {
        const { courseCode, courseName } = req.body;

        const existingRoom = await Course.findOne({ courseCode });
        if (existingRoom) {
            return res.status(409).json({ message: "Course already exists", data: existingRoom });
        }

        const course = await Course.create({ courseCode, courseName });
        res.status(201).json({ message: "Course created", data: course });
    } catch (error) {
        res.status(500).json({ message: "Failed to create course", error: error.message });
    }
}

export const CreateTeacher = async (req, res) => {
    try {
        const { teacherCode, teacherName } = req.body;

         const existingRoom = await Teacher.findOne({ teacherCode });
        if (existingRoom) {
            return res.status(409).json({ message: "Teacher already exists", data: existingRoom });
        }

        const teacher = await Teacher.create({ teacherCode, teacherName });
        res.status(201).json({ message: "Teacher created", data: teacher });
    } catch (error) {
        res.status(500).json({ message: "Failed to create teacher", error: error.message });
    }
}

export const CreateGroup = async (req, res) => {
    try {
        const { groupName } = req.body;

         const existingRoom = await Group.findOne({ groupName });
        if (existingRoom) {
            return res.status(409).json({ message: "Group already exists", data: existingRoom });
        }

        const group = await Group.create({ groupName });
        res.status(201).json({ message: "Group created", data: group });
        
    } catch (error) {
        res.status(500).json({ message: "Failed to create group", error: error.message });
    }
}

export const ReadRoom = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ message: "Rooms fetched", data: rooms });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
    }
}

export const ReadCourse = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ message: "Courses fetched", data: courses });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
}

export const ReadTeacher = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json({ message: "Teachers fetched", data: teachers });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
    }
}

export const ReadGroup = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json({ message: "Groups fetched", data: groups });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch groups", error: error.message });
    }
}

export const UpdateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Teacher not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating teacher", err });
  }
};

export const DeleteTeacher = async (req, res) => {
  try {
    const deleted = await Teacher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting teacher", err });
  }
};

export const UpdateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating course", err });
  }
};

export const DeleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting course", err });
  }
};

export const UpdateGroup = async (req, res) => {
  try {
    const updated = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Group not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating group", err });
  }
};

export const DeleteGroup = async (req, res) => {
  try {
    const deleted = await Group.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Group not found" });
    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting group", err });
  }
};

export const UpdateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating room", err });
  }
};


export const DeleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting room", err });
  }
};