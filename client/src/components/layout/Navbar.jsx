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
import Avatar from '@/components/ui/Avatar'; // Assumed to be the resilient version
import logo from '@/assets/logo.png';

const Navbar = () => {
  const { user, isLoading: isAuthLoading } = useSelector((state) => state.auth); // Assuming Redux state can indicate loading
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

  const navLinkClass = "text-lg font-extrabold text-foreground/70 hover:text-primary transition-all duration-300 hover:scale-[1.05] relative group";
  
  const navLinks = (
    // ... (Your nav links JSX here)
    <>
      <NavLink to="/" className={({isActive}) => cn(navLinkClass, {'text-primary drop-shadow-md': isActive})} onClick={closeMenu}>Home<span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></span></NavLink>
      <NavLink to="/about" className={({isActive}) => cn(navLinkClass, {'text-primary drop-shadow-md': isActive})} onClick={closeMenu}>About<span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></span></NavLink>
      <NavLink to="/contact" className={({isActive}) => cn(navLinkClass, {'text-primary drop-shadow-md': isActive})} onClick={closeMenu}>Contact<span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></span></NavLink>
      <NavLink to="/donate" className={({isActive}) => cn(navLinkClass, 'text-destructive/90 hover:text-destructive/70', {'text-destructive font-extrabold drop-shadow-lg': isActive})} onClick={closeMenu}><Heart className="w-5 h-5 mr-1 fill-destructive drop-shadow-md inline-block align-text-bottom group-hover:scale-110 transition-transform duration-300" /> Donate<span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-1 bg-destructive group-hover:w-full transition-all duration-500 rounded-full"></span></NavLink>
    </>
  );
  
  // 💡 PRO MAX UI: Skeleton for Avatar Area while data is fetching
  const ProfileSkeleton = () => (
    <div className="w-14 h-14 bg-card/70 rounded-full animate-pulse shadow-md ring-2 ring-primary/20"></div>
  );

  return (
    <header className={cn(
        "bg-card/70 backdrop-blur-3xl sticky top-0 z-[100] transition-all duration-300", 
        "shadow-2xl shadow-primary/20 border-b border-primary/30"
    )}>
      
      <nav className="container mx-auto px-4 flex justify-between items-center h-16"> 
        <Link to="/" className="flex items-center transition-transform hover:scale-105 duration-300">
          <img src={logo} alt="ParikshaNode Logo" className="h-16 drop-shadow-md" /> 
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center gap-4">
            
            {/* 🛑 CRITICAL SAFETY CHECK: Show skeleton while loading user data */}
            {isAuthLoading ? (
              <ProfileSkeleton />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="focus:outline-none focus:ring-4 focus:ring-primary/50 focus:ring-offset-2 rounded-full ring-offset-card transition-shadow duration-300 shadow-lg hover:shadow-primary/40 hover:scale-[1.03] w-14 h-14 flex-shrink-0 flex items-center justify-center" 
                  >
                    {/* 🛑 FINAL AVATAR CALL: Ensure optional chaining here for maximum safety */}
                    <Avatar 
                        src={user?.avatar?.url} 
                        alt={user?.username} 
                        size="sm" 
                    /> 
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-64 shadow-2xl border-primary/30 animate-in zoom-in-90 duration-200">
                  <DropdownMenuLabel className="font-extrabold text-primary flex items-center gap-2">
                    <Award className="w-5 h-5 fill-primary/30" /> {user.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={closeMenu}><DropdownMenuItem className="cursor-pointer focus:bg-primary/10"><LayoutDashboard className="w-4 h-4 mr-3" />Admin Panel</DropdownMenuItem></Link>
                  )}
                  <Link to="/profile" onClick={closeMenu}><DropdownMenuItem className="cursor-pointer focus:bg-primary/10"><UserIcon className="w-4 h-4 mr-3" />Your Profile</DropdownMenuItem></Link>
                  <Link to="/my-quizzes" onClick={closeMenu}><DropdownMenuItem className="cursor-pointer focus:bg-primary/10"><PlusCircle className="w-4 h-4 mr-3" />My Quizzes</DropdownMenuItem></Link>
                  <Link to="/history" onClick={closeMenu}><DropdownMenuItem className="cursor-pointer focus:bg-primary/10"><History className="w-4 h-4 mr-3" />Quiz History</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-3" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                {/* User is not logged in */}
                <Link to="/login"><Button variant="ghost" className="text-foreground/80 hover:text-primary transition-all duration-300 font-bold hover:bg-primary/10">Login</Button></Link>
                <Link to="/register"><Button className="shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 hover:scale-[1.03] font-bold">Sign Up</Button></Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button onClick={() => setIsMenuOpen(!isMenuOpen)} variant="ghost" size="icon" className="text-foreground/90 hover:bg-primary/20 transition-colors focus:ring-2 focus:ring-primary/50">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Updated with user check for avatar/skeleton if needed) */}
      {isMenuOpen && (
        <div className={cn(
            "md:hidden absolute top-full left-0 w-full bg-card/80 backdrop-blur-2xl shadow-2xl border-t border-primary/50",
            "animate-in slide-in-from-top-1 duration-300" 
        )}>
          <div className="container mx-auto px-4 py-6 flex flex-col gap-5"> 
            {navLinks}
            <div className="pt-6 border-t border-border/70 flex flex-col gap-4">
              {user ? (
                <>
                  <Link to="/profile" onClick={closeMenu}><Button variant="outline" className="w-full justify-start text-primary border-primary/50 hover:bg-primary/10"><UserIcon className="w-4 h-4 mr-3" />Profile</Button></Link>
                  <Link to="/my-quizzes" onClick={closeMenu}><Button variant="outline" className="w-full justify-start text-foreground/80 hover:bg-primary/10"><PlusCircle className="w-4 h-4 mr-3" />My Quizzes</Button></Link>
                  {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}><Button variant="outline" className="w-full justify-start text-foreground/80 hover:bg-primary/10"><LayoutDashboard className="w-4 h-4 mr-3" />Admin</Button></Link>}
                  <Button onClick={handleLogout} variant="destructive" className="shadow-lg hover:shadow-xl shadow-destructive/30">Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu}><Button variant="outline" className="w-full text-foreground/80 hover:bg-primary/10">Login</Button></Link>
                  <Link to="/register" onClick={closeMenu}><Button className="w-full shadow-lg shadow-primary/30">Sign Up</Button></Link>
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
