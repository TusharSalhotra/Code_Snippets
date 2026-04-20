import React from 'react';
import {
  Card,
  CardHeaderNumber,
  CardContentLine,
} from './MetricsCard';
import * as Price from '../util/Price';

export default function TotalCreditActivatedCard({ metrics }) {
  return (
    <Card title="Credit Activated">
      <CardHeaderNumber>{`$${Price.output(metrics.totalCreditActivated, true)}`}</CardHeaderNumber>
      <CardContentLine
        left="New Customers"
        right={`$${Price.output(metrics.totalCreditActivatedNew, true)}`}
      />
      <CardContentLine
        left="Returning Customers"
        right={`$${Price.output(metrics.totalCreditActivatedRepeat, true)}`}
      />
      <CardContentLine
        left="Referrers"
        right={`$${Price.output(metrics.totalCreditActivatedAffiliate, true)}`}
      />
    </Card>
  );
}
