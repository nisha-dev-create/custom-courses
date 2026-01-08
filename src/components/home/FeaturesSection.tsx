import { Brain, Users, Zap, Target, BookOpen, Share2 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Course Generation",
    description: "Describe your interests and let AI craft a complete curriculum tailored to your goals.",
  },
  {
    icon: Target,
    title: "Personality-Based Learning",
    description: "Courses adapt to your learning style, pace, and preferences for maximum retention.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Share your courses with others and discover unique learning paths from the community.",
  },
  {
    icon: Zap,
    title: "Instant Creation",
    description: "Generate comprehensive courses in seconds, complete with modules and resources.",
  },
  {
    icon: BookOpen,
    title: "Rich Content",
    description: "Each course includes lessons, quizzes, and curated resources for deep learning.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your personalized courses with friends, colleagues, or the entire world.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose CourseForge?
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform combines AI intelligence with personalized learning to create 
            the perfect educational experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
