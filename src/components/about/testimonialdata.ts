// src/components/about/testimonialdata.ts

export interface Testimonial {
  name: string;
  role: string;
  message: string;
  imageUrl?: string;
  rating?: number; 
}

export const testimonials: Testimonial[] = [
  {
    name: "Jane ",
    role: "Patient",
    message: "SwiftCare made it so easy to book an appointment. Highly recommended!",
    imageUrl: "/avatars/patient1.jpg",
  },
  {
    name: "Dr. John Smith",
    role: "Doctor",
    message: "Managing my appointments has never been smoother. SwiftCare is brilliant!",
    imageUrl: "/avatars/doctor1.jpg",
  },
  {
    name: "Grace Kim",
    role: "Admin",
    message: "I love how easy it is to respond to complaints and monitor activity.",
    imageUrl: "/avatars/admin1.jpg",
  },
];
