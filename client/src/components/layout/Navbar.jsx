import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/app/slices/authSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard, History, PlusCircle } from 'lucide-react';
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

  const navLinkClass = "text-muted-foreground hover:text-primary transition-colors";
  
  const navLinks = (
    <>
      <NavLink to="/" className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} onClick={closeMenu}>Home</NavLink>
      <NavLink to="/about" className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} onClick={closeMenu}>About</NavLink>
      <NavLink to="/contact" className={({isActive}) => cn(navLinkClass, {'text-primary font-semibold': isActive})} onClick={closeMenu}>Contact</NavLink>
    </>
  );

  return (
    <header className="bg-card/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b">
      {/* Removed vertical padding (py-3) to allow logo to fill the height */}
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          {/* Increased height to h-16. Width will scale automatically. */}
          <img src={logo} alt="ParikshaNode Logo" className="h-16" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Desktop Auth Area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full">
                    <Avatar src={user.avatar?.url} alt={user.username} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Hi, {user.username}!</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <Link to="/admin"><DropdownMenuItem><LayoutDashboard className="w-4 h-4 mr-2" />Admin</DropdownMenuItem></Link>
                  )}
                  <Link to="/profile"><DropdownMenuItem><UserIcon className="w-4 h-4 mr-2" />Profile</DropdownMenuItem></Link>
                  <Link to="/my-quizzes"><DropdownMenuItem><PlusCircle className="w-4 h-4 mr-2" />My Quizzes</DropdownMenuItem></Link>
                  <Link to="/history"><DropdownMenuItem><History className="w-4 h-4 mr-2" />Quiz History</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-card shadow-lg border-t">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks}
            <div className="pt-4 border-t border-border/50 flex flex-col gap-4">
              {user ? (
                <>
                  <Link to="/profile" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><UserIcon className="w-4 h-4 mr-2" />Profile</Button></Link>
                  <Link to="/my-quizzes" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><PlusCircle className="w-4 h-4 mr-2" />My Quizzes</Button></Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}><Button variant="outline" className="w-full justify-start"><LayoutDashboard className="w-4 h-4 mr-2" />Admin</Button></Link>}
                  <Button onClick={handleLogout} variant="destructive">Logout</Button>
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
