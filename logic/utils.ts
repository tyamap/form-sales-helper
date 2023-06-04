export const fillAndHighlight = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  input.value = value
  input.style.backgroundColor = '#ccfbf1'
  input.style.border = '2px solid #115e59'
}