export const autocheckTerms = async (form: HTMLFormElement) => {
  const inputs = getTermInputs(form)
  if (inputs) {
    inputs.forEach((input) => {
      input.checked = true
      input.parentElement.style.backgroundColor = '#ccfbf1'
      input.parentElement.style.border = '2px solid #115e59'
    })
  }
}

const getTermInputs = (form: HTMLFormElement) => {
  const inputs =
    form.querySelectorAll<HTMLInputElement>('input[type=checkbox]')
  return inputs
}