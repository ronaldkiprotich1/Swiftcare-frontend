// src/pages/LandingPage.tsx
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import Testimonials from "../components/about/Testimonials";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRightCircle, MessageCircle } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Wavy SVG Divider */}
      <div className="-mt-1">
        <svg viewBox="0 0 1440 100" className="w-full">
          <path fill="#f9fafb" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Services Section */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-extrabold text-center mb-12 text-blue-700 flex justify-center items-center gap-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-7 h-7 text-yellow-400" /> Our Services
          </motion.h2>
          <Services />
        </div>
      </section>

      {/* Divider */}
      <div className="-mt-1 rotate-180">
        <svg viewBox="0 0 1440 100" className="w-full">
          <path fill="#ffffff" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2
            className="text-4xl font-extrabold text-center mb-12 text-blue-700"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Users Say
          </motion.h2>
          <Testimonials />
        </div>
      </section>

      {/* Divider */}
      <div className="-mt-1">
        <svg viewBox="0 0 1440 100" className="w-full">
          <path fill="#ebf8ff" d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z" />
        </svg>
      </div>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center relative">
        <motion.div
          className="max-w-3xl mx-auto px-6 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-extrabold mb-6">Ready to take control of your health?</h3>
          <p className="mb-10 text-lg text-blue-100 max-w-2xl mx-auto">
            Join thousands of patients and doctors using SwiftCare to manage appointments, prescriptions, and care.
          </p>
          <Link
            to="/register"
            className="relative inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all duration-300"
          >
            <span className="z-10">Get Started</span>
            <ArrowRightCircle className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>

        {/* Bokeh light effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
      </section>

      {/* Floating Chat Support Button */}
      <Link
        to="/support"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
};

export default LandingPage;
