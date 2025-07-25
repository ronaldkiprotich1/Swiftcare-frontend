// src/components/about/Testimonials.tsx

import { testimonials } from "./testimonialdata";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <TestimonialCard testimonial={t} key={i} />
      ))}
    </div>
  );
};

export default Testimonials;
