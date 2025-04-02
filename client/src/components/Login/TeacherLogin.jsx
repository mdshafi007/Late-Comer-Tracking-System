import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const TeacherLogin = () => {
    const [teacherId, setTeacherId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/teacher/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacherId, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', 'teacher');
                // Store section information if available
                if (data.section) {
                    localStorage.setItem('section', data.section);
                }
                navigate('/teacher/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Server error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Teacher Login</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="teacherId">Teacher ID</label>
                        <input
                            id="teacherId"
                            type="text"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                            placeholder="Enter your ID"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <button 
                        type="button"
                        onClick={() => navigate('/')} 
                        className="back-button"
                        disabled={isLoading}
                    >
                        Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherLogin;