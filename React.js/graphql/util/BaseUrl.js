export default function getBaseUrl() {
  if (process.env.CTO_BASE_URL) return process.env.CTO_BASE_URL;
  return 'https://app.yourdomain.com';
}
