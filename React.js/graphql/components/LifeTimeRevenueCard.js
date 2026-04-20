import React from 'react';
import {
  Card,
  CardHeaderNumber
} from './MetricsCard';
import * as Price from '../util/Price';

export default function LifeTimeRevenueCard({ metrics }) {
  return (
    <Card title="Lifetime Revenue">
      <CardHeaderNumber>{`$${Price.output(metrics.lifeTimeRevenue, true)}`}</CardHeaderNumber>
    </Card>
  );
}
