import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2, BookOpen, Heart, Share2, CheckCircle, Plus, Library as LibraryIcon } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  duration: string | null;
  modules: number | null;
  image_url: string | null;
}

interface UserCourse {
  id: string;
  status: string;
  progress: number;
  course: Course;
}

const Library = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [currentCourses, setCurrentCourses] = useState<UserCourse[]>([]);
  const [completedCourses, setCompletedCourses] = useState<UserCourse[]>([]);
  const [likedCourses, setLikedCourses] = useState<UserCourse[]>([]);
  const [sharedCourses, setSharedCourses] = useState<UserCourse[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchLibrary();
    }
  }, [user]);

  const fetchLibrary = async () => {
    if (!user) return;

    try {
      // Fetch created courses
      const { data: created } = await supabase
        .from("courses")
        .select("*")
        .eq("created_by", user.id);

      setCreatedCourses(created || []);

      // Fetch user courses with course details
      const { data: userCourses } = await supabase
        .from("user_courses")
        .select(`
          id,
          status,
          progress,
          course:courses(*)
        `)
        .eq("user_id", user.id);

      if (userCourses) {
        const coursesWithDetails = userCourses.filter(uc => uc.course) as UserCourse[];
        setCurrentCourses(coursesWithDetails.filter(uc => uc.status === "current"));
        setCompletedCourses(coursesWithDetails.filter(uc => uc.status === "completed"));
        setLikedCourses(coursesWithDetails.filter(uc => uc.status === "liked"));
        setSharedCourses(coursesWithDetails.filter(uc => uc.status === "shared"));
      }
    } catch (error: any) {
      toast({
        title: "Error loading library",
        description: error.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const CourseCard = ({ course, progress, courseId }: { course: Course; progress?: number; courseId?: string }) => (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/course/${courseId || course.id}`)}
    >
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
        {course.image_url ? (
          <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {course.description || "No description"}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{course.category || "Uncategorized"}</span>
          {progress !== undefined && (
            <span className="text-primary font-medium">{progress}% complete</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button asChild>
        <Link to="/create">
          <Plus className="w-4 h-4 mr-2" />
          Create a Course
        </Link>
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <LibraryIcon className="w-8 h-8 text-primary" />
                My Library
              </h1>
              <p className="text-muted-foreground mt-1">
                All your courses in one place
              </p>
            </div>
            <Button asChild>
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="created" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Created</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{createdCourses.length}</span>
              </TabsTrigger>
              <TabsTrigger value="current" className="flex items-center gap-2">
                <Loader2 className="w-4 h-4" />
                <span className="hidden sm:inline">Current</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{currentCourses.length}</span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Completed</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{completedCourses.length}</span>
              </TabsTrigger>
              <TabsTrigger value="liked" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Liked</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{likedCourses.length}</span>
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Shared</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded">{sharedCourses.length}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="created">
              {createdCourses.length === 0 ? (
                <EmptyState 
                  icon={BookOpen} 
                  title="No courses created yet" 
                  description="Start creating your first course to see it here" 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {createdCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="current">
              {currentCourses.length === 0 ? (
                <EmptyState 
                  icon={Loader2} 
                  title="No courses in progress" 
                  description="Start a course to track your progress" 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentCourses.map(uc => (
                    <CourseCard key={uc.id} course={uc.course} progress={uc.progress} courseId={uc.course.id} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedCourses.length === 0 ? (
                <EmptyState 
                  icon={CheckCircle} 
                  title="No completed courses" 
                  description="Complete a course to see it here" 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {completedCourses.map(uc => (
                    <CourseCard key={uc.id} course={uc.course} progress={100} courseId={uc.course.id} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="liked">
              {likedCourses.length === 0 ? (
                <EmptyState 
                  icon={Heart} 
                  title="No liked courses" 
                  description="Like a course to save it here" 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {likedCourses.map(uc => (
                    <CourseCard key={uc.id} course={uc.course} courseId={uc.course.id} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared">
              {sharedCourses.length === 0 ? (
                <EmptyState 
                  icon={Share2} 
                  title="No shared courses" 
                  description="Courses shared with you will appear here" 
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sharedCourses.map(uc => (
                    <CourseCard key={uc.id} course={uc.course} courseId={uc.course.id} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Library;
