import React from 'react';
import {
  Card,
  CardHeaderNumber,
} from './MetricsCard';

export default function CouponsExpired({ metrics }) {
  return (
    <Card title="Discounts Expired Without Redemption">
      <CardHeaderNumber>{metrics?.couponsExpiredWithoutRedemption.toString()}</CardHeaderNumber>
    </Card>
  );
}
