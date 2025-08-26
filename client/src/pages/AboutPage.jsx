import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Code, Database, Palette, Wind, Github, Linkedin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// ---- START: Updated Team Information with Social Links ----
const teamMembers = [
  {
    name: 'Aditya Choudhary',
    role: 'Project Lead & Full-Stack Developer',
    bio: 'Aditya spearheaded the project, architecting the full-stack MERN application and ensuring seamless integration between the frontend and backend. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
    imagePlaceholder: <Code className="w-16 h-16 text-muted-foreground" />,
    github: 'https://github.com/AdityaChoudhary01',
    linkedin: 'https://www.linkedin.com/in/aditya-kumar-38093a304/',
  },
  {
    name: 'Suraj Mishra',
    role: 'Backend Developer',
    bio: 'Suraj was instrumental in building the robust backend, focusing on the Express API, MongoDB database schemas, and server-side logic. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
    imagePlaceholder: <Database className="w-16 h-16 text-muted-foreground" />,
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/in/suraj-mishra-a1b161258',
  },
  {
    name: 'Amrita Yadav',
    role: 'Frontend Developer',
    bio: 'Amrita brought the application to life with her expertise in React and state management, building the interactive quiz and user dashboard components. She is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
    imagePlaceholder: <Users className="w-16 h-16 text-muted-foreground" />,
    github: 'https://github.com/amritalearns',
    linkedin: 'https://www.linkedin.com/in/amrita-yadav-a28192292/',
  },
  {
    name: 'Sachin Mourya',
    role: 'UI/UX Designer',
    bio: 'Sachin is the creative force behind the visually appealing and intuitive design, responsible for the theme, dark mode, and overall user experience. He is a final year B.Tech CSE student at GNIOT, from the 2022-2026 batch.',
    imagePlaceholder: <Palette className="w-16 h-16 text-muted-foreground" />,
    github: 'https://github.com/sachn2k4',
    linkedin: 'www.linkedin.com/in/sachin-mourya-905148247',
  },
];
// ---- END: Updated Team Information ----

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | ParikshaNode App</title>
        <meta name="description" content="Learn about the student team and the mission behind the ParikshaNode App project." />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">About ParikshaNode</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            We're on a mission to make knowledge accessible and engaging for everyone.
          </p>
        </section>

        {/* Our Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
            <p className="text-muted-foreground">
              ParikshaNode started as a final year project at GNIOT, Greater Noida. As Computer Science students, we wanted to build a practical, real-world application that could be genuinely useful. We saw an opportunity to create a modern, ad-free quiz platform that we and our peers would actually want to use.
            </p>
            <p className="text-muted-foreground">
              This app is the culmination of our collective skills in full-stack development and UI/UX design, representing countless hours of coding and collaboration from our 2022-2026 batch.
            </p>
          </div>
          <div className="w-full rounded-lg overflow-hidden shadow-md">
            <img
              src="https://img.jagranjosh.com/images/2022/July/1572022/GNIOT.jpg"
              alt="GNIOT Campus"
              className="w-full h-auto object-cover"
              style={{ minHeight: '200px' }}
            />
          </div>
        </section>

        {/* Meet the Team Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Meet the Team</h2>
          <p className="mt-2 text-muted-foreground">The final year CSE students behind ProQuiz.</p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-secondary rounded-full mx-auto flex items-center justify-center mb-4">
                    {member.imagePlaceholder}
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Github /></a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary"><Linkedin /></a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Technology Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Built with Modern Technology</h2>
          <p className="mt-2 text-muted-foreground">We use a powerful and scalable stack to deliver a seamless experience.</p>
          <div className="max-w-3xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-2"><Database className="w-12 h-12 text-primary" /><p className="font-semibold">MongoDB</p></div>
            <div className="flex flex-col items-center space-y-2"><p className="text-4xl font-extrabold">Ex</p><p className="font-semibold">Express.js</p></div>
            <div className="flex flex-col items-center space-y-2"><Code className="w-12 h-12 text-primary" /><p className="font-semibold">React</p></div>
            <div className="flex flex-col items-center space-y-2"><p className="text-4xl font-extrabold">N</p><p className="font-semibold">Node.js</p></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;


