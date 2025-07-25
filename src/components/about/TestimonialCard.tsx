// src/components/about/TestimonialCard.tsx
import type { Testimonial } from "./testimonialdata";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: Props) => {
  const stars = Array.from({ length: testimonial.rating || 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
    >
      {/* Quote Icon Background */}
      <Quote className="absolute top-4 right-4 text-gray-300 opacity-10 w-10 h-10" />

      {/* Header with avatar + name */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <img
            src={testimonial.imageUrl || "/avatars/default.jpg"}
            alt={testimonial.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 group-hover:shadow-xl transition duration-300"
          />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-500 italic">{testimonial.role}</p>
          <div className="flex gap-1 mt-1">
            {stars.map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="mt-4 text-gray-700 text-base leading-relaxed">
        “{testimonial.message}”
      </p>
    </motion.div>
  );
};

export default TestimonialCard;
