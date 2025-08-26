import { Link, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Github, Linkedin, Twitter } from 'lucide-react';
import logo from '@/assets/logo.png';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-secondary text-secondary-foreground border-t">
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
           
            <div className="space-y-4">
          
              <img src={logo} alt="ParikshaNode Logo" className="h-14" />
              <p className="text-muted-foreground">
                Our mission is to make learning engaging and accessible for everyone through a modern, interactive quiz platform.
              </p>
            </div>

            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Navigate</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/donate" className="hover:text-primary transition-colors">Donate</Link></li>
              </ul>
            </div>

            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-border/50 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} ParikshaNode App. A Final Year Project by GNIOT Students. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
