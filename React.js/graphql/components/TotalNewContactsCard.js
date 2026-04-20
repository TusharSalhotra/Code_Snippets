import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function TotalNewContactsCard({ metrics }) {
  return (
    <Card title="Discounts Granted">
      <CardHeaderNumber>{0}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={0}
      />
      <CardContentLine
        left="Returning Customers"
        right={0}
      />
      <CardContentLine
        left="Affiliate Customers"
        right={0}
      />
    </Card>
  );
}
