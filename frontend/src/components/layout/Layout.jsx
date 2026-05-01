import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-[57px] md:pl-56">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
