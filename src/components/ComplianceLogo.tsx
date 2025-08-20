interface ComplianceLogoProps {
  name: string;
  imageSrc?: string;
  className?: string;
}

const ComplianceLogo = ({ name, imageSrc, className = "" }: ComplianceLogoProps) => {
  return (
    <div className={`compliance-logo relative w-24 h-16 rounded-lg flex items-center justify-center text-xs font-bold text-muted-foreground ${className}`}>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt={name} 
          className="w-full h-full object-contain opacity-55"
        />
      ) : (
        name
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span className="text-2xl font-bold text-neon-pink">✕</span>
      </div>
    </div>
  );
};

export default ComplianceLogo;