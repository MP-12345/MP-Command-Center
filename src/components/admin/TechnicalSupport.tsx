
import React from 'react';
import { EnhancedTechnicalSupportPanel } from './EnhancedTechnicalSupportPanel';

interface TechnicalSupportProps {
  department: string;
}

export const TechnicalSupport: React.FC<TechnicalSupportProps> = ({ department }) => {
  return <EnhancedTechnicalSupportPanel department={department} />;
};
