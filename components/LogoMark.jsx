export default function LogoMark({ size = 46 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M23 2 L41 12.5 L41 33.5 L23 44 L5 33.5 L5 12.5 Z" fill="var(--orange)" />
      <path d="M23 2 L41 12.5 L41 33.5 L23 44 L5 33.5 L5 12.5 Z" fill="none" stroke="#0B2540" strokeWidth="1.5" opacity=".25" />
      <text x="23" y="29" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="17" fill="#0B2540">LB</text>
    </svg>
  );
}
