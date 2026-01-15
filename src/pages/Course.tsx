import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { Play, CheckCircle, Clock, ArrowLeft, Heart, Share2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  modules: number | null;
  created_by: string | null;
}

interface UserCourse {
  id: string;
  status: string;
  progress: number | null;
  is_liked: boolean;
  is_shared: boolean;
  is_completed: boolean;
}

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
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (id && id !== "new") {
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      if (user) {
        const { data: userCourseData } = await supabase
          .from("user_courses")
          .select("*")
          .eq("course_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        setUserCourse(userCourseData);
      }
    } catch (error: any) {
      toast({
        title: "Error loading course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (field: 'is_liked' | 'is_shared' | 'is_completed') => {
    if (!user || !id) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }

    setActionLoading(true);
    try {
      if (userCourse) {
        // Toggle the field
        const newValue = !userCourse[field];
        const updateData: Record<string, boolean | number> = { [field]: newValue };
        
        // If marking as completed, also set progress to 100
        if (field === 'is_completed' && newValue) {
          updateData.progress = 100;
        }

        const { error } = await supabase
          .from("user_courses")
          .update(updateData)
          .eq("id", userCourse.id);

        if (error) throw error;
        setUserCourse({ 
          ...userCourse, 
          [field]: newValue,
          ...(field === 'is_completed' && newValue ? { progress: 100 } : {})
        });
      } else {
        // Create new user_course with the toggled field
        const newCourse = {
          user_id: user.id,
          course_id: id,
          status: "current",
          progress: field === 'is_completed' ? 100 : 0,
          is_liked: field === 'is_liked',
          is_shared: field === 'is_shared',
          is_completed: field === 'is_completed',
        };

        const { data, error } = await supabase
          .from("user_courses")
          .insert(newCourse)
          .select()
          .single();

        if (error) throw error;
        setUserCourse(data);
      }

      const labels = {
        is_liked: userCourse?.[field] ? "Removed from liked" : "Added to liked",
        is_shared: userCourse?.[field] ? "Unshared" : "Shared",
        is_completed: userCourse?.[field] ? "Marked as incomplete" : "Marked as completed",
      };
      toast({ title: labels[field] });
    } catch (error: any) {
      toast({
        title: "Error updating course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const totalLessons = courseModules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = courseModules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const progress = userCourse?.progress ?? Math.round((completedLessons / totalLessons) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadges = () => {
    if (!userCourse) return null;
    const badges = [];
    if (userCourse.status === "current") {
      badges.push(<Badge key="progress" variant="default">In Progress</Badge>);
    }
    if (userCourse.is_completed) {
      badges.push(<Badge key="completed" variant="secondary">Completed</Badge>);
    }
    if (userCourse.is_liked) {
      badges.push(<Badge key="liked" variant="outline">Liked</Badge>);
    }
    if (userCourse.is_shared) {
      badges.push(<Badge key="shared" variant="outline">Shared</Badge>);
    }
    return badges.length > 0 ? badges : null;
  };

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
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {getStatusBadges()}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {course?.title || "Your Personalized Mastery Course"}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {course?.description || "A personalized learning path designed just for you."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                variant={userCourse?.is_liked ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleStatus("is_liked")}
                disabled={actionLoading}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 ${userCourse?.is_liked ? "fill-current" : ""}`} />
                {userCourse?.is_liked ? "Liked" : "Like"}
              </Button>
              <Button
                variant={userCourse?.is_completed ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleStatus("is_completed")}
                disabled={actionLoading}
                className="gap-2"
              >
                <CheckCircle className={`w-4 h-4 ${userCourse?.is_completed ? "fill-current" : ""}`} />
                {userCourse?.is_completed ? "Completed" : "Mark Complete"}
              </Button>
              <Button
                variant={userCourse?.is_shared ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleStatus("is_shared")}
                disabled={actionLoading}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                {userCourse?.is_shared ? "Shared" : "Share"}
              </Button>
            </div>
            
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