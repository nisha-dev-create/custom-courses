import { CourseCard } from "./CourseCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sampleCourses = [
  {
    id: "1",
    title: "Full-Stack Web Development for Visual Learners",
    description: "Learn web development through interactive diagrams, visual explanations, and hands-on projects.",
    category: "Technology",
    duration: "8 weeks",
    students: 2340,
    rating: 4.8,
    modules: 12,
  },
  {
    id: "2",
    title: "Creative Writing: Unlock Your Inner Storyteller",
    description: "Develop your unique writing voice with exercises tailored to your personality type.",
    category: "Creative",
    duration: "6 weeks",
    students: 1567,
    rating: 4.9,
    modules: 8,
  },
  {
    id: "3",
    title: "Data Science for Business Professionals",
    description: "Master data analysis concepts with real-world business applications and case studies.",
    category: "Business",
    duration: "10 weeks",
    students: 3421,
    rating: 4.7,
    modules: 15,
  },
  {
    id: "4",
    title: "Mindful Productivity for Introverts",
    description: "Build sustainable work habits that align with your energy patterns and preferences.",
    category: "Personal Growth",
    duration: "4 weeks",
    students: 987,
    rating: 4.9,
    modules: 6,
  },
  {
    id: "5",
    title: "Digital Marketing Fundamentals",
    description: "Learn marketing strategies adapted to your communication style and goals.",
    category: "Marketing",
    duration: "5 weeks",
    students: 2156,
    rating: 4.6,
    modules: 10,
  },
  {
    id: "6",
    title: "Photography Basics for Analytical Minds",
    description: "Master composition and technique through systematic learning and logical frameworks.",
    category: "Creative",
    duration: "6 weeks",
    students: 1234,
    rating: 4.8,
    modules: 9,
  },
];

export const PopularCoursesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Popular Courses
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover courses loved by our community
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/explore" className="gap-2">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
};
