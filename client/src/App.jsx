import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherLogin from './components/Login/TeacherLogin';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home/Landing Page */}
          <Route path="/" element={
            <div className="home-container">
              <div className="content-wrapper">
                <div className="logo-container">
                  <img src="./vignan-logo.jpg" alt="Vignan University" />
                </div>
                
                <div className="title-container">
                  <h1>Late Comer Tracking System</h1>
                  <p>Efficient late comer tracking for better discipline management.</p>
                </div>

                <div className="buttons-container">
                  <a href="/teacher/login" className="login-button teacher-login">
                    Teacher Login
                  </a>
                  <a href="/student" className="login-button student-login">
                    Student Records
                  </a>
                </div>
              </div>
            </div>
          } />

          {/* Teacher Routes */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;