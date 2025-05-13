import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [pc, setPC] = useState('');
  const [password, setPassword] = useState('');
  const [quizType, setQuizType] = useState('A');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // POST method for validation
      const response = await fetch('http://localhost:5000/api/validatePC', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pc_number: parseInt(pc),
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid PC number or password');
      }

      const data = await response.json();

      if (!data || !data.valid) {
        setError('Invalid PC number or password');
        return;
      }

      // Store PC info and quiz type in localStorage
      localStorage.setItem('pc_number', pc);
      localStorage.setItem('quiz_type', quizType);

      // Navigate to biodata page
      navigate('/biodata');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quiz Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">PC:</label>
            <input
              type="number"
              min="1"
              max="40"
              value={pc}
              onChange={(e) => setPC(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Quiz Type:</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="A"
                  checked={quizType === 'A'}
                  onChange={(e) => setQuizType(e.target.value)}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Quiz A</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="B"
                  checked={quizType === 'B'}
                  onChange={(e) => setQuizType(e.target.value)}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Quiz B</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
