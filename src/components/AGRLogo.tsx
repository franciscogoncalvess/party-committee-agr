export default function AGRLogo({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Circular arrow icon */}
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="70 18" />
      <path d="M24 8l-2 4h4l-2-4z" fill="currentColor" />
      {/* AGR text */}
      <text x="40" y="23" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="22" fill="currentColor" letterSpacing="-0.5">
        AGR
      </text>
    </svg>
  );
}
