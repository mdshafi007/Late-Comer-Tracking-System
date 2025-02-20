import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const StudentLogin = () => {
    const [regdNumber, setRegdNumber] = useState('');
    const [studentRecord, setStudentRecord] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStudentRecord(null);

        try {
            const response = await fetch(`http://localhost:5000/api/students/${regdNumber}`);
            const data = await response.json();

            if (response.ok) {
                setStudentRecord(data);
            } else {
                setError(data.message || 'No records found');
            }
        } catch (err) {
            setError('Error fetching records');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Check Late Coming Records</h2>

                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Registration Number:</label>
                        <input
                            type="text"
                            value={regdNumber}
                            onChange={(e) => setRegdNumber(e.target.value)}
                            placeholder="Enter your registration number"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Searching...' : 'Check Records'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {studentRecord && (
                    <div className="record-display">
                        <h3>Student Details</h3>
                        <div className="record-info">
                            <p><strong>Name:</strong> {studentRecord.name}</p>
                            <p><strong>Department:</strong> {studentRecord.department}</p>
                            <p><strong>Section:</strong> {studentRecord.section}</p>
                            <p><strong>Time:</strong> {studentRecord.time}</p>
                            <p><strong>Date:</strong> {new Date(studentRecord.date).toLocaleDateString()}</p>
                            <p><strong>Reason:</strong> {studentRecord.reason}</p>
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => navigate('/')} 
                    className="back-button"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default StudentLogin;