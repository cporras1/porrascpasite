import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HomeHeader } from '../components/HomeHeader';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { BlogSection } from '../components/BlogSection';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const scrollToElement = () => {
        const elementId = location.hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          const headerHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      setTimeout(scrollToElement, 800);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
