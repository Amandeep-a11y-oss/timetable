import { useEffect, useState } from "react";
import axios from "axios";
import courseCodeMap from "../courceCode"; 
function TodayWithTimeFilter() {
  const [now, setNow] = useState(getCurrentTime());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function getCurrentTime() {
    const date = new Date();
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function timeToMinutes(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/today-periods")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error loading periods", err);
        setError("Failed to load periods.");
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(getCurrentTime());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const allPeriods = data?.flatMap((sem) => sem.periods) || [];

  const current = allPeriods.filter((p) => {
    const nowMin = timeToMinutes(now);
    const start = timeToMinutes(p.startTime);
    const end = timeToMinutes(p.endTime);
    return nowMin >= start && nowMin < end;
  });

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial" }}>
      <h2>Today's Periods</h2>
      <h3>Current Time: {now}</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {current.length > 0 ? (
        <div style={{ marginBottom: "1rem" }}>
          <strong>Current Period{current.length > 1 ? "s" : ""}:</strong>
          <ul>
            {current.map((p) => (
              <li key={p._id}>
                {p.period} ({p.startTime} - {p.endTime})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No current periods.</p>
      )}

      {!Array.isArray(data) ? (
        <p>Loading or invalid data format.</p>
      ) : data.length === 0 ? (
        <p>No periods found for today.</p>
      ) : (
        data.map((sem) => (
          <div key={sem.semester} style={{ marginBottom: "2rem" }}>
            <h3>
              {sem.semester} - {sem.day}
            </h3>
            {sem.periods.map((p) => (
              <div
                key={p._id}
                style={{
                  marginBottom: "1rem",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              >
                <strong>Period {p.period}</strong>: {p.startTime} - {p.endTime}
                <ul style={{ marginTop: "0.5rem" }}>
                  {p.lectures.map((lec, idx) => (
                    <li key={idx}>
                      Group {lec.group} —{" "}
                      {courseCodeMap[lec.courseCode] || lec.courseCode} (
                      {lec.courseCode}) — {lec.facultyInitials} — Room:{" "}
                      {lec.room}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default TodayWithTimeFilter;
