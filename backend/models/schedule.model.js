import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  group: {
    type: String
  },
  courseCode: String,
  facultyInitials: String,
  room: String,
});

const Lecture = mongoose.model("Lecture", lectureSchema);

const periodSchema = new mongoose.Schema({
    period: {
      type: String
    },
    startTime: String,
    endTime: String,
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
      }
    ]
  });
  
  const period = mongoose.model("period", periodSchema);

  const dailyScheduleSchema = new mongoose.Schema({
    day: {
      type: String
    },
    periods: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "period"
    }]
  });

  const dailySchedule = mongoose.model("dailySchedule", dailyScheduleSchema);

  const semesterScheduleSchema = new mongoose.Schema({
    semester: {
      type: String
    },
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "dailySchedule"
    }]
  });

  const semesterSchedule = mongoose.model("semesterSchedule", semesterScheduleSchema);

  const timetableSchema = new mongoose.Schema({
    department: { type: String, default: 'Computer Science' },
    academicYear: { type: String, default: '2024–25' },
    effectiveFrom: { type: Date, default: new Date('2025-02-24') },
    semesters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "semesterSchedule"
    }]
  });

  const timetable = mongoose.model("timetable", timetableSchema);

export { timetable, semesterSchedule, dailySchedule , period, Lecture }
