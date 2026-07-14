  import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
  import { AnimatePresence } from 'motion/react';
  import { Suspense, lazy } from 'react';
  import Layout from './components/Layout';
  import SmoothScroll from './components/SmoothScroll';
  import LoadingScreen from './components/LoadingScreen';
  import CustomCursor from './components/CustomCursor';

  const Home = lazy(() => import('./pages/Home'));
  const About = lazy(() => import('./pages/About'));
  const Services = lazy(() => import('./pages/Services'));
  const Works = lazy(() => import('./pages/Works'));
  const WorkDetail = lazy(() => import('./pages/WorkDetail'));
  const Contact = lazy(() => import('./pages/Contact'));

  function PageLoader() {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-ayuta-pink animate-spin" />
        <span className="mt-6 text-[9px] uppercase tracking-[0.5em] text-white/30 font-medium animate-pulse">
          Loading Page
        </span>
      </div>
    );
  }

  function AppRoutes() {
    const location = useLocation();
    
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes location={location}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="works" element={<Works />} />
            <Route path="works/:slug" element={<WorkDetail />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  export default function App() {
    return (
      <Router>
        {/* <CustomCursor /> */}
        <LoadingScreen />
        <SmoothScroll>
          <AppRoutes />
        </SmoothScroll>
      </Router>
    );

  }
