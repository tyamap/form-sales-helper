import { fillAndHighlight } from "./utils"

export const autofillTel = async (form: HTMLFormElement, tel: string) => {
  const input = getTelInput(form)
  if (input) {
    fillAndHighlight(input, tel)
  }
}

const getTelInput = (form: HTMLFormElement) => {
  const input =
    form.querySelector<HTMLInputElement>('input[type=tel]') ||
    form.querySelector<HTMLInputElement>('input[name*=tel]') || 
    form.querySelector<HTMLInputElement>('input[name*=phone')
  return input
}