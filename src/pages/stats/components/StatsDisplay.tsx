// src/pages/stats/components/StatsDisplay.tsx
import React from "react";
import { Stats } from "@/api/core/stats";
import {
  Briefcase,
  Users,
  Clock,
  Smile,
} from "lucide-react";

interface StatsDisplayProps {
  stats: Stats;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Projects Completed",
      value: stats.projects_completed,
      icon: Briefcase,
      color: "var(--accent-blue)",
    },
    {
      label: "Client Satisfaction",
      value: `${stats.client_satisfaction}%`,
      icon: Smile,
      color: "var(--accent-green)",
    },
    {
      label: "Years Experience",
      value: stats.years_experience,
      icon: Clock,
      color: "var(--accent-yellow)",
    },
    {
      label: "Happy Clients",
      value: stats.happy_clients,
      icon: Users,
      color: "var(--accent-purple)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="compact-card rounded-md border p-4 flex items-center gap-3"
          style={{
            backgroundColor: "var(--card-secondary-bg)",
            borderColor: "var(--border-color)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: card.color, color: "white" }}
          >
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{card.label}</p>
            <p className="text-2xl font-bold text-[var(--sidebar-text)]">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;