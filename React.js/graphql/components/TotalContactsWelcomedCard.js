import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function TotalContactsWelcomedCard({ metrics }) {
  return (
    <Card title="Contacts Welcomed">
      <CardHeaderNumber>{metrics.totalContactsWelcomed.toString()}</CardHeaderNumber>
    </Card>
  );
}
