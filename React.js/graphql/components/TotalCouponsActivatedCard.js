import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function TotalCouponsActivatedCard({ metrics }) {
  console.log(metrics);
  return (
    <Card title="Discounts Activated">
      <CardHeaderNumber>{metrics.totalCouponsActivated.toString()}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={metrics.totalCouponsActivatedNew.toString()}
      />
      <CardContentLine
        left="Returning Customers"
        right={metrics.totalCouponsActivatedRepeat.toString()}
      />
      <CardContentLine
        left="Referrers"
        right={metrics.totalCouponsActivatedAffiliate.toString()}
      />
    </Card>
  );
}
