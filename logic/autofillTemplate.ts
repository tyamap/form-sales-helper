import { fillAndHighlight } from "./utils"

export const autofillTemplate = async (form: HTMLFormElement, template: string) => {
  const input = getTemplateInput(form)
  console.log('[FSH] Template', input ? input : 'Template INPUT not found')
  if (input) {
    fillAndHighlight(input, template)
  }
}

const getTemplateInput = (form: HTMLFormElement) => {
  const input = form.querySelector<HTMLTextAreaElement>('textarea')
  return input
}