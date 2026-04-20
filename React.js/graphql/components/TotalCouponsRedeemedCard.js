import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function TotalCouponsRedeemedCard({ metrics }) {
  return (
    <Card title="Discounts Redeemed">
      <CardHeaderNumber>{metrics.totalCouponsRedeemed.toString()}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={metrics.totalCouponsRedeemedNew.toString()}
      />
      <CardContentLine
        left="Returning Customers"
        right={metrics.totalCouponsRedeemedRepeat.toString()}
      />
      <CardContentLine
        left="Referrers"
        right={metrics.totalCouponsRedeemedAffiliate.toString()}
      />
    </Card>
  );
}
