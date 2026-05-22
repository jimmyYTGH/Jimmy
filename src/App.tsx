import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import SectionWrapper from "./components/SectionWrapper";

export default function App() {
  return (
    <>
      <CustomCursor />
      <div className="grid-overlay" />
      <Header />
      <main>
        <Hero />
        <SectionWrapper id="about">
          <About />
        </SectionWrapper>
        <SectionWrapper id="skills">
          <Skills />
        </SectionWrapper>
        <SectionWrapper id="projects">
          <Projects />
        </SectionWrapper>
        <SectionWrapper id="contact">
          <Contact />
        </SectionWrapper>
      </main>
      <Footer />
    </>
  );
}
