import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CourseCard } from "@/components/home/CourseCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const categories = [
  "All",
  "Technology",
  "Business",
  "Creative",
  "Personal Growth",
  "Marketing",
  "Science",
];

const allCourses = [
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
  {
    id: "7",
    title: "Introduction to Machine Learning",
    description: "Understand ML concepts through intuitive explanations and practical examples.",
    category: "Technology",
    duration: "12 weeks",
    students: 4521,
    rating: 4.7,
    modules: 18,
  },
  {
    id: "8",
    title: "Public Speaking for Introverts",
    description: "Build confidence in public speaking with techniques designed for quiet achievers.",
    category: "Personal Growth",
    duration: "4 weeks",
    students: 876,
    rating: 4.8,
    modules: 7,
  },
  {
    id: "9",
    title: "Financial Literacy Essentials",
    description: "Master personal finance with step-by-step guidance and practical tools.",
    category: "Business",
    duration: "6 weeks",
    students: 2987,
    rating: 4.6,
    modules: 11,
  },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Courses
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover personalized courses created by our community
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-12 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer text-sm py-2 px-4 transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No courses found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
