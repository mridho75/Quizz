import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BioData() {
  const [nama, setNama] = useState('');
  const [npm, setNPM] = useState('');
  const [kelas, setKelas] = useState('');
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginNPM, setLoginNPM] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const pcNumber = localStorage.getItem('pc_number');
      const quizType = localStorage.getItem('quiz_type');
      if (!pcNumber || !quizType) {
        throw new Error('PC number or quiz type is missing');
      }

      // Check if student exists
      const response = await fetch(`http://localhost:5000/api/students/${npm}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Save new student data if not found
          const saveResponse = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ npm, nama, kelas, pcNumber, quiz_type: quizType }),
          });

          if (!saveResponse.ok) {
            throw new Error('Failed to save new student data');
          }
        } else {
          throw new Error('Failed to fetch student data');
        }
      } else {
        const existingStudent = await response.json();

        // If student exists, update the data
        if (existingStudent) {
          const updateResponse = await fetch(`http://localhost:5000/api/students/${npm}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nama, kelas, pcNumber, quiz_type: quizType }), 
          });

          if (!updateResponse.ok) {
            throw new Error('Failed to update student data');
          }
        }
      }

      // Store student data and quiz_type in localStorage
      localStorage.setItem('student_npm', npm);
      localStorage.setItem('student_name', nama);
      localStorage.setItem('student_class', kelas);
      localStorage.setItem('quiz_type', quizType); 

      // Start quiz
      navigate('/quiz');
    } catch (error) {
      console.error('Error saving student data:', error);
      setError(error.message || 'An error occurred while saving your information. Please try again.');
    }
  };

  // Function to handle login (resume quiz)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const pcNumber = localStorage.getItem('pc_number');
      const quizType = localStorage.getItem('quiz_type'); 
      if (!pcNumber || !quizType) {
        throw new Error('PC number or quiz type is missing');
      }

      // Fetch student data for resume quiz
      const response = await fetch(`http://localhost:5000/api/students/${loginNPM}`);
      if (!response.ok) {
        throw new Error('Student not found. Please check your NPM.');
      }

      const student = await response.json();

      // Store student info and quiz_type in localStorage
      localStorage.setItem('student_npm', student.npm);
      localStorage.setItem('student_name', student.nama);
      localStorage.setItem('student_class', student.kelas);
      localStorage.setItem('quiz_type', quizType); 

      // Resume quiz with resuming flag
      navigate('/quiz', { state: { resuming: true } });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your NPM.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {showLoginForm ? 'Resume Quiz' : 'Student Information'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showLoginForm ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">NPM:</label>
              <input
                type="text"
                value={loginNPM}
                onChange={(e) => setLoginNPM(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your NPM"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Resume Quiz
            </button>

            <button
              type="button"
              onClick={() => setShowLoginForm(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mt-2"
            >
              Back to Registration
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nama:</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">NPM:</label>
                <input
                  type="text"
                  value={npm}
                  onChange={(e) => setNPM(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Kelas:</label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Start Quiz
              </button>
            </form>

            <button
              type="button"
              onClick={() => setShowLoginForm(true)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200 mt-4"
            >
              Already Registered? Resume Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}
