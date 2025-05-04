
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colorClass = 'bg-cricket-navy',
}) => {
  return (
    <Card className="stats-card overflow-hidden">
      <div className={`h-1 w-full ${colorClass}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          {icon && <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
