import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Users, Menu, X, Shield, Zap } from 'lucide-react'; // Added Shield and Zap
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Enhanced class for navigation links
  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center px-4 py-3 text-lg text-muted-foreground rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 ease-in-out",
      { 
        "bg-primary/10 text-primary font-semibold shadow-md shadow-primary/20": isActive, 
        "text-foreground/90": !isActive && !isSidebarOpen 
      }
    );

  const sidebarContent = (
    <nav className="space-y-3">
      <NavLink to="/admin" end className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <LayoutDashboard className="w-6 h-6 mr-3" /> Dashboard
      </NavLink>
      <NavLink to="/admin/quizzes" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <ListChecks className="w-6 h-6 mr-3" /> Manage Quizzes
      </NavLink>
      <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <Users className="w-6 h-6 mr-3" /> Manage Users
      </NavLink>
      {/* Example of new admin feature link */}
      <div className="flex items-center px-4 py-3 text-sm text-secondary-foreground rounded-lg bg-destructive/10 border border-destructive/50 mt-4">
        <Zap className="w-5 h-5 mr-3 text-destructive" /> AI Operations
      </div>
    </nav>
  );

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Mobile Sidebar Overlay - Darker and blurrier effect */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100 block" : "opacity-0 hidden"
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      
      {/* Sidebar - Glass effect, strong shadow, and border accent */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card/95 backdrop-blur-xl p-6 border-r border-primary/20 transform transition-transform duration-300 ease-in-out shadow-2xl shadow-primary/20 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h2 className="text-2xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive flex items-center gap-2">
            <Shield className="w-7 h-7" /> Admin Panel
        </h2>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:ml-64">
        {/* Mobile Header with Hamburger Button */}
        <div className="lg:hidden flex items-center justify-between mb-6 border-b border-border/70 pb-4">
          <h1 className="text-2xl font-bold ml-1">Admin Panel</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-foreground/90 hover:bg-primary/10">
            {isSidebarOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </Button>
        </div>
        
        {/* Outlet content for dashboard/quiz management */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
