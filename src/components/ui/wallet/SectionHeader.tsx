import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  iconColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  className = '',
  iconColor = '#BABDC2',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon size={16} color={iconColor} />
      <p className='text-mb-gray-50 font-medium text-xs'>{title}</p>
    </div>
  );
};

export default SectionHeader;
