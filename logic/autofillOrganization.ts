import { fillAndHighlight } from "./utils"

export const autofillOrganization = async (form: HTMLFormElement, organization: string) => {
  const input = getOrganizationInput(form)
  console.log('[FSH] Organization', input ? input : 'Organization INPUT not found')
  if (input) {
    fillAndHighlight(input, organization)
  }
}

const getOrganizationInput = (form: HTMLFormElement) => {
  const input =
    form.querySelector<HTMLInputElement>('input[name*=organization]') || 
    form.querySelector<HTMLInputElement>('input[name*=affiliation]') ||
    form.querySelector<HTMLInputElement>('input[name*=office]')
  return input
}