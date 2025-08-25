import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFetch } from '@/hooks/useFetch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/Loader';
import { Clock, HelpCircle, Tag, BookOpen, LayoutDashboard, BarChart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
const HomePage = () => {
  const { data: quizzes, isLoading, error } = useFetch('/quizzes');
  const { user } = useSelector((state) => state.auth);

  const handleBrowseClick = (e) => {
    e.preventDefault();
    const quizSection = document.getElementById('quizzes');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
    <Helmet>
      <title>ParikshaNode | Master Any Subject, One Quiz at a Time</title>
      <meta name="description" content="An advanced MERN stack quiz platform to create, share, and take quizzes. Perfect for students and professionals to test and enhance their knowledge." />
    </Helmet>
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">
          Master Any Subject, One Quiz at a Time
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          ParikshaNode offers a modern, engaging platform to create, share, and take quizzes. Sharpen your skills, challenge friends, and track your progress with our intuitive tools.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" onClick={handleBrowseClick}>
            Browse Quizzes
          </Button>
          {user ? (
            user.role === 'admin' ? (
              <Link to="/admin">
                <Button size="lg" variant="outline">Admin Dashboard</Button>
              </Link>
            ) : (
              <Link to="/history">
                <Button size="lg" variant="outline">My History</Button>
              </Link>
            )
          ) : (
            <Link to="/register">
              <Button size="lg" variant="outline">Get Started</Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Why Choose ParikshaNode?</h2>
        <p className="mt-2 text-muted-foreground">Everything you need in a modern quiz platform.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full"><BookOpen className="w-8 h-8 text-primary" /></div>
              <CardTitle>Diverse Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">From programming to history, find quizzes on a wide range of subjects.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full"><LayoutDashboard className="w-8 h-8 text-primary" /></div>
              <CardTitle>Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Easily create, edit, and manage your own quizzes with a powerful admin interface.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/10 rounded-full"><BarChart className="w-8 h-8 text-primary" /></div>
              <CardTitle>Instant Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get immediate feedback with detailed answer reviews and track your performance.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Get Started in 3 Easy Steps</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-primary bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">1</div>
                  <h3 className="text-xl font-semibold">Browse</h3>
                  <p className="text-muted-foreground mt-2">Explore our growing library of quizzes on various topics.</p>
              </div>
              <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-primary bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">2</div>
                  <h3 className="text-xl font-semibold">Take the Quiz</h3>
                  <p className="text-muted-foreground mt-2">Challenge yourself with our timed, interactive quiz interface.</p>
              </div>
              <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-primary bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">3</div>
                  <h3 className="text-xl font-semibold">Achieve</h3>
                  <p className="text-muted-foreground mt-2">Get your score, review answers, and climb the leaderboard.</p>
              </div>
          </div>
      </section>

      {/* Quiz List Section */}
      <section id="quizzes">
        <h2 className="text-3xl font-bold tracking-tight text-center">Explore Our Quizzes</h2>
        <div className="mt-8">
          {isLoading && <Loader />}
          {error && <p className="text-center text-destructive">Error: {error}</p>}
          {quizzes && quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizzes.slice(0, 6).map((quiz) => (
                <Card key={quiz._id} className="flex flex-col transition-transform transform hover:-translate-y-2">
                  <CardHeader>
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground"><Tag className="w-4 h-4 mr-2 text-primary" /><span>{quiz.category}</span></div>
                    <div className="flex items-center text-sm text-muted-foreground"><HelpCircle className="w-4 h-4 mr-2 text-primary" /><span>{quiz.questions.length} Questions</span></div>
                  </CardContent>
                  <CardFooter><Link to={`/quiz/${quiz._id}`} className="w-full"><Button className="w-full">Start Quiz</Button></Link></CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-10">No quizzes available at the moment.</p>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Loved by Learners Across India</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <blockquote className="italic text-muted-foreground">"Excellent for brushing up on my data structures knowledge. The admin panel is very intuitive for creating custom tests."</blockquote>
              <p className="font-semibold mt-4">- Rohan Sharma</p>
              <p className="text-sm text-muted-foreground">SDE at Infosys, Bengaluru</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="italic text-muted-foreground">"The clean UI and dark mode are perfect for late-night study sessions before my semester exams. A must-have tool!"</blockquote>
              <p className="font-semibold mt-4">- Priya Singh</p>
              <p className="text-sm text-muted-foreground">Student at IIT Delhi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <blockquote className="italic text-muted-foreground">"As a UPSC aspirant, the ability to take timed quizzes on history and polity has been invaluable for my preparation."</blockquote>
              <p className="font-semibold mt-4">- Anjali Gupta</p>
              <p className="text-sm text-muted-foreground">UPSC Aspirant</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
    </>
  );
};


export default HomePage;
