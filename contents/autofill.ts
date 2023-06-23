import type { PlasmoCSConfig } from "plasmo"
import { autofill } from "~logic/autofill"

export const config: PlasmoCSConfig = {
  matches: ["*://*/contact*", "*://*/inquiry*", "*://*/inquiries*"]
}

window.addEventListener("load", async () => {
  if (document.forms.length > 0) {
    autofill()
  }
})