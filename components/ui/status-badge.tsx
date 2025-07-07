import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant: 'reservation' | 'room' | 'bill' | 'task' | 'expense';
  className?: string;
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (variant) {
      case 'reservation':
        switch (status) {
          case 'confirmed':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          case 'checked-in':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          case 'checked-out':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
          case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
      
      case 'room':
        switch (status) {
          case 'available':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          case 'occupied':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          case 'cleaning':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          case 'maintenance':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
      
      case 'bill':
        switch (status) {
          case 'paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          case 'overdue':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
      
      case 'task':
        switch (status) {
          case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          case 'in-progress':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
      
      case 'expense':
        switch (status) {
          case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
          case 'approved':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
          case 'paid':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
          case 'rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
          default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
      
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Badge className={cn(getStatusConfig(), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
    </Badge>
  );
}
