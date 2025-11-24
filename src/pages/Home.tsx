import { HomeHeader } from '../components/HomeHeader';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { BlogSection } from '../components/BlogSection';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function Home() {
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
