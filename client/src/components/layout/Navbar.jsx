import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/slices/authSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, History, PlusCircle, Award, Heart } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Avatar from '@/components/ui/Avatar';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Enhanced class for navigation links
  const navLinkClass = "text-lg font-medium text-foreground/80 hover:text-primary transition-colors hover:scale-[1.02] relative group";
  
  const navLinks = (
    <>
      <NavLink to="/" 
        className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} 
        onClick={closeMenu}>
        Home
        {/* Subtle underline effect */}
        <span className="absolute bottom-0 left-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </NavLink>
      <NavLink to="/about" 
        className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} 
        onClick={closeMenu}>
        About
        <span className="absolute bottom-0 left-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </NavLink>
      <NavLink to="/contact" 
        className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} 
        onClick={closeMenu}>
        Contact
        <span className="absolute bottom-0 left-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </NavLink>
      
      {/* ADDED: Donate Link with unique destructive/red color accent */}
      <NavLink to="/donate" 
        className={({isActive}) => cn(navLinkClass, 'text-destructive hover:text-destructive/80', {'text-destructive font-extrabold': isActive})} 
        onClick={closeMenu}>
        <Heart className="w-5 h-5 mr-1 fill-destructive drop-shadow-md inline-block align-text-bottom" /> 
        Donate
        <span className="absolute bottom-0 left-0 h-[2px] bg-destructive scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
      </NavLink>
    </>
  );

  return (
    // Backdrop blur and border accent for modern glassy look
    <header className="bg-card/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-primary/20">
      
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
          {/* Logo height set to h-16 for prominence */}
          <img src={logo} alt="ParikshaNode Logo" className="h-16" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Desktop Auth Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    // FIX APPLIED: Explicitly enforce dimensions and flex properties on the button 
                    // to ensure the Avatar component renders its circular form correctly.
                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full ring-offset-card transition-shadow duration-300 shadow-md hover:shadow-xl w-10 h-10 flex-shrink-0 flex items-center justify-center"
                  >
                    <Avatar src={user.avatar?.url} alt={user.username} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 shadow-2xl border-primary/30 animate-in zoom-in-90 duration-200">
                  <DropdownMenuLabel className="font-extrabold text-primary flex items-center gap-2">
                    <Award className="w-4 h-4 fill-primary/30" /> Hi, {user.username}!
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <Link to="/admin"><DropdownMenuItem className="cursor-pointer hover:bg-secondary"><LayoutDashboard className="w-4 h-4 mr-3" />Admin Panel</DropdownMenuItem></Link>
                  )}
                  <Link to="/profile"><DropdownMenuItem className="cursor-pointer hover:bg-secondary"><UserIcon className="w-4 h-4 mr-3" />Your Profile</DropdownMenuItem></Link>
                  <Link to="/my-quizzes"><DropdownMenuItem className="cursor-pointer hover:bg-secondary"><PlusCircle className="w-4 h-4 mr-3" />My Quizzes</DropdownMenuItem></Link>
                  <Link to="/history"><DropdownMenuItem className="cursor-pointer hover:bg-secondary"><History className="w-4 h-4 mr-3" />Quiz History</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm" className="text-foreground/90 hover:text-primary">Login</Button></Link>
                <Link to="/register"><Button size="sm" className="shadow-lg hover:shadow-xl transition-shadow duration-300">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="text-foreground/90 hover:bg-primary/10 transition-colors">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={cn(
            "md:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-md shadow-2xl border-t border-primary/30",
            "animate-in slide-in-from-top-1 duration-300" // Mobile menu entrance animation
        )}>
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks}
            <div className="pt-4 border-t border-border/50 flex flex-col gap-4">
              {user ? (
                <>
                  <Link to="/profile" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><UserIcon className="w-4 h-4 mr-3" />Profile</Button></Link>
                  <Link to="/my-quizzes" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><PlusCircle className="w-4 h-4 mr-3" />My Quizzes</Button></Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><LayoutDashboard className="w-4 h-4 mr-3" />Admin</Button></Link>}
                  <Button onClick={handleLogout} variant="destructive" className="shadow-lg">Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}><Button variant="outline" className="w-full">Login</Button></Link>
                  <Link to="/register" onClick={closeMenu}><Button className="w-full">Sign Up</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
