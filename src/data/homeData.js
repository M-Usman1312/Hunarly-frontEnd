import {
  AirVent,
  BookOpen,
  Hammer,
  Plug,
  Wrench,
  Zap,
} from "lucide-react";
import { workers } from "./workers.js";

export const categories = [
  { name: "Electrician", icon: Zap, count: "24+ workers" },
  { name: "Plumber", icon: Wrench, count: "18+ workers" },
  { name: "Mechanic", icon: Hammer, count: "16+ workers" },
  { name: "Tutor", icon: BookOpen, count: "32+ workers" },
  { name: "Carpenter", icon: Plug, count: "12+ workers" },
  { name: "AC technician", icon: AirVent, count: "14+ workers" },
];

export const featuredWorkers = workers.slice(0, 6);
