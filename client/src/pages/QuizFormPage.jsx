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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Trash2, PlusCircle, Sparkles, BookOpen } from 'lucide-react'; // Added BookOpen for details section
import { Helmet } from 'react-helmet-async';
import { cn } from '@/lib/utils'; // Import cn utility

// Helper function to format input tags string into an array
const formatTags = (tagsString) => tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

// FIX: Modified to correctly handle single string inputs (from AI) or array inputs (from existing quiz data)
const formatTagsToString = (value) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  // If it's a single string (expected from AI/fill-in-the-blank model), return it directly.
  if (typeof value === 'string' && value.length > 0) {
      return value;
  }
  return ''; 
};

const defaultQuestion = { 
  text: '', 
  type: 'multiple-choice', // Feature 4 default
  options: ['', '', '', ''], 
  correctAnswerIndex: 0, // Mixed type now: number or string/array
  timer: 30 
};

const QuizFormPage = () => {
  const { id: quizId } = useParams();
  const isEditMode = Boolean(quizId);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const { data: existingQuiz, isLoading: isFetching } = useFetch(isEditMode ? `/quizzes/${quizId}/details` : null);

  // State for the main quiz form
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tagsString, setTagsString] = useState(''); // Feature 5: for input
  const [timerType, setTimerType] = useState('overall');
  const [timer, setTimer] = useState(10);
  const [questions, setQuestions] = useState([defaultQuestion]);
  
  // State for the AI generation modal
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiQuizType, setAiQuizType] = useState('multiple-choice'); // <-- NEW STATE
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && existingQuiz) {
      setTitle(existingQuiz.title);
      setDescription(existingQuiz.description);
      setCategory(existingQuiz.category);
      // Feature 5: Populate tags
      setTagsString(formatTagsToString(existingQuiz.tags)); 
      setTimerType(existingQuiz.timerType || 'overall');
      setTimer(existingQuiz.timer || 10);
      setQuestions(existingQuiz.questions.map(q => ({
        ...q, 
        timer: q.timer || 30,
        // Ensure correctAnswerIndex is normalized for the form if it's a number
        correctAnswerIndex: q.type === 'multiple-choice' || q.type === 'true-false' 
                              ? String(q.correctAnswerIndex) 
                              : formatTagsToString(q.correctAnswerIndex)
      })));
    }
  }, [isEditMode, existingQuiz]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;

    // Reset options and answer when changing type (Feature 4)
    if (field === 'type') {
      newQuestions[index].options = value === 'true-false' ? ['True', 'False'] : defaultQuestion.options;
      newQuestions[index].correctAnswerIndex = defaultQuestion.correctAnswerIndex;
    }

    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, defaultQuestion]);
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
    
    const finalTimer = Number(timer) || 10;
    
    // Final questions formatting: Convert form values to the correct format for the backend (Feature 4)
    const finalQuestions = questions.map(q => {
      const isMC_TF = q.type === 'multiple-choice' || q.type === 'true-false';
      
      let correctAnswer;
      if (isMC_TF) {
        // Convert the string index back to a number
        correctAnswer = Number(q.correctAnswerIndex); 
      } else {
        // Convert the comma-separated string to an array for Fill/Short Answer
        correctAnswer = formatTags(q.correctAnswerIndex);
        if (q.type === 'fill-in-the-blank' && correctAnswer.length === 1) {
            // Simplify to string if only one accepted answer
            correctAnswer = correctAnswer[0];
        }
      }

      return {
        text: q.text,
        type: q.type,
        options: isMC_TF || q.type === 'true-false' ? q.options : undefined,
        correctAnswerIndex: correctAnswer, 
        timer: Number(q.timer) || 30
      };
    });

    const quizData = { 
        title, 
        description, 
        category, 
        tags: formatTags(tagsString), // Feature 5: Add tags
        timerType, 
        timer: finalTimer, 
        questions: finalQuestions 
    };

    setIsLoading(true);
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

  const handleGenerateQuiz = async () => {
    if (!aiTopic || !aiQuizType) {
      toast.error('Please enter a topic and select a quiz type.');
      return;
    }
    setIsGenerating(true);
    try {
      // PASS NEW PARAMETER: aiQuizType
      const response = await api.post('/quizzes/generate-ai', {
        topic: aiTopic,
        numQuestions: aiNumQuestions,
        difficulty: aiDifficulty,
        quizType: aiQuizType, // <-- NEW PARAMETER PASSED TO BACKEND
      });
      const aiQuiz = response.data;
      
      setTitle(aiQuiz.title);
      setCategory(aiQuiz.category);
      setTagsString(aiQuiz.category); // Default tags to category
      setDescription(aiQuiz.description);
      
      // Map AI response to new question structure for the form
      setQuestions(aiQuiz.questions.map(q => {
          
          let correctAnswerValue;
          // Logic for correctly mapping AI answer to form field value:
          if (q.type === 'short-answer' || q.type === 'fill-in-the-blank') {
              // For text inputs, the answer is a string which is now correctly handled by the modified formatTagsToString
              correctAnswerValue = formatTagsToString(q.correctAnswerIndex); 
          } else {
              // For MC/T-F, convert index to string for the RadioGroup value
              correctAnswerValue = String(q.correctAnswerIndex);
          }
          
          return {
              ...q,
              type: q.type || 'multiple-choice', // Use type from AI, fallback to default
              correctAnswerIndex: correctAnswerValue, 
              timer: q.timer || 30,
          }
      }));
      
      toast.success('Quiz generated successfully! Please review and save.');
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isFetching) return <Loader />;

  return (
    <>
      <Helmet>
        <title>{isEditMode ? 'Edit Quiz' : 'Create Quiz'} | ParikshaNode</title>
        <meta name="description" content="Create or edit a quiz with custom questions, options, and timers." />
      </Helmet>
      <Card className={cn("max-w-6xl mx-auto shadow-2xl shadow-primary/20 border-primary/20", "animate-in fade-in slide-in-from-top-10 duration-700")}>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between py-6 border-b border-border/50">
          <div>
            <CardTitle className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text 
                                  bg-gradient-to-r from-primary to-destructive drop-shadow-md">
                {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
            </CardTitle>
            <CardDescription className="text-lg mt-1">
                {isEditMode ? 'Modify the details and questions for this quiz.' : 'Fill in the details for the quiz manually or use AI.'}
            </CardDescription>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="mt-4 md:mt-0 h-11 px-6 text-lg border-primary/50 text-primary hover:bg-primary/10 hover:border-primary shadow-lg shadow-primary/20 transition-all duration-300"
                >
                    <Sparkles className="w-5 h-5 mr-2" />Generate with AI
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">Generate Quiz with AI</DialogTitle>
                  <DialogDescription>Describe the quiz you want to create.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label className="font-semibold">Topic</Label><Input placeholder="e.g., JavaScript Basics" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} className="h-10" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="font-semibold">Quiz Type</Label>
                        <Select value={aiQuizType} onValueChange={setAiQuizType}>
                            <SelectTrigger className="h-10"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="true-false">True/False</SelectItem>
                                <SelectItem value="fill-in-the-blank">Fill-in-the-Blanks</SelectItem>
                                <SelectItem value="short-answer">Short Answer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2"><Label className="font-semibold">Questions (1-10)</Label><Input type="number" min="1" max="10" value={aiNumQuestions} onChange={(e) => setAiNumQuestions(Number(e.target.value))} className="h-10" /></div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Difficulty</Label>
                      <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                        <SelectTrigger className="h-10"><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleGenerateQuiz} disabled={isGenerating} className="h-10 shadow-primary/40 hover:shadow-primary/60">
                    {isGenerating ? 'Generating...' : 'Generate Quiz'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6 p-6 border rounded-xl shadow-inner bg-secondary/50">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-foreground/90"><BookOpen className="w-6 h-6 text-primary"/> Quiz Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="title" className="font-semibold">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="h-10 focus-visible:ring-primary" /></div>
                  <div className="space-y-2"><Label htmlFor="category" className="font-semibold">Category</Label><Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="h-10 focus-visible:ring-primary" /></div>
              </div>

              <div className="space-y-2"><Label htmlFor="description" className="font-semibold">Description</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px] focus-visible:ring-primary" /></div>
              
              {/* --- START: Feature 5: Tags Input --- */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="font-semibold">Tags (Comma separated, e.g., 'history, ancient-rome')</Label>
                <Input id="tags" value={tagsString} onChange={(e) => setTagsString(e.target.value)} className="h-10 focus-visible:ring-primary" />
              </div>
              {/* --- END: Feature 5: Tags Input --- */}

              <div className="space-y-4 pt-4 border-t border-border/70">
                  <h4 className="font-semibold text-lg">Timing Setup</h4>
                  <RadioGroup value={timerType} onValueChange={setTimerType} className="flex space-x-6">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="overall" id="overall" /><Label htmlFor="overall">Overall Timer</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="per_question" id="per_question" /><Label htmlFor="per_question">Per-Question Timer</Label></div>
                  </RadioGroup>
              
                  {timerType === 'overall' && (
                      <div className="space-y-2 max-w-sm">
                          <Label htmlFor="timer">Overall Timer (minutes)</Label>
                          <Input id="timer" type="number" value={timer} onChange={(e) => setTimer(e.target.value)} required min="1" className="h-10 focus-visible:ring-primary" />
                      </div>
                  )}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground/90">Questions List</h3>
              {questions.map((q, qIndex) => (
                <div key={qIndex} 
                     className={cn("p-6 border-2 rounded-xl relative transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
                                   "animate-in fade-in slide-in-from-bottom-2")}
                     style={{ animationDelay: `${qIndex * 50}ms` }}>
                  
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/70">
                      <Label className="text-xl font-bold text-primary">Question {qIndex + 1}</Label>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeQuestion(qIndex)} className="shadow-md hover:shadow-lg">
                          <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* --- START: Feature 4: Question Type Selector --- */}
                    <div className="space-y-2">
                        <Label className="font-semibold">Question Type</Label>
                        <Select value={q.type} onValueChange={(value) => handleQuestionChange(qIndex, 'type', value)}>
                            <SelectTrigger className="w-full h-10 focus-visible:ring-primary"><SelectValue placeholder="Select Question Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                <SelectItem value="true-false">True/False</SelectItem>
                                <SelectItem value="fill-in-the-blank">Fill-in-the-Blanks</SelectItem>
                                <SelectItem value="short-answer">Short Answer (Keywords)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* --- END: Feature 4: Question Type Selector --- */}
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <Textarea 
                          className={cn(
                              (timerType === 'per_question' ? "md:col-span-4" : "md:col-span-5"),
                              "placeholder:text-muted-foreground/60 min-h-[100px] focus-visible:ring-primary"
                          )} 
                          placeholder="Enter the question text here..." 
                          value={q.text} 
                          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)} 
                          required 
                      />
                      {timerType === 'per_question' && (
                          <div className="space-y-2 md:col-span-1">
                              <Label htmlFor={`q${qIndex}-timer`} className="font-semibold">Timer (sec)</Label>
                              <Input id={`q${qIndex}-timer`} type="number" min="5" value={q.timer} onChange={(e) => handleQuestionChange(qIndex, 'timer', e.target.value)} required className="h-10 text-center focus-visible:ring-primary" />
                          </div>
                      )}
                    </div>

                    {/* --- START: Feature 4: Dynamic Answer Inputs --- */}
                    {/* Multiple Choice Options and Radio Selector */}
                    {q.type === 'multiple-choice' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold mt-4">Options & Correct Answer</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIndex) => (
                                    <Input 
                                        key={oIndex} 
                                        placeholder={`Option ${oIndex + 1}`} 
                                        value={opt} 
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                                        required 
                                        className="h-10 focus-visible:ring-primary"
                                    />
                                ))}
                            </div>
                            <div>
                                <Label className="font-semibold">Select Correct Option</Label>
                                <RadioGroup 
                                    value={q.correctAnswerIndex.toString()} 
                                    onValueChange={(value) => handleQuestionChange(qIndex, 'correctAnswerIndex', value)} 
                                    className="mt-2 grid grid-cols-2 gap-4"
                                >
                                    {q.options.map((_, oIndex) => (
                                        <div key={oIndex} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-secondary/70">
                                            <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}-o${oIndex}`} />
                                            <Label htmlFor={`q${qIndex}-o${oIndex}`}>Option {oIndex + 1}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    )}
                    
                    {/* True/False Selector */}
                    {q.type === 'true-false' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold mt-4">Correct Answer</h4>
                            <div>
                                <RadioGroup 
                                    value={q.correctAnswerIndex.toString()} 
                                    onValueChange={(value) => handleQuestionChange(qIndex, 'correctAnswerIndex', value)} 
                                    className="mt-2 flex space-x-8"
                                >
                                    <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-secondary/70"><RadioGroupItem value="0" id={`q${qIndex}-t`} /><Label htmlFor={`q${qIndex}-t`}>True</Label></div>
                                    <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-secondary/70"><RadioGroupItem value="1" id={`q${qIndex}-f`} /><Label htmlFor={`q${qIndex}-f`}>False</Label></div>
                                </RadioGroup>
                            </div>
                        </div>
                    )}

                    {/* Fill-in-the-Blank and Short Answer Input */}
                    {(q.type === 'fill-in-the-blank' || q.type === 'short-answer') && (
                        <div className="space-y-2">
                            <Label htmlFor={`q${qIndex}-correct-text`} className="font-semibold">
                                Correct Answer(s) (Comma separated, e.g., 'Paris, France, City of Light')
                            </Label>
                            <Input 
                                id={`q${qIndex}-correct-text`} 
                                placeholder="Enter correct keyword(s) or exact answer(s)"
                                value={q.correctAnswerIndex} 
                                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswerIndex', e.target.value)} 
                                required 
                                className="h-12 focus-visible:ring-primary"
                            />
                            <p className="text-sm text-muted-foreground">
                                All entries will be compared in a case-insensitive manner. For short answer, list multiple acceptable keywords.
                            </p>
                        </div>
                    )}
                    {/* --- END: Feature 4: Dynamic Answer Inputs --- */}
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addQuestion} className="h-10 shadow-md hover:shadow-lg border-primary/50 text-primary hover:bg-primary/10">
                <PlusCircle className="w-4 h-4 mr-2" />Add Question
            </Button>
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="h-12 px-8 text-lg shadow-primary/40 hover:shadow-primary/60">
                    {isLoading ? 'Saving...' : (isEditMode ? 'Update Quiz' : 'Create Quiz')}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuizFormPage;
