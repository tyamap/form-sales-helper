import type { PlasmoCSConfig } from "plasmo"
import { Storage } from "@plasmohq/storage"
import { BasicInfo } from "~entities/BasicInfo"
import { Templates } from "~entities/Templates"
import { autofillEmail } from "~logic/autofillEmail"
import { autofillName } from '~logic/autofillName'
import { autofillTemplate } from "~logic/autofillTemplate"
import { autofillOrganization } from "~logic/autofillOrganization"
import { autofillTel } from "~logic/autofillTel"
import { autocheckTerms } from "~logic/autocheckTerm"
import { Config } from "~entities/Config"
import { autofillDepartment } from "~logic/autofillDepartment"

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
    const config = await storage.get("config") as Config

    // 1フォームずつ処置
    Array(forms.length).fill('').forEach((_, i) => {
      const form = forms[i]

      if (!basicInfo) return
      // 名前フィールドの自動入力
      (basicInfo.familyName || basicInfo.givenName) &&
        autofillName(form, basicInfo.familyName, basicInfo.givenName)
      // Emailフィールドの自動入力
      basicInfo.email &&
        autofillEmail(form, basicInfo.email)
      // Telフィールドの自動入力
      basicInfo.tel &&
        autofillTel(form, basicInfo.tel)
      // 会社名フィールドの自動入力
      basicInfo.organization &&
        autofillOrganization(form, basicInfo.organization)
      // 部署名フィールドの自動入力
      basicInfo.department &&
        autofillDepartment(form, basicInfo.department)

      // 問合せ内容の自動入力
      const defaultKey = config?.defaultTemplate || 'template1'
      templates && templates[defaultKey] &&
        autofillTemplate(form, templates[defaultKey])

      // 規約の自動チェック
      if (config?.autoCheck) {
        autocheckTerms(form)
      }

    })
  }

})