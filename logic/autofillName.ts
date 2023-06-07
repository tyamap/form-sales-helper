import { fillAndHighlight } from "./utils"

export const autofillName = async (form: HTMLFormElement, familyName: string, givenName: string) => {
  const input = getNameInput(form)
  if (input) {
    fillAndHighlight(input, `${familyName} ${givenName}`)
  }
}

const getNameInput = (form: HTMLFormElement) => {
  const input = form.querySelector<HTMLInputElement>('input[name*=name]')
  return input
}