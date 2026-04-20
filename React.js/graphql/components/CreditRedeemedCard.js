import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';
import * as Price from '../util/Price';

export default function CreditRedeemedCard({ metrics }) {
  return (
    <Card title="Credit Redeemed">
      <CardHeaderNumber>{`$${Price.output(metrics?.creditRedeemedTotal, true)}`}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={`$${Price.output(metrics?.creditRedeemedNew, true)}`}
      />
      <CardContentLine
        left="Returning Customers"
        right={`$${Price.output(metrics?.creditRedeemedRepeat, true)}`}
      />
      <CardContentLine
        left="Referrers"
        right={`$${Price.output(metrics?.creditRedeemedAffiliate, true)}`}
      />
    </Card>
  );
}
