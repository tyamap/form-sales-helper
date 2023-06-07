import { fillAndHighlight } from "./utils"

export const autofillEmail = async (form: HTMLFormElement, email: string) => {
  const input = getEmailInput(form)
  if (input) {
    fillAndHighlight(input, email)
  }
}

const getEmailInput = (form: HTMLFormElement) => {
  const input =
    form.querySelector<HTMLInputElement>('input[type=email]') ||
    form.querySelector<HTMLInputElement>('input[name*=email]')
  return input
}