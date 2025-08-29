import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  children: ReactNode;
  variant: 'epic' | 'victory' | 'battle';
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ActionButton = ({ 
  children, 
  variant, 
  icon, 
  disabled = false, 
  onClick,
  className = "" 
}: ActionButtonProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'epic':
        return 'btn-epic';
      case 'victory':
        return 'btn-victory';
      case 'battle':
        return 'btn-battle';
    }
  };

  return (
    <Button
      className={`${getVariantClass()} ${className} flex items-center space-x-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Button>
  );
};