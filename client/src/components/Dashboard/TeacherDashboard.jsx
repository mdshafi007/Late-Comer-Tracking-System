import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showOnlyMySection, setShowOnlyMySection] = useState(false);
  const [teacherSection, setTeacherSection] = useState('');
  const [formData, setFormData] = useState({
    regdNumber: '',
    name: '',
    department: '',
    section: '',
    time: '',
    reason: ''
  });
  const [selectedDate, setSelectedDate] = useState(''); // New state for selected date
  
  const navigate = useNavigate();

  // Teacher ID to section mapping
  const teacherSectionMap = {
    '4272': 'A'
    // Add more teacher IDs and their sections here
    // '1234': 'B',
    // '5678': 'C',
    // etc.
  };

 // Modify the fetchRecords function to pass the date filter as a query parameter
const fetchRecords = useCallback(async () => {
  try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Add date to query parameters if selected
      const dateFilter = selectedDate ? `&date=${selectedDate}` : '';

      const response = await fetch(`http://localhost:5000/api/students?${dateFilter}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) throw new Error('Failed to fetch records');
      
      const data = await response.json();
      setRecords(data);

      // Apply section filter if active
      let filtered = data;
      if (showOnlyMySection && teacherSection) {
          filtered = filtered.filter(record => record.section === teacherSection);
      }

      setFilteredRecords(filtered);
  } catch (error) {
      showMessage('error', error.message || 'Error fetching records');
  } finally {
      setLoading(false);
  }
}, [showOnlyMySection, teacherSection, selectedDate]);


  useEffect(() => {
    // Get teacherId from localStorage and set the corresponding section
    const teacherId = localStorage.getItem('teacherId') || '4272'; // Default to 4272 for testing
    const section = teacherSectionMap[teacherId];
    if (section) {
      setTeacherSection(section);
    }
    
    fetchRecords();
  }, [fetchRecords]);

  // Apply filter when showOnlyMySection changes
  useEffect(() => {
    if (showOnlyMySection && teacherSection) {
      const filtered = records.filter(record => record.section === teacherSection);
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [showOnlyMySection, teacherSection, records]);

  const toggleSectionFilter = () => {
    setShowOnlyMySection(!showOnlyMySection);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Record added successfully');
        setFormData({
          regdNumber: '',
          name: '',
          department: '',
          section: '',
          time: '',
          reason: ''
        });
        fetchRecords();
        setActiveTab('view');
      } else {
        showMessage('error', data.message || 'Failed to add record');
      }
    } catch (error) {
      showMessage('error', 'Server error. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('success', 'Record deleted successfully');
        fetchRecords();
      } else {
        showMessage('error', 'Failed to delete record');
      }
    } catch (error) {
      showMessage('error', 'Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('teacherId');
    navigate('/teacher/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <img src="/vignan-logo.jpg" alt="Vignan Logo" className="header-logo" />
              <div className="header-title">
                <h1>Teacher Dashboard</h1>
                <span className="header-subtitle">Late Comer Tracking System</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn logout-button">Logout</button>
          </div>
        </div>
      </header>

      <div className="tabs-container">
        <div className="container">
          <div className="tabs-nav">
            <button 
              className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => setActiveTab('add')}
            >
              Add Late Record
            </button>
            <button 
              className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              View Records
            </button>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'add' && (
        <div className="dashboard-content">
          <div className="form-header">
            <h2>Add Late Coming Record</h2>
            <p>Enter student details and late coming information</p>
          </div>
          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-field">
              <label htmlFor="regdNumber">Registration Number</label>
              <input
                id="regdNumber"
                name="regdNumber"
                type="text"
                value={formData.regdNumber}
                onChange={handleInputChange}
                placeholder="e.g., 20B81A05J5"
                required
                disabled={formLoading}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="name">Student Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                disabled={formLoading}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                disabled={formLoading}
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="IT">IT</option>
              </select>
            </div>
            
            <div className="form-field">
              <label htmlFor="section">Section</label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                disabled={formLoading}
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            
            <div className="form-field">
              <label htmlFor="time">Arrival Time</label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                disabled={formLoading}
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="reason">Reason for Late Coming</label>
              <input
                id="reason"
                name="reason"
                type="text"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for late arrival"
                required
                disabled={formLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={formLoading}
            >
              {formLoading && <span className="loading-spinner"></span>}
              {formLoading ? 'Adding...' : 'Add Record'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="dashboard-content">
          <div className="form-header">
            <h2>Late Coming Records</h2>
            <p>View and manage student late coming records</p>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input 
                  type="checkbox" 
                  checked={showOnlyMySection} 
                  onChange={toggleSectionFilter}
                />
                <span>Show only my section students (Section {teacherSection})</span>
              </label>
            </div>

            {/* Date Filter */}
            <div className="filter-date">
              <label htmlFor="date">Filter by Date:</label>
              <input 
                type="date" 
                id="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>
          </div>
          <div className="table-container">
            {loading ? (
              <div className="no-records">Loading records...</div>
            ) : filteredRecords.length === 0 ? (
              <div className="no-records">No records found</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Regd Number</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Time</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record._id}>
                      <td>{formatDate(record.date)}</td>
                      <td>{record.regdNumber}</td>
                      <td>{record.name}</td>
                      <td>{record.department}</td>
                      <td>{record.section}</td>
                      <td>{record.time}</td>
                      <td>{record.reason}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(record._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDashboard;
