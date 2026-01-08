import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Heart, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Our Mission</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Custom Courses for Everyone
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe everyone learns differently. Custom Courses uses AI to create 
              educational experiences that adapt to your unique way of understanding the world.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Personalized Learning
                </h3>
                <p className="text-muted-foreground">
                  Every course is tailored to your interests, goals, and learning style 
                  using advanced AI technology.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Community Driven
                </h3>
                <p className="text-muted-foreground">
                  Share your knowledge, discover courses from others, and grow together 
                  in a supportive learning community.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Continuous Innovation
                </h3>
                <p className="text-muted-foreground">
                  We're constantly improving our AI to create better, more engaging 
                  learning experiences for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                CourseForge was born from a simple observation: traditional education 
                treats everyone the same, but we all learn differently. Some of us are 
                visual learners, others prefer hands-on practice. Some thrive with 
                structured content, while others need flexibility.
              </p>
              <p className="mb-4">
                We built Custom Courses to bridge this gap. Using advanced AI, we analyze 
                your learning preferences, interests, and goals to create courses that 
                truly resonate with how you think and learn.
              </p>
              <p>
                Today, thousands of learners use Custom Courses to discover knowledge in 
                ways that feel natural to them. And we're just getting started.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your first personalized course today.
            </p>
            <Button size="xl" asChild>
              <Link to="/create" className="gap-2">
                Create Your Course
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
