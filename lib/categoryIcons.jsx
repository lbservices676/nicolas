const stroke = '#FFC72C';
const sw = 1.6;

export const CATEGORY_ICONS = {
  outillage: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" /></svg>
  ),
  epi: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><path d="M4 12a8 8 0 0 1 16 0v6a2 2 0 0 1-2 2h-1v-7h3M6 12v8H5a2 2 0 0 1-2-2v-6" /></svg>
  ),
  fixation: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><path d="M12 3v18M6 8l6-5 6 5M6 16l6 5 6-5" /></svg>
  ),
  manutention: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><path d="M3 17h13l3-6h-5l-2-4H5l3 4H3v6ZM7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></svg>
  ),
  abrasifs: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><circle cx="12" cy="12" r="9" /><path d="M8 12a4 4 0 0 1 8 0" /></svg>
  ),
  plomberie: (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><path d="M6 3v6a4 4 0 0 0 8 0V3M10 13v4M10 21a4 4 0 0 0 4-4h4" /></svg>
  ),
};

export const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8v8H8z" /></svg>
);
