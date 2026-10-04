import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Browse from './pages/Browse';
import BookDetails from './pages/BookDetails';
import Categories from './pages/Categories';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FutureScope from './pages/FutureScope';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookForm from './pages/BookForm';
import MyListings from './pages/MyListings';
import MyRequests from './pages/MyRequests';
import Transactions from './pages/Transactions';
import Profile from './pages/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBooks from './pages/admin/AdminBooks';
import AdminCategories from './pages/admin/AdminCategories';
import AdminRequests from './pages/admin/AdminRequests';
import AdminTransactions from './pages/admin/AdminTransactions';

function Protected({ children, admin }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container section">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/future-scope" element={<FutureScope />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/books/new" element={<Protected><BookForm /></Protected>} />
        <Route path="/books/:id/edit" element={<Protected><BookForm /></Protected>} />
        <Route path="/my-listings" element={<Protected><MyListings /></Protected>} />
        <Route path="/requests" element={<Protected><MyRequests /></Protected>} />
        <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/admin" element={<Protected admin><AdminLayout /></Protected>}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>
        <Route path="*" element={<div className="container section"><h2>404 — Page not found</h2></div>} />
      </Routes>
    </Layout>
  );
}
