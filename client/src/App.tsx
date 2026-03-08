import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/Student/Dashboard';
import Assignments from './pages/Student/Assignments';
import Attendance from './pages/Student/Attendance';
import ReportCard from './pages/Student/ReportCard';
import CareerAI from './pages/Student/CareerAI';
import Quiz from './pages/Student/Quiz';
import InnovationHub from './pages/Student/InnovationHub';
import Gamification from './pages/Student/Gamification';
import Courses from './pages/Student/Courses';
import Profile from './pages/Student/Profile';
import CourseMaterials from './pages/Student/CourseMaterials';
import StudentMentorship from './pages/Student/MentorshipDashboard';
import StudentCalendar from './pages/Student/Calendar';
import StudentTimetable from './pages/Student/Timetable';
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherAssignments from './pages/Teacher/Assignments';
import TeacherAttendance from './pages/Teacher/Attendance';
import TeacherQuizGen from './pages/Teacher/QuizGen';
import TeacherIdeaReview from './pages/Teacher/IdeaReview';
import TeacherAnalytics from './pages/Teacher/Analytics';
import TeacherPlagiarism from './pages/Teacher/Plagiarism';
import TeacherCalendar from './pages/Teacher/Calendar';
import TeacherTimetable from './pages/Teacher/Timetable';
import TeacherCommunication from './pages/Teacher/Communication';
import TeacherMentorship from './pages/Teacher/MentorshipDashboard';
import ParentDashboard from './pages/Parent/Dashboard';
import ParentPerformance from './pages/Parent/Performance';
import ParentAttendance from './pages/Parent/Attendance';
import ParentAssignments from './pages/Parent/Assignments';
import ParentCommunication from './pages/Parent/Communication';
import ParentCalendar from './pages/Parent/Calendar';
import ParentTimetable from './pages/Parent/Timetable';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen font-sans selection:bg-blue-500/30 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<Courses />} />
            <Route path="/student/assignments" element={<Assignments />} />
            <Route path="/student/attendance" element={<Attendance />} />
            <Route path="/student/report-card" element={<ReportCard />} />
            <Route path="/student/career" element={<CareerAI />} />
            <Route path="/student/quiz" element={<Quiz />} />
            <Route path="/student/innovation" element={<InnovationHub />} />
            <Route path="/student/gamification" element={<Gamification />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/course-materials" element={<CourseMaterials />} />
            <Route path="/student/calendar" element={<StudentCalendar />} />
            <Route path="/student/timetable" element={<StudentTimetable />} />
            <Route path="/student/mentorship" element={<StudentMentorship />} />

            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/assignments" element={<TeacherAssignments />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/quiz-gen" element={<TeacherQuizGen />} />
            <Route path="/teacher/idea-review" element={<TeacherIdeaReview />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/plagiarism" element={<TeacherPlagiarism />} />
            <Route path="/teacher/calendar" element={<TeacherCalendar />} />
            <Route path="/teacher/timetable" element={<TeacherTimetable />} />
            <Route path="/teacher/communication" element={<TeacherCommunication />} />
            <Route path="/teacher/mentorship" element={<TeacherMentorship />} />

            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/performance" element={<ParentPerformance />} />
            <Route path="/parent/attendance" element={<ParentAttendance />} />
            <Route path="/parent/assignments" element={<ParentAssignments />} />
            <Route path="/parent/communication" element={<ParentCommunication />} />
            <Route path="/parent/calendar" element={<ParentCalendar />} />
            <Route path="/parent/timetable" element={<ParentTimetable />} />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

