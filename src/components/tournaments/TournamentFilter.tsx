import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface TournamentFilterProps {
  onFilter: (filters: {
    search: string;
    status: string;
    format: string;
  }) => void;
  statusOptions: { label: string; value: string }[];
  formatOptions: { label: string; value: string }[];
}

const TournamentFilter: React.FC<TournamentFilterProps> = ({
  onFilter,
  statusOptions,
  formatOptions,
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [format, setFormat] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleFilter = () => {
    onFilter({
      search,
      status,
      format,
    });
  };

  const handleReset = () => {
    setSearch('');
    setStatus('');
    setFormat('');
    onFilter({
      search: '',
      status: '',
      format: '',
    });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
        <Button onClick={handleFilter}>
          Search
        </Button>
      </div>

      {showFilters && (
        <div className="grid gap-4 p-4 border rounded-md bg-card sm:grid-cols-2 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="All formats" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All formats</SelectItem>
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="ghost" onClick={handleReset} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentFilter; 