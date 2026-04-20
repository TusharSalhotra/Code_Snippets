import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';
import * as Price from '../util/Price';

export default function TotalCreditRedeemedCard({ metrics }) {
  return (
    <Card title="Credit Redeemed">
      <CardHeaderNumber>{`$${Price.output(metrics.totalCreditRedeemed, true)}`}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={`$${Price.output(metrics.totalCreditRedeemedNew, true)}`}
      />
      <CardContentLine
        left="Returning Customers"
        right={`$${Price.output(metrics.totalCreditRedeemedRepeat, true)}`}
      />
      <CardContentLine
        left="Referrers"
        right={`$${Price.output(metrics.totalCreditRedeemedAffiliate, true)}`}
      />
    </Card>
  );
}
