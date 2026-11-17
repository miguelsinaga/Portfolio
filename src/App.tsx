import { Route, Routes, useLocation } from 'react-router-dom';
import { TransitionProvider } from './context/Transition';
import { Cursor } from './components/Cursor';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Project } from './pages/Project';

export default function App() {
  const location = useLocation();

  return (
    <TransitionProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      {/* Keyed by path so each page mounts fresh and plays its own intro. */}
      <main id="main" tabIndex={-1} key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Cursor />
    </TransitionProvider>
  );
}
