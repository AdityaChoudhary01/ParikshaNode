import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Github, Linkedin, Twitter, Heart, FileText, Lock, Scale } from 'lucide-react'; // Added legal icons
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils'; // Import cn for enhanced styling

const Layout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer - Ultra Modern Design */}
      <footer className="bg-card text-foreground border-t border-primary/20 shadow-2xl shadow-primary/10">
        <div className="container mx-auto py-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Column 1: Logo & Mission */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <img src={logo} alt="ParikshaNode Logo" className="h-16 drop-shadow-lg" />
              <p className="text-muted-foreground text-md max-w-xs">
                Our mission is to make learning engaging and accessible for everyone through a modern, interactive quiz platform.
              </p>
              <Link to="/donate" className="flex items-center text-primary hover:text-primary/80 transition-colors font-medium text-sm pt-2">
                <Heart className="w-4 h-4 mr-1 fill-primary/50" /> Support the Project
              </Link>
            </div>

            {/* Column 2: Navigation & Legal Links */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h3 className="font-extrabold text-xl text-primary">Navigate & Legal</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/" className="text-lg hover:text-primary transition-colors hover:font-semibold">Home</Link></li>
                <li><Link to="/about" className="text-lg hover:text-primary transition-colors hover:font-semibold">About Us</Link></li>
                <li><Link to="/contact" className="text-lg hover:text-primary transition-colors hover:font-semibold">Contact</Link></li>
                {/* NEW LEGAL LINKS */}
                <li>
                  <Link to="/terms" className="text-lg hover:text-primary transition-colors hover:font-semibold flex items-center gap-2">
                    <Scale className="w-4 h-4 text-destructive" /> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-lg hover:text-primary transition-colors hover:font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/dmca" className="text-lg hover:text-primary transition-colors hover:font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-500" /> DMCA / Copyright
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Connect */}
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h3 className="font-extrabold text-xl text-primary">Connect</h3>
              <div className="flex space-x-5">
                {/* Social Icon Styling with Hover Effect */}
                <a href="https://x.com/X" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                  <Twitter className="w-7 h-7" />
                </a>
                <a href="https://github.com/AdityaChoudhary01" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                  <Github className="w-7 h-7" />
                </a>
                <a href="https://www.linkedin.com/in/aditya-kumar-38093a304/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-7 h-7" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">Follow us for updates and new quizzes.</p>
            </div>

          </div>

          <div className="mt-12 pt-6 border-t border-border/70 text-center text-muted-foreground text-sm">
            <p>&copy; {currentYear} ParikshaNode App. A Final Year Project by GNIOT Students. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
