import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';  

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({ multipleChoice: {}, essay: {} });
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const npm = localStorage.getItem('student_npm');
        const quizType = localStorage.getItem('quiz_type');
        const pcNumber = localStorage.getItem('pc_number');

        if (!npm || !quizType || !pcNumber) {
          navigate('/login');
          return;
        }

        // Get quiz questions
        const response = await fetch(`http://localhost:5000/api/questions/${quizType}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz questions');
        }
        const quizQuestions = await response.json();
        setQuestions(quizQuestions);

        // Get student's answers
        const progressResponse = await fetch(`http://localhost:5000/api/answers/${npm}`);
        if (progressResponse.ok) {
          const progress = await progressResponse.json();
          if (Array.isArray(progress) && progress.length > 0) {
            const savedAnswers = { multipleChoice: {}, essay: {} };
            const answered = new Set();
            let lastAnsweredIndex = -1;

            progress.forEach(answer => {
              const questionIndex = quizQuestions.findIndex(q => q.id === answer.question_id);
              if (questionIndex > lastAnsweredIndex) {
                lastAnsweredIndex = questionIndex;
              }

              answered.add(answer.question_id);
              if (answer.question_type === 'multiple_choice') {
                savedAnswers.multipleChoice[answer.question_id] = parseInt(answer.answer);
              } else {
                savedAnswers.essay[answer.question_id] = answer.answer;
              }
            });

            setAnswers(savedAnswers);
            setAnsweredQuestions(answered);
            setCurrentQuestionIndex(lastAnsweredIndex + 1);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz:', error);
        setError('Gagal memuat soal quiz. Coba lagi.');
        setLoading(false);
      }
    };

    loadQuizData();
  }, [navigate]);

  const saveAnswer = async (questionId, answer) => {
    const npm = localStorage.getItem('student_npm');
    const quizType = localStorage.getItem('quiz_type');
    try {
      const response = await fetch('http://localhost:5000/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ npm, questionId, answer, quizType }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan jawaban');
      }

      setAnsweredQuestions(prev => new Set(prev.add(questionId)));
    } catch (error) {
      console.error('Error saving answer:', error);
      setError('Gagal menyimpan jawaban. Periksa koneksi Anda.');
    }
  };

  const handleMultipleChoiceAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    setAnswers(prev => ({
      ...prev,
      multipleChoice: {
        ...prev.multipleChoice,
        [currentQuestion.id]: selectedOption
      }
    }));

    await saveAnswer(currentQuestion.id, selectedOption);
  };

  const handleEssayAnswer = async (text) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    setAnswers(prev => ({
      ...prev,
      essay: {
        ...prev.essay,
        [currentQuestion.id]: text
      }
    }));

    if (text.trim()) {
      await saveAnswer(currentQuestion.id, text);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Check for unanswered questions and navigate directly to first unanswered
      const unansweredIndex = questions.findIndex(q => {
        if (q.question_type === 'multiple_choice') {
          return answers.multipleChoice[q.id] === undefined;
        } else {
          return !answers.essay[q.id] || answers.essay[q.id].trim() === '';
        }
      });

      if (unansweredIndex !== -1) {
        setCurrentQuestionIndex(unansweredIndex);
        return;
      }

      Swal.fire({
        title: 'Apakah Anda yakin ingin mengirim jawaban?',
        showCancelButton: true,
        confirmButtonText: 'Iya',
        cancelButtonText: 'Tidak',
      }).then((result) => {
        if (result.isConfirmed) {
          const biodata = {
            nama: localStorage.getItem('student_name'),
            npm: localStorage.getItem('student_npm'),
            kelas: localStorage.getItem('student_class'),
            pc_number: localStorage.getItem('pc_number'),
            quiz_type: localStorage.getItem('quiz_type')
          };

          navigate('/biodata', { state: { biodata } });
        }
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Memuat quiz...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 pr-32">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="fixed right-6 top-6 bg-white p-3 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-10 gap-1.5">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium
                    ${currentQuestionIndex === index ? 'ring-2 ring-blue-500' : ''} 
                    ${answeredQuestions.has(question.id) ? 'bg-green-500 text-white' : 'bg-gray-200'}
                    hover:bg-blue-100 transition-colors`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentQuestion.question_type === 'multiple_choice' ? 'Pertanyaan Pilihan Ganda' : 'Pertanyaan Essai'}
            </h2>
            <p className="text-gray-600">Soal {currentQuestionIndex + 1} dari {questions.length}</p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.question_text}</h3>

            {currentQuestion.question_type === 'multiple_choice' ? (
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="block">
                    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        value={index}
                        checked={answers.multipleChoice[currentQuestion.id] === index}
                        onChange={() => handleMultipleChoiceAnswer(index)}
                        className="form-radio text-blue-500"
                      />
                      <span className="ml-3">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={answers.essay[currentQuestion.id] || ''}
                onChange={(e) => handleEssayAnswer(e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    handleEssayAnswer(e.target.value);
                  }
                }}
                className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tulis jawaban Anda disini..."
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-md ${currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white'}`}
            >
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Kirim' : 'Selanjutnya'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
