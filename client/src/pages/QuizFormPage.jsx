import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '@/api/axiosConfig';
import { useFetch } from '@/hooks/useFetch';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2, PlusCircle } from 'lucide-react';

const QuizFormPage = () => {
  const { id: quizId } = useParams();
  const isEditMode = Boolean(quizId);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: existingQuiz, isLoading: isFetching } = useFetch(isEditMode ? `/quizzes/${quizId}/details` : null);

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [timerType, setTimerType] = useState('overall');
  const [timer, setTimer] = useState(10);
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, timer: 30 },
  ]);

  useEffect(() => {
    if (isEditMode && existingQuiz) {
      setTitle(existingQuiz.title);
      setDescription(existingQuiz.description);
      setCategory(existingQuiz.category);
      setTimerType(existingQuiz.timerType);
      setTimer(existingQuiz.timer);
      setQuestions(existingQuiz.questions.map(q => ({...q})));
    }
  }, [isEditMode, existingQuiz]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, timer: 30 }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.warn('A quiz must have at least one question.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const quizData = { title, description, category, timerType, timer: Number(timer), questions };
    try {
      if (isEditMode) {
        await api.put(`/quizzes/${quizId}`, quizData);
        toast.success('Quiz updated successfully!');
      } else {
        await api.post('/quizzes', quizData);
        toast.success('Quiz created successfully!');
      }
      
      if (user.role === 'admin') {
        navigate('/admin/quizzes');
      } else {
        navigate('/my-quizzes');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <Loader />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</CardTitle>
        <CardDescription>Fill in the details for the quiz.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold">Quiz Details</h3>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Timer Type</Label>
                <RadioGroup value={timerType} onValueChange={setTimerType} className="flex space-x-4">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="overall" id="overall" /><Label htmlFor="overall">Overall Timer</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="per_question" id="per_question" /><Label htmlFor="per_question">Per-Question Timer</Label></div>
                </RadioGroup>
            </div>
            {timerType === 'overall' && (
                <div className="space-y-2">
                    <Label htmlFor="timer">Overall Timer (minutes)</Label>
                    {/* 👇 Added a fallback of || 1 to prevent NaN */}
                    <Input id="timer" type="number" value={timer} onChange={(e) => setTimer(parseInt(e.target.value, 10) || 1)} required min="1" />
                </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border rounded-md relative">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-md font-medium">Question {qIndex + 1}</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(qIndex)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Textarea className={timerType === 'per_question' ? "md:col-span-4" : "md:col-span-5"} placeholder="Question text..." value={q.text} onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} required />
                    {timerType === 'per_question' && (
                        <div className="space-y-2 md:col-span-1">
                            <Label htmlFor={`q${qIndex}-timer`}>Timer (sec)</Label>
                            {/* 👇 Added a fallback of || 5 to prevent NaN */}
                            <Input id={`q${qIndex}-timer`} type="number" min="5" value={q.timer} onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value, 10) || 5)} required />
                        </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIndex) => (<Input key={oIndex} placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} required />))}
                  </div>
                  <div>
                    <Label>Correct Answer</Label>
                    <RadioGroup value={q.correctAnswerIndex.toString()} onValueChange={(value) => handleQuestionChange(qIndex, 'correctAnswerIndex', parseInt(value))} className="mt-2">
                      {q.options.map((_, oIndex) => (<div key={oIndex} className="flex items-center space-x-2"><RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} /><Label htmlFor={`q${qIndex}-o${oIndex}`}>Option {oIndex + 1}</Label></div>))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={addQuestion}><PlusCircle className="w-4 h-4 mr-2" />Add Question</Button>
          <div className="flex justify-end"><Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (isEditMode ? 'Update Quiz' : 'Create Quiz')}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuizFormPage;
