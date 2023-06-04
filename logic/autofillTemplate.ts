import { fillAndHighlight } from "./utils"

export const autofillTemplate = async (form: HTMLFormElement, template: string) => {
  const input = getTemplateInput(form)
  if (input) {
    fillAndHighlight(input, template)

  } else {
    console.log('[FSH]', 'Template INPUT not found')
  }
}

const getTemplateInput = (form: HTMLFormElement) => {
  const input = form.querySelector<HTMLTextAreaElement>('textarea')
  return input
}