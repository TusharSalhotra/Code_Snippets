import React from 'react';
import {
  Card,
  CardHeaderNumber,
} from './MetricsCard';
import * as Price from '../util/Price';

export default function UpcomingRevenueCard({ metrics }) {
  return (
    <Card title="Upcoming Revenue">
      <CardHeaderNumber>{`$${Price.output(metrics.upcomingRevenue, true)}`}</CardHeaderNumber>
    </Card>
  );
}
