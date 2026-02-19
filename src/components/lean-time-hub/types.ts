export type Category = 'VA' | 'NNVA' | 'NVA';

export interface Log {
  id: number;
  category: Category;
  duration: number; // in milliseconds
  description: string;
}
