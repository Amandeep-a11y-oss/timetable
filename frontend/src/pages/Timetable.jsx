import { useState, useEffect } from "react";
import timetableStore from "../store/timetableStore";


function Timetable() {
	
  const { users, fetchUsers, loading, error } = timetableStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!users.length) return <p>No data available</p>;

  const user = users[0]; 

  return (
    <div className="App">
      <h1>{user.department}</h1>
      <p><strong>Academic Year:</strong> {user.academicYear}</p>
      <p><strong>Effective From:</strong> {new Date(user.effectiveFrom).toDateString()}</p>

      <hr />

      <h2>Semesters</h2>
      {user.semesters.map((sem, i) => (
  <div key={i} style={{ marginBottom: '2rem' }}>
    <h2>{sem.semester}</h2>

    {sem.schedule.map((day, j) => (
      <div key={j} style={{ marginTop: '1rem' }}>
        <h3>{day.day}</h3>

        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th>Period</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Course Code</th>
              <th>Group</th>
              <th>Faculty</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {day.periods.map((period, k) =>
              period.lectures.map((lec, l) => (
                <tr key={`${k}-${l}`}>
                  <td>{period.period}</td>
                  <td>{period.startTime}</td>
                  <td>{period.endTime}</td>
                  <td>{lec.courseCode}</td>
                  <td>{lec.group}</td>
                  <td>{lec.facultyInitials}</td>
                  <td>{lec.room}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ))}
  </div>
))}

    </div>
  );
}

export default Timetable;

