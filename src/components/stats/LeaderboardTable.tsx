
import React from 'react';
import { Leaderboard } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LeaderboardTableProps {
  data: Leaderboard[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ data }) => {
  // Sort teams by points (descending)
  const sortedData = [...data].sort((a, b) => b.points - a.points);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Tournament Standings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">Pts</TableHead>
            <TableHead className="text-right">NRR</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            <TableRow key={item.teamId}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.teamName}</TableCell>
              <TableCell className="text-center">{item.matchesPlayed}</TableCell>
              <TableCell className="text-center">{item.won}</TableCell>
              <TableCell className="text-center">{item.lost}</TableCell>
              <TableCell className="text-center font-bold">{item.points}</TableCell>
              <TableCell className="text-right">{item.netRunRate?.toFixed(3) || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
