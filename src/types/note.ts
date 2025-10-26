export interface Note {
  id: number;
  title: string;
  content: string;
  type: 'important' | 'daily' | 'general';
  createdAt: string;
  updatedAt: string;
}
