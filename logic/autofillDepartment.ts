import { fillAndHighlight } from "./utils"

export const autofillDepartment = async (form: HTMLFormElement, department: string) => {
  const input = getDepartmentInput(form)
  if (input) {
    fillAndHighlight(input, department)
  
  } else {
    console.log('[FSH]', 'Department INPUT not found')
  }
}

const getDepartmentInput = (form: HTMLFormElement) => {
  const input =
    form.querySelector<HTMLInputElement>('input[name*=department]')
  return input
}