
import React from 'react';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ClientSearch = ({ searchTerm, setSearchTerm }: ClientSearchProps) => {
  return (
    <div className="card mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-crm-accent/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-white/50" size={18} />
      </div>
    </div>
  );
};

export default ClientSearch;
