import React from "react";
import { ChevronDown } from "lucide-react"; // optional scroll hint icon

const Hero = () => {
  return (
    <section className="relative w-full h-[600px] group overflow-hidden">
      {/* Background image (base) */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-1000 ease-in-out z-0"
        style={{
          backgroundImage: "url('/avatars/hero1.jpg')",
        }}
      />

      {/* Hover background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 scale-105 transition-opacity duration-1000 ease-in-out z-0"
        style={{
          backgroundImage: "url('/avatars/hero2.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          SwiftCare
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
          Book appointments, manage prescriptions, and consult with expert doctors—
          all in one secure platform.
        </p>
        <div className="mt-6 flex gap-4 flex-wrap justify-center">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
          <button className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">
            Learn More
          </button>
        </div>

        {/* Optional scroll hint icon */}
        <div className="mt-12 animate-bounce">
          <ChevronDown size={32} className="text-white/80" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
