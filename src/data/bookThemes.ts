export const BOOK_THEMES = [
  { label: '자수정', spineColor: '#7B2D8B', coverColor: '#4A0E6B', accentColor: '#E879F9' },
  { label: '사파이어', spineColor: '#1E3A5F', coverColor: '#0F2744', accentColor: '#60A5FA' },
  { label: '앰버', spineColor: '#7C3D0C', coverColor: '#5C2A08', accentColor: '#FB923C' },
  { label: '에메랄드', spineColor: '#065F46', coverColor: '#064E3B', accentColor: '#34D399' },
  { label: '루비', spineColor: '#7F1D1D', coverColor: '#6B1515', accentColor: '#F87171' },
  { label: '인디고', spineColor: '#312E81', coverColor: '#1E1B4B', accentColor: '#818CF8' },
];

export type BookTheme = typeof BOOK_THEMES[0];
