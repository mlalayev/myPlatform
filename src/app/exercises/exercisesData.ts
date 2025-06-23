export interface Exercise {
  id: string;
  title: string;
  difficulty: 'Asan' | 'Orta' | 'Çətin';
  description: string;
  acceptance: number; // percentage
}

export const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Ədədlərin cəmi',
    difficulty: 'Asan',
    description: 'Verilmiş iki ədədin cəmini qaytaran funksiya yazın.',
    acceptance: 92.1
  },
  {
    id: '2',
    title: 'Tək və ya cüt',
    difficulty: 'Asan',
    description: 'Verilmiş ədədin tək və ya cüt olduğunu müəyyən edən funksiya yazın.',
    acceptance: 88.4
  },
  {
    id: '3',
    title: 'Ən böyük ədəd',
    difficulty: 'Asan',
    description: 'Verilmiş iki ədədin ən böyüyünü qaytaran funksiya yazın.',
    acceptance: 85.7
  },
  {
    id: '4',
    title: 'Array-in uzunluğu',
    difficulty: 'Asan',
    description: 'Verilmiş array-in uzunluğunu qaytaran funksiya yazın.',
    acceptance: 90.2
  },
  {
    id: '5',
    title: 'Salam, ad!',
    difficulty: 'Asan',
    description: 'Verilmiş ad üçün "Salam, [ad]!" formatında string qaytaran funksiya yazın.',
    acceptance: 95.5
  },
]; 