import React from 'react';
import {
  Card,
  CardHeaderNumber
} from './MetricsCard';

export default function TotalClientsCard({ metrics }) {
  return (
    <Card title="Total Clients on check">
      <CardHeaderNumber>{metrics.totalClients.toString()}</CardHeaderNumber>
    </Card>
  );
}
