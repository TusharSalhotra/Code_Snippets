import React from 'react';
import {
  Card,
  CardHeaderNumber,
} from './MetricsCard';

export default function ContactsWelcomedCard({ metrics }) {
  return (
    <Card title="Contacts Welcomed">
      <CardHeaderNumber>{metrics?.contactsWelcomed.toString()}</CardHeaderNumber>
    </Card>
  );
}
