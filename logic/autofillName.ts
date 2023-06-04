import { fillAndHighlight } from "./utils"

export const autofillName = async (form: HTMLFormElement, familyName: string, givenName: string) => {
  const input = getNameInput(form)
  if (input) {
    fillAndHighlight(input, `${familyName} ${givenName}`)
  } else {
    console.log('[FSH]', 'Name INPUT not found')
  }
}

const getNameInput = (form: HTMLFormElement) => {
  const input = form.querySelector<HTMLInputElement>('input[name*=name]')
  return input
}