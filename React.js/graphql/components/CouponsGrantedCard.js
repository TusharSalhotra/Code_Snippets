import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';

export default function CouponsGrantedCard({ metrics }) {
  return (
    <Card title="Discounts Granted">
      <CardHeaderNumber>{metrics?.couponsGrantedTotal.toString()}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={metrics?.couponsGrantedNew.toString()}
      />
      <CardContentLine
        left="Returning Customers"
        right={metrics?.couponsGrantedRepeat.toString()}
      />
      <CardContentLine
        left="Referrers"
        right={metrics?.couponsGrantedAffiliate.toString()}
      />
    </Card>
  );
}
