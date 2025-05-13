import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    quiz_type: 'A',
    question_type: 'multiple_choice',
    question_text: '',
    options: [''],
    correct_answer: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions/A');
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      setError('Failed to fetch questions');
    }
  };

  const fetchAnswers = async () => {
    try {
      const res = await fetch('/api/admin/answers');
      const data = await res.json();
      setAnswers(data);
    } catch (err) {
      setError('Failed to fetch answers');
    }
  };

  const handleAddOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion(prev => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCorrectAnswerChange = (e) => {
    setNewQuestion(prev => ({
      ...prev,
      correct_answer: parseInt(e.target.value, 10),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });
      if (res.ok) {
        setSuccess('Question added successfully');
        setNewQuestion({
          quiz_type: 'A',
          question_type: 'multiple_choice',
          question_text: '',
          options: [''],
          correct_answer: 0,
        });
        fetchQuestions();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add question');
      }
    } catch (err) {
      setError('Failed to add question');
    }
  };

  const handleExport = () => {
    window.open('/api/admin/export', '_blank');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block font-semibold mb-1">Quiz Type</label>
            <select
              name="quiz_type"
              value={newQuestion.quiz_type}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Question Type</label>
            <select
              name="question_type"
              value={newQuestion.question_type}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="essay">Essay</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Question Text</label>
            <textarea
              name="question_text"
              value={newQuestion.question_text}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>

          {newQuestion.question_type === 'multiple_choice' && (
            <div>
              <label className="block font-semibold mb-1">Options</label>
              {newQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border rounded px-3 py-2 w-full mb-2"
                  required
                />
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Option
              </button>
            </div>
          )}

          {newQuestion.question_type === 'multiple_choice' && (
            <div>
              <label className="block font-semibold mb-1">Correct Answer (Option Index)</label>
              <input
                type="number"
                min="0"
                max={newQuestion.options.length - 1}
                value={newQuestion.correct_answer}
                onChange={handleCorrectAnswerChange}
                className="border rounded px-3 py-2 w-full"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Add Question
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">User Answers</h2>
        <button
          onClick={handleExport}
          className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Export to Excel
        </button>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead>
              <tr>
                <th className="border px-4 py-2">NPM</th>
                <th className="border px-4 py-2">Question ID</th>
                <th className="border px-4 py-2">Question Text</th>
                <th className="border px-4 py-2">Question Type</th>
                <th className="border px-4 py-2">Answer</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer) => (
                <tr key={answer.id}>
                  <td className="border px-4 py-2">{answer.npm}</td>
                  <td className="border px-4 py-2">{answer.question_id}</td>
                  <td className="border px-4 py-2">{answer.question_text}</td>
                  <td className="border px-4 py-2">{answer.question_type}</td>
                  <td className="border px-4 py-2">{answer.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
