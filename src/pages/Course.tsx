import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { Play, CheckCircle, Clock, BookOpen, ArrowLeft } from "lucide-react";

const courseModules = [
  {
    id: 1,
    title: "Introduction & Foundations",
    lessons: [
      { id: 1, title: "Welcome to the Course", duration: "5 min", completed: true },
      { id: 2, title: "Course Overview", duration: "10 min", completed: true },
      { id: 3, title: "Setting Up Your Environment", duration: "15 min", completed: false },
    ],
  },
  {
    id: 2,
    title: "Core Concepts Deep Dive",
    lessons: [
      { id: 4, title: "Understanding the Basics", duration: "20 min", completed: false },
      { id: 5, title: "Key Principles", duration: "25 min", completed: false },
      { id: 6, title: "Best Practices", duration: "15 min", completed: false },
    ],
  },
  {
    id: 3,
    title: "Practical Applications",
    lessons: [
      { id: 7, title: "Hands-on Exercise 1", duration: "30 min", completed: false },
      { id: 8, title: "Hands-on Exercise 2", duration: "30 min", completed: false },
      { id: 9, title: "Building Your First Project", duration: "45 min", completed: false },
    ],
  },
  {
    id: 4,
    title: "Advanced Techniques",
    lessons: [
      { id: 10, title: "Advanced Concepts", duration: "25 min", completed: false },
      { id: 11, title: "Optimization Strategies", duration: "20 min", completed: false },
      { id: 12, title: "Expert Tips", duration: "15 min", completed: false },
    ],
  },
];

const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = courseModules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Course Header */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              In Progress
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Personalized Mastery Course
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              A personalized learning path designed just for you.
            </p>
            
            {/* Progress */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Course Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
            </div>
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            {courseModules.map((module) => (
              <div
                key={module.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {module.id}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        ) : (
                          <Play className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className={`font-medium ${lesson.completed ? "text-muted-foreground" : "text-foreground"}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={lesson.completed ? "outline" : "default"}
                        size="sm"
                      >
                        {lesson.completed ? "Review" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Course;
