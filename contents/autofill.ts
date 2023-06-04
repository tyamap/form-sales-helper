export { }

import { Storage } from "@plasmohq/storage"
import { BasicInfo } from "~entities/BasicInfo"
import { Templates } from "~entities/Templates"
import { autofillEmail } from "~logic/autofillEmail"
import { autofillName } from '~logic/autofillName'
import { autofillTemplate } from "~logic/autofillTemplate"

import type { PlasmoCSConfig } from "plasmo"
import { autofillOrganization } from "~logic/autofillOrganization"
import { autofillTel } from "~logic/autofillTel"
import { autocheckTerms } from "~logic/autocheckTerm"

export const config: PlasmoCSConfig = {
  matches: ["*://*/contact*", "*://*/inquiry*", "*://*/inquiries*"]
}


window.addEventListener("load", async () => {

  console.log('[FSH]', `Found ${document.forms.length} forms.`)
  if (document.forms.length > 0) {
    const forms = document.forms;

    const storage = new Storage()
    const basicInfo = await storage.get("basic-info") as BasicInfo
    const templates = await storage.get("templates") as Templates

    // 1フォームずつ処置
    Array(forms.length).fill('').forEach((_, i) => {
      const form = forms[i]
      // 名前フィールドの自動入力
      autofillName(form, basicInfo.familyName, basicInfo.givenName)
      // Emailフィールドの自動入力
      autofillEmail(form, basicInfo.email)
      // Telフィールドの自動入力
      autofillTel(form, basicInfo.email)
      // 会社名フィールドの自動入力
      autofillOrganization(form, basicInfo.organization)

      // 問合せ内容の自動入力
      autofillTemplate(form, templates[templates.defaultTemplate])
      
      // 規約の自動チェック
      if (basicInfo.autoCheck) {
        autocheckTerms(form)
      }

    })
  }

})