export const formatPhoneNumber = (phoneNumberString) => {
  const formatted = phoneNumberString ? phoneNumberString
    .substring(1)
    .replace(/\D+/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
    : '';
  return formatted;
};

export function formatPhoneNumberToSend(phoneNumber) {
  let formattedPhoneNumber;
  formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (formattedPhoneNumber.length === 10) {
    formattedPhoneNumber = `1${formattedPhoneNumber}`;
  }
  return formattedPhoneNumber.toString();
}
