import React from 'react';
import { BookOpen, Star, CheckCircle, Clock } from 'lucide-react';

interface StatsCardProps {
  tutorials: {
    total: number;
    completed: number;
    favorites: number;
    totalDuration: number;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ tutorials }) => {
  const { total, completed, favorites, totalDuration } = tutorials;

  const stats = [
    {
      label: 'Total Tutorials',
      value: total,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50'
    },
    {
      label: 'Favorites',
      value: favorites,
      icon: Star,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      label: 'Total Hours',
      value: Math.round(totalDuration / 60),
      icon: Clock,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};