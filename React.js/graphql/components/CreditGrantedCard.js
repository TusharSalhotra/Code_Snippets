import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';
import * as Price from '../util/Price';

export default function CreditGrantedCard({ metrics }) {
  return (
    <Card title="Credit Granted">
      <CardHeaderNumber>{`$${Price.output(metrics?.creditGrantedTotal, true)}`}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={`$${Price.output(metrics?.creditGrantedNew, true)}`}
      />
      <CardContentLine
        left="Returning Customers"
        right={`$${Price.output(metrics?.creditGrantedRepeat, true)}`}
      />
      <CardContentLine
        left="Referrers"
        right={`$${Price.output(metrics?.creditGrantedAffiliate, true)}`}
      />
    </Card>
  );
}
