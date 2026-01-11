import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
const personalityTraits = [
  "Visual Learner",
  "Analytical",
  "Creative",
  "Practical",
  "Detail-Oriented",
  "Big Picture Thinker",
  "Self-Paced",
  "Structured",
  "Collaborative",
  "Independent",
];

const interests = [
  "Technology",
  "Business",
  "Creative Arts",
  "Science",
  "Health & Wellness",
  "Personal Development",
  "Marketing",
  "Finance",
  "Design",
  "Writing",
  "Music",
  "Photography",
];

const CreateCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourseId, setGeneratedCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    goals: "",
    selectedTraits: [] as string[],
    selectedInterests: [] as string[],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const toggleTrait = (trait: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTraits: prev.selectedTraits.includes(trait)
        ? prev.selectedTraits.filter((t) => t !== trait)
        : [...prev.selectedTraits, trait],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interest)
        ? prev.selectedInterests.filter((i) => i !== interest)
        : [...prev.selectedInterests, interest],
    }));
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({ title: "Please sign in to create a course", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      // Create course in database
      const { data: course, error } = await supabase
        .from("courses")
        .insert({
          title: `${formData.topic} Mastery Course`,
          description: formData.goals,
          category: formData.selectedInterests[0] || "General",
          modules: 6,
          duration: "12 hours",
          created_by: user.id,
          is_public: false,
        })
        .select()
        .single();

      if (error) throw error;

      setGeneratedCourseId(course.id);
      setStep(3);
    } catch (error: any) {
      toast({
        title: "Error creating course",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartLearning = async () => {
    if (!user || !generatedCourseId) return;

    try {
      // Add to user_courses with "current" status
      const { error } = await supabase
        .from("user_courses")
        .insert({
          user_id: user.id,
          course_id: generatedCourseId,
          status: "current",
          progress: 0,
        });

      if (error) throw error;

      navigate(`/course/${generatedCourseId}`);
    } catch (error: any) {
      toast({
        title: "Error starting course",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${
                  s === step
                    ? "w-8 bg-primary"
                    : s < step
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Topic & Goals */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  What do you want to learn?
                </h1>
                <p className="text-lg text-muted-foreground">
                  Tell us about your learning goals and we'll create a personalized course.
                </p>
              </div>

              <div className="space-y-6 bg-card p-8 rounded-2xl border border-border">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-base font-medium">
                    Course Topic
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Web Development, Creative Writing, Data Analysis..."
                    value={formData.topic}
                    onChange={(e) =>
                      setFormData({ ...formData, topic: e.target.value })
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-base font-medium">
                    What are your learning goals?
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Describe what you hope to achieve, any specific skills you want to develop, or projects you want to complete..."
                    value={formData.goals}
                    onChange={(e) =>
                      setFormData({ ...formData, goals: e.target.value })
                    }
                    className="min-h-32 resize-none"
                  />
                </div>

                <Button
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!formData.topic || !formData.goals}
                  className="w-full gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Personality & Interests */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Tell us about yourself
                </h1>
                <p className="text-lg text-muted-foreground">
                  This helps us personalize your learning experience.
                </p>
              </div>

              <div className="space-y-8 bg-card p-8 rounded-2xl border border-border">
                {/* Learning Style */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    How do you prefer to learn?
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {personalityTraits.map((trait) => (
                      <Badge
                        key={trait}
                        variant={
                          formData.selectedTraits.includes(trait)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer text-sm py-2 px-4 transition-all ${
                          formData.selectedTraits.includes(trait)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => toggleTrait(trait)}
                      >
                        {trait}
                        {formData.selectedTraits.includes(trait) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    What are your interests?
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={
                          formData.selectedInterests.includes(interest)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer text-sm py-2 px-4 transition-all ${
                          formData.selectedInterests.includes(interest)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                        {formData.selectedInterests.includes(interest) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleGenerate}
                    disabled={
                      formData.selectedTraits.length === 0 ||
                      formData.selectedInterests.length === 0 ||
                      isGenerating
                    }
                    className="flex-1 gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Course
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generated Course Preview */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Course Generated!</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Your Personalized Course
                </h1>
                <p className="text-lg text-muted-foreground">
                  Here's your AI-generated course based on your preferences.
                </p>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {formData.topic} Mastery Course
                  </h2>
                  <p className="text-muted-foreground">
                    A personalized learning path designed for {formData.selectedTraits.slice(0, 2).join(" & ").toLowerCase()} learners.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Course Modules</h3>
                  {[
                    "Introduction & Foundations",
                    "Core Concepts Deep Dive",
                    "Practical Applications",
                    "Advanced Techniques",
                    "Real-World Projects",
                    "Mastery & Next Steps",
                  ].map((module, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{module}</p>
                        <p className="text-sm text-muted-foreground">
                          3-5 lessons • Approx. 2 hours
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)} className="flex-1">
                    Create Another
                  </Button>
                  <Button size="lg" className="flex-1 gap-2" onClick={handleStartLearning}>
                    <Sparkles className="w-4 h-4" />
                    Start Learning
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateCourse;
