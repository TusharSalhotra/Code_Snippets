import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function TotalContactsCard({ metrics }) {
  return (
    <Card title="Total Contacts on check">
      <CardHeaderNumber>{metrics.totalContacts.toString()}</CardHeaderNumber>
    </Card>
  );
}
