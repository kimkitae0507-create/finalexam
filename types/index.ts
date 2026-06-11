export interface Department {
  id: string;
  name: string;
}

export interface College {
  id: string;
  name: string;
  departments: Department[];
}

export type SelectedItem = {
  type: 'college' | 'department';
  id: string;
  name: string;
} | null;
