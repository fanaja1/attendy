
export interface Group {
  id: string;
  name: string;
  location: string;
  memberCount: number;
}

export interface Member {
  id: string;
  groupId: string;
  firstName: string;
  lastName: string;
  numero: number;
  designation: string;
};

export interface DateEntry {
  id: string;
  value: string; // ex: '2024-05-16'
  startTime: string | null; // ex: '08:00' ou null si non utilisé
  tolerance: number;        // en minutes, 0 si non utilisé
}

export const STATUS_VALUES = ['present', 'absent', 'retard', 'permission'];

export type Status = (typeof STATUS_VALUES)[number];

export interface Presence {
  date: string;
  status: Status;
  retardMinutes: number;
}
