import { Clock, Users, Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  students: number;
  rating: number;
  modules: number;
  imageUrl?: string;
}

export const CourseCard = ({
  id,
  title,
  description,
  category,
  duration,
  students,
  rating,
  modules,
  imageUrl,
}: CourseCardProps) => {
  return (
    <Link
      to={`/course/${id}`}
      className="group block rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{students}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">{modules} modules</span>
        </div>
      </div>
    </Link>
  );
};
