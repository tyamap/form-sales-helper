export const fillAndHighlight = (input: HTMLInputElement | HTMLTextAreaElement, value: string, ai?: boolean) => {
  input.value = value
  input.style.backgroundColor = ai ? '#ede9fe' : '#ccfbf1'
  input.style.border = ai ? '2px solid #5b21b6' : '2px solid #115e59'
}