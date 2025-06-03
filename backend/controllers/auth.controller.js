import bcryptjs from "bcryptjs";
import crypto from "crypto";
import passport from "passport";
import {
  timetable,
  semesterSchedule,
  dailySchedule,
  period,
  Lecture,
} from "../models/schedule.model.js";

import { User } from "../models/user.model.js";
import exp from "constants";
import { read } from "fs";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    console.log("userAlreadyExists", userAlreadyExists);

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err });

    if (!user)
      return res
        .status(401)
        .json({
          success: false,
          message: info.message || "Invalid credentials",
        });

    req.logIn(user, async (err) => {
      if (err)
        return res.status(500).json({ message: "Login error", error: err });

      try {
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: {
            ...user._doc,
            password: undefined,
          },
        });
      } catch (saveErr) {
        res
          .status(500)
          .json({ message: "Error saving user", error: saveErr.message });
      }
    });
  })(req, res);
};

export const logout = async (req, res) => {

  req.logOut((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const timefunction = async (req, res) => {
  try {
    const { department, academicYear, effectiveFrom, semesters } = req.body;

    const existing = await timetable.findOne({ department, academicYear });

    if (existing) {
      return res.status(409).json({ message: "Timetable already exists for this department and academic year" });
    }

    const semesterIds = [];

    for (const sem of semesters) {
      const dailyScheduleIds = [];

      for (const daySchedule of sem.schedule) {
        const periodIds = [];

        for (const per of daySchedule.periods) {
          const lectureIds = [];

          for (const lec of per.lectures) {
            const newLecture = await Lecture.create(lec);
            lectureIds.push(newLecture._id);
          }

          const newPeriod = await period.create({
            period: per.period,
            startTime: per.startTime,
            endTime: per.endTime,
            lectures: lectureIds,
          });

          periodIds.push(newPeriod._id);
        }

        const newDailySchedule = await dailySchedule.create({
          day: daySchedule.day,
          periods: periodIds,
        });

        dailyScheduleIds.push(newDailySchedule._id);
      }

      const newSemesterSchedule = await semesterSchedule.create({
        semester: sem.semester,
        schedule: dailyScheduleIds,
      });

      semesterIds.push(newSemesterSchedule._id);
    }

    const newTimetable = await timetable.create({
      department,
      academicYear,
      effectiveFrom,
      semesters: semesterIds,
    });

    res.status(201).json(newTimetable);
  } catch (err) {
    console.error("Error creating timetable:", err);
    res.status(500).json({ error: "Failed to create timetable" });
  }
};

export const gettimetable = async (req, res) => {
  try {
    const result = await timetable.find().populate({
      path: "semesters",
      populate: {
        path: "schedule",
        populate: {
          path: "periods",
          populate: {
            path: "lectures",
          },
        },
      },
    });

    res.json(result);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
};

export const getbyid = async (req, res) => {

  const id = req.params.id;

  try {

    const result = await timetable.find({ _id: id }).populate({
      path: "semesters",
      populate: {
        path: "schedule",
        populate: {
          path: "periods",
          populate: {
            path: "lectures",
          },
        },
      },
    });

    res.json(result);

  } catch {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ error: "Failed to fetch timetable" });
  }
}

export const addsemesters = async (req, res) => {

  const { timetableId, semester, schedule } = req.body;


  try {
    const dailyScheduleIds = [];

    for (const dayItem of schedule) {
      const periodIds = [];

      for (const p of dayItem.periods) {
        const lectures = await Lecture.insertMany(p.lectures);
        const periodDoc = await period.create({
          period: p.period,
          startTime: p.startTime,
          endTime: p.endTime,
          lectures: lectures.map((l) => l._id),
        });
        periodIds.push(periodDoc._id);
      }

      const dailyDoc = await dailySchedule.create({
        day: dayItem.day,
        periods: periodIds,
      });

      dailyScheduleIds.push(dailyDoc._id);
    }

    const semesterDoc = await semesterSchedule.create({
      semester,
      schedule: dailyScheduleIds,
    });

    const tt = await timetable.findById(timetableId);
    if (!tt) return res.status(404).json({ error: "Timetable not found" });

    tt.semesters.push(semesterDoc._id);
    await tt.save();

    res.json({ message: "Semester added", timetable: tt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addschedule = async (req, res) => {

  const { semesterScheduleId, newSchedule } = req.body;

  try {
    const periodIds = [];

    for (const p of newSchedule.periods) {
      const createdLectures = await Lecture.insertMany(p.lectures);
      const newPeriod = await period.create({
        period: p.period,
        startTime: p.startTime,
        endTime: p.endTime,
        lectures: createdLectures.map((l) => l._id),
      });

      periodIds.push(newPeriod._id);
    }

    const daily = await dailySchedule.create({
      day: newSchedule.day,
      periods: periodIds,
    });

    const semesterDoc = await semesterSchedule.findById(semesterScheduleId);
    if (!semesterDoc)
      return res.status(404).json({ error: "Semester schedule not found" });

    semesterDoc.schedule.push(daily._id);
    await semesterDoc.save();

    res.json({ message: "Schedule added to semester", semester: semesterDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addperiod = async (req, res) => {

  const { dailyScheduleId, newPeriod } = req.body;

  try {
    const createdLectures = await Lecture.insertMany(newPeriod.lectures);
    const newPeriodDoc = await period.create({
      period: newPeriod.period,
      startTime: newPeriod.startTime,
      endTime: newPeriod.endTime,
      lectures: createdLectures.map((l) => l._id),
    });

    const daySchedule = await dailySchedule.findById(dailyScheduleId);
    if (!daySchedule) {
      return res.status(404).json({ error: "Daily schedule not found" });
    }

    daySchedule.periods.push(newPeriodDoc._id);
    await daySchedule.save();

    res.json({
      message: "Period added to daily schedule",
      schedule: daySchedule,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const addlecture = async (req, res) => {

  const { periodId, lecture } = req.body;


  try {
   
    const newLecture = await Lecture.create(lecture);

    const targetPeriod = await period.findById(periodId);
    if (!targetPeriod) {
      return res.status(404).json({ error: "Period not found" });
    }

    targetPeriod.lectures.push(newLecture._id);
    await targetPeriod.save();

    res.json({ message: "Lecture added to period", period: targetPeriod });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const removesemester = async (req, res) => {
  const { timetableId, semesterId } = req.body;

  console.log("Received request to delete semester:", { timetableId, semesterId });

  if (!timetableId || !semesterId) {
    return res.status(400).json({ error: "Missing timetableId or semesterId" });
  }

  try {
    const tt = await timetable.findById(timetableId);
    if (!tt) return res.status(404).json({ error: "Timetable not found" });

    tt.semesters.pull(semesterId);
    await tt.save();

    const sem = await semesterSchedule.findById(semesterId).populate({
      path: "schedule",
      populate: {
        path: "periods",
        populate: {
          path: "lectures",
        },
      },
    });

    if (!sem) {
      console.warn("Semester not found:", semesterId);
      return res.status(404).json({ error: "Semester not found" });
    }

    for (const day of sem.schedule) {
      for (const p of day.periods) {
        await Promise.all([
          Lecture.deleteMany({ _id: { $in: p.lectures } }),
          period.findByIdAndDelete(p._id),
        ]);
      }
      await dailySchedule.findByIdAndDelete(day._id);
    }

    await semesterSchedule.findByIdAndDelete(semesterId);

    res.json({ message: "Semester and its schedules deleted from timetable" });

  } catch (err) {
    console.error("Error in removesemester:", err);
    res.status(500).json({ error: err.message });
  }
};


export const removelecture = async (req, res) => {
 const { periodId, lectureId } = req.body;

  try {
    const foundPeriod = await period.findById(periodId);
    if (!foundPeriod)
      return res.status(404).json({ error: "Period not found" });

    foundPeriod.lectures.pull(lectureId); 
    await foundPeriod.save();

    await Lecture.findByIdAndDelete(lectureId); 

    res.json({ message: "Lecture removed from period successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const UpdateTimetable = async (req, res) => {

  const updateData = req.body; 

  try {
    const updated = await timetable.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Timetable not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const UpdatesemesterSchedule = async (req, res) => {
  try {
    const updated = await semesterSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Semester not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const UpdateLecture = async (req, res) => {
  try {
    const updated = await Lecture.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Lecture not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const todayperiods = async (req, res) => {
  try {
    const day = new Date().toLocaleString("en-US", { weekday: "long" });

    const data = await timetable.findOne({ department: "Computer Science" })
      .populate({
        path: "semesters",
        populate: {
          path: "schedule",
          populate: {
            path: "periods",
            populate: {
              path: "lectures",
            },
          },
        },
      });

    if (!data || !data.semesters) {
      return res.json([]);
    }

    const result = data.semesters
      .map((sem) => {
        const today = sem.schedule.find((d) => d.day === day);
        return today
          ? {
            semester: sem.semester,
            day: today.day,
            periods: today.periods || [],
          }
          : null;
      })
      .filter(Boolean); 

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load today's periods" });
  }
};

export const getDepartment = async (req, res) => {

  try {

    const result = await timetable.find();
    res.send(result);

  } catch {
    res.status(500).json({ error: "Could not load today's periods" });
  }

}

export const getDepartmentbyId = async (req, res) => {

  const id = req.params.id;
  try {
    const result = await timetable
      .findById(id)
      .populate({
        path: "semesters",
        populate: {
          path: "schedule",
          populate: {
            path: "periods",
            populate: {
              path: "lectures"
            }
          }
        }
      });

    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load department's timetable." });
  }

}

export const DepartmentbyId = async (req, res) => {

  const id = req.params.id;
  try {
    const result = await timetable
      .findById(id)
      .populate({
        path: "semesters",
        populate: {
          path: "schedule",
          populate: {
            path: "periods",
            populate: {
              path: "lectures"
            }
          }
        }
      });

    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load department's timetable." });
  }
}

export const getSemesterSchedule = async (req, res) => {
  try {
    const semester = await semesterSchedule.findById(req.params.id).populate({
      path: "schedule",
      populate: {
        path: "periods",
        populate: { path: "lectures" }
      }
    });

    if (!semester) return res.status(404).json({ error: "Semester not found" });
    res.json({ schedule: semester.schedule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const deleted = await dailySchedule.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Daily schedule not found" });
    res.json({ message: "Daily schedule deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const updated = await dailySchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Daily schedule not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const removeperiod = async (req, res) => {
  const { scheduleId, periodId } = req.body;

  try {
    const schedule = await dailySchedule.findById(scheduleId);
    if (!schedule) return res.status(404).json({ error: "Schedule not found" });

    schedule.periods.pull(periodId);
    await schedule.save();

    const targetPeriod = await period.findById(periodId);
    if (targetPeriod) {
      await Lecture.deleteMany({ _id: { $in: targetPeriod.lectures } });
      await period.findByIdAndDelete(periodId);
    }

    res.json({ message: "Period removed from schedule successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const Updaeperiod = async (req, res) => {
  try {
    const updated = await period.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Period not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
