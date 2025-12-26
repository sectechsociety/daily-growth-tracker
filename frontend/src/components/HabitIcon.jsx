import React from 'react';
import { Target, CheckCircle2, Circle, Trash2, Plus, Sparkles, Dumbbell, Droplet, Brain, Moon, Calendar, Save, FileText, Star, Zap, Rocket, Lightbulb, Flame, Music, Book, Laptop, Palette } from "lucide-react";

const HabitIcon = ({ icon, color, size = 24 }) => {
  const IconComponent = {
    dumbbell: Dumbbell,
    droplet: Droplet,
    brain: Brain,
    moon: Moon,
    calendar: Calendar,
    save: Save,
    file: FileText,
    star: Star,
    zap: Zap,
    rocket: Rocket,
    lightbulb: Lightbulb,
    flame: Flame,
    music: Music,
    book: Book,
    laptop: Laptop,
    palette: Palette,
    target: Target,
    check: CheckCircle2,
    circle: Circle,
    trash: Trash2,
    plus: Plus,
    sparkles: Sparkles
  }[icon] || Circle;

  return <IconComponent size={size} color={color} />;
};

export default HabitIcon;
