import agrLogo from "@/assets/agr-logo.png";

export default function AGRLogo({ className = "h-7" }: { className?: string }) {
  return <img src={agrLogo} alt="AGR" className={className} />;
}
