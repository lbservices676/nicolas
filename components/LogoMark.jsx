export default function LogoMark({ size = 46 }) {
  return (
    <img
      src="/logo.png"
      alt="LB Services"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  );
}
