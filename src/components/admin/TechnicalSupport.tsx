
import React from 'react';
import { TechnicalSupportPanel } from './TechnicalSupportPanel';

interface TechnicalSupportProps {
  department: string;
}

export const TechnicalSupport: React.FC<TechnicalSupportProps> = ({ department }) => {
  return <TechnicalSupportPanel department={department} />;
};
