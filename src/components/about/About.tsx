// src/components/about/About.tsx
import TestimonialCard from "../about/TestimonialCard";
import { testimonials, type Testimonial } from "../about/testimonialdata";

const About = () => {
  return (
    <section className="min-h-screen bg-blue-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
          About SwiftCare
        </h1>
        <p className="text-gray-700 text-center max-w-3xl mx-auto mb-10">
          SwiftCare is a modern healthcare platform designed to streamline the process
          of booking appointments, accessing prescriptions, and managing health records.
        </p>

        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          What Our Users Say
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: Testimonial, i: number) => (
            <TestimonialCard testimonial={t} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
