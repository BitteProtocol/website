import React from 'react';
import { User } from 'lucide-react';
import { Button } from '../button';

interface ManageAccountsButtonProps {
  isSidebarOpen?: boolean;
  isSidebar?: boolean;
}

export const ManageAccountsButton: React.FC<ManageAccountsButtonProps> = ({
  isSidebarOpen,
  isSidebar,
}) => {
  if (isSidebarOpen) {
    return (
      <Button className='border border-mb-blue-100 bg-mb-blue-30 hover:bg-mb-blue-100/40 w-full text-mb-blue-100 flex items-center gap-1'>
        <User size={16} color='#60A5FA' /> Connected
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='icon'
      className={`border border-mb-blue-100 bg-mb-blue-30 hover:bg-mb-blue-100/40 ${isSidebar ? 'h-[32px] w-[32px]' : ''}`}
    >
      <User size={16} color='#60A5FA' />
    </Button>
  );
};

export default ManageAccountsButton;
