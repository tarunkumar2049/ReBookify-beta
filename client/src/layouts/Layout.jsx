import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { toast } = useAuth();
  return (
    <>
      <Header />
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <main className="main">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
