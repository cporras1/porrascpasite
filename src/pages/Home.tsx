import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Services } from '../components/Services';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
