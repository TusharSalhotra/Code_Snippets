import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function CouponRedemptionCard({ metrics }) {
  return (
    <Card title="Discount Redemptions">
      <CardHeaderNumber>{metrics?.couponsRedeemedTotal.toString()}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={metrics?.couponsRedeemedNew.toString()}
      />
      <CardContentLine
        left="Returning Customers"
        right={metrics?.couponsRedeemedRepeat.toString()}
      />
      <CardContentLine
        left="Referrers"
        right={metrics?.couponsRedeemedAffiliate.toString()}
      />
    </Card>
  );
}
