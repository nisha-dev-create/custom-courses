import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-24 bg-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 border border-background/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-background">Start Learning Today</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background mb-6">
            Ready to Create Your Perfect Learning Journey?
          </h2>

          <p className="text-lg text-background/70 mb-8">
            Join thousands of learners who are already discovering personalized education. 
            Let AI design a course that matches your unique learning style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              asChild
            >
              <Link to="/create" className="gap-3">
                <Sparkles className="w-5 h-5" />
                Generate My Course
              </Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline"
              className="border-background/30 text-background bg-transparent hover:bg-background/10"
              asChild
            >
              <Link to="/explore" className="gap-3">
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
