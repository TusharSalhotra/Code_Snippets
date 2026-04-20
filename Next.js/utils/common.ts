export function zodMessageHandler(data: any) {
  const message: any = {}
  data.forEach((element: any) => {
    const [fieldName] = element.path
    message[fieldName] = `${fieldName} is ${element.message}`
  })
  return message
}
