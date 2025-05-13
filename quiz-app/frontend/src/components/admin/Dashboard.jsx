import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function Dashboard() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [questions, setQuestions] = useState({
    A: {
      multipleChoice: [],
      essay: []
    },
    B: {
      multipleChoice: [],
      essay: []
    }
  });
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [quizType, setQuizType] = useState('A');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const onSubmit = (data) => {
    const newQuestion = {
      id: Date.now(),
      question: data.question,
      ...(questionType === 'multipleChoice' && {
        options,
        correctAnswer
      })
    };

    setQuestions(prev => ({
      ...prev,
      [quizType]: {
        ...prev[quizType],
        [questionType]: [...prev[quizType][questionType], newQuestion]
      }
    }));

    // Reset form
    reset();
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(prev => ({
      ...prev,
      [quizType]: {
        ...prev[quizType],
        [questionType]: prev[quizType][questionType].filter(q => q.id !== questionId)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Management</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Quiz Type:</label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A">Quiz A</option>
                <option value="B">Quiz B</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Question Type:</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="multipleChoice">Multiple Choice</option>
                <option value="essay">Essay</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Question:</label>
              <textarea
                {...register("question", { required: "Question is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
            </div>

            {questionType === 'multipleChoice' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {options.map((option, index) => (
                    <div key={index}>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Option {index + 1}:
                      </label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Correct Answer:</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {options.map((_, index) => (
                      <option key={index} value={index}>Option {index + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Question
            </button>
          </form>
        </div>

        {/* Question List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current Questions</h3>
          <div className="space-y-4">
            {questions[quizType][questionType].map((q) => (
              <div key={q.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{q.question}</p>
                    {q.options && (
                      <ul className="mt-2 space-y-1">
                        {q.options.map((option, index) => (
                          <li key={index} className={index === q.correctAnswer ? 'text-green-600' : ''}>
                            {index + 1}. {option} {index === q.correctAnswer && ' (Correct)'}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
