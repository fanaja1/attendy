
export interface Group {
  id: string;
  name: string;
  location: string;
}

export interface Member {
    id: string;
    name: string;
};

export interface DateEntry {
  id: string;
  value: string; // ex: '2024-05-16'
  startTime: string | null; // ex: '08:00' ou null si non utilisé
  endTime: string | null;   // ex: '10:00' ou null si non utilisé
  tolerance: number;        // en minutes, 0 si non utilisé
};