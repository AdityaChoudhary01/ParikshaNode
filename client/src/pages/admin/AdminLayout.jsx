import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    cn(
      "flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-secondary hover:text-foreground",
      { "bg-primary/10 text-primary font-semibold": isActive }
    );

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/admin" end className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
      </NavLink>
      <NavLink to="/admin/quizzes" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <ListChecks className="w-5 h-5 mr-3" /> Manage Quizzes
      </NavLink>
      <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
        <Users className="w-5 h-5 mr-3" /> Manage Users
      </NavLink>
    </nav>
  );

  return (
    <div className="relative min-h-screen lg:flex">
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
          isSidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card p-4 border-r transform transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:ml-64">
        {/* Mobile Header with Hamburger Button */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold ml-4">Admin Panel</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X/> : <Menu/>}
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
