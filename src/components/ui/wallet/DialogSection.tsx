import React, { ReactNode } from 'react';

interface DialogSectionProps {
  children: ReactNode;
  hasBorder?: boolean;
  className?: string;
}

export const DialogSection: React.FC<DialogSectionProps> = ({
  children,
  hasBorder = true,
  className = '',
}) => {
  return (
    <>
      {hasBorder && (
        <div className='border-b border-mb-gray-800 -mx-8 my-5'></div>
      )}
      <div className={className}>{children}</div>
    </>
  );
};

export default DialogSection;
