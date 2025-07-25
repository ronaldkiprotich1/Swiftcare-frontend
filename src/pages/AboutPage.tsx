// src/pages/AboutPage.tsx
import { motion } from "framer-motion";
import Testimonials from "../components/about/Testimonials";
import { Link } from "react-router-dom";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  return (
    <div className="px-4 py-12 max-w-5xl mx-auto text-gray-800">
      {/* Title */}
      <motion.section
        className="mb-16 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">About SwiftCare</h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          SwiftCare is a modern healthcare appointment and patient management system designed to
          streamline the medical experience for both patients and healthcare providers.
          From booking consultations to prescriptions — SwiftCare puts healthcare in your hands.
        </p>
      </motion.section>

      {/* Mission */}
      <motion.section
        className="bg-blue-50 p-6 md:p-10 rounded-xl shadow-md mb-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-blue-600">Our Mission</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We aim to digitize and simplify healthcare by providing an intuitive platform where patients
          can connect with licensed doctors, manage appointments, and access treatment records securely —
          while empowering providers to focus on delivering excellent care.
        </p>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="mb-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        variants={fadeInUp}
      >
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-600 text-center">
          What People Say
        </h2>
        <Testimonials />
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        className="text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        variants={fadeInUp}
      >
        <p className="text-gray-600 text-lg">
          Have questions?{" "}
          <Link
            to="/contact"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            Contact us
          </Link>
        </p>
      </motion.section>
    </div>
  );
};

export default AboutPage;
