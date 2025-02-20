import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const StudentDashboard = () => {
  const [regdNumber, setRegdNumber] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!regdNumber.trim()) return;
    
    setLoading(true);
    setError('');
    setStudentData(null);
    setRecords([]);

    try {
      const response = await fetch(`http://localhost:5000/api/students/${regdNumber}`);
      const data = await response.json();

      if (response.ok) {
        setStudentData(data.student);
        setRecords(data.records);
      } else {
        setError(data.message || 'No records found for this registration number');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <img src="/vignan-logo.jpg" alt="Vignan Logo" className="header-logo" />
              <div className="header-title">
                <h1>Student Dashboard</h1>
                <span className="header-subtitle">Late Coming Records</span>
              </div>
            </div>
            <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Home</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="form-header">
          <h2>Check Late Coming Records</h2>
          <p>Enter your registration number to view your records</p>
        </div>
        <div className="form-content">
          {error && (
            <div className="alert alert-error">{error}</div>
          )}
          
          <form onSubmit={handleSearch}>
            <div className="form-field">
              <label htmlFor="regdNumber">Registration Number</label>
              <input
                id="regdNumber"
                type="text"
                value={regdNumber}
                onChange={(e) => setRegdNumber(e.target.value)}
                placeholder="Enter your registration number"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading || !regdNumber.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Searching...
                </>
              ) : 'Check Records'}
            </button>
          </form>
        </div>
      </div>

      {studentData && (
        <div className="dashboard-content">
          <div className="form-header">
            <h2>Student Information</h2>
          </div>
          <div className="form-content">
            <div className="student-info">
              <div className="info-row">
                <div className="info-label">Name:</div>
                <div className="info-value">{studentData.name}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Registration Number:</div>
                <div className="info-value">{studentData.regdNumber}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Department:</div>
                <div className="info-value">{studentData.department}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Section:</div>
                <div className="info-value">{studentData.section}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {studentData && (
        <div className="simple-records-container">
          <div className="simple-records-header">
            <h2>Late Coming Records</h2>
            <span className="simple-records-count">
              {records.length} {records.length === 1 ? 'record' : 'records'} found
            </span>
          </div>

          {records.length === 0 ? (
            <div className="simple-no-records">
              No late coming records found.
            </div>
          ) : (
            <div className="simple-records-list">
              {records.map((record, index) => {
                const date = formatDate(record.date);
                const dateObj = new Date(record.date);
                const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' });
                
                return (
                  <div key={index} className="simple-record-item">
                    <div className="simple-record-date">
                      <div className="simple-date-day">{date.day}</div>
                      <div className="simple-date-month">{date.month}</div>
                      <div className="simple-date-weekday">{weekday}</div>
                    </div>
                    <div className="simple-record-details">
                      <div className="simple-detail-row">
                        <div className="simple-detail-label">Arrival Time:</div>
                        <div className="simple-detail-value">{record.time}</div>
                      </div>
                      <div className="simple-detail-row">
                        <div className="simple-detail-label">Reason:</div>
                        <div className="simple-detail-value">
                          <span className="simple-reason-tag">{record.reason}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudentDashboard;