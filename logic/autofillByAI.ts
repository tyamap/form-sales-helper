import { Storage } from "@plasmohq/storage"
import { Configuration, OpenAIApi } from "openai";
import { resolve } from "path";
import { type BasicInfo } from "~entities/BasicInfo";
import { type Config } from "~entities/Config";
import { type InputIdentifyQuery } from "~entities/InputIdentifyQuery";
import { type Templates } from "~entities/Templates";
import { fillAndHighlight } from "~logic/utils";

const configuration = new Configuration({
  // FIXME: OpenAI API KEY は秘匿する必要がある
  apiKey: process.env.PLASMO_PUBLIC_OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(configuration);

export const autofillByAI = async () => {
  const formElem = document.forms[0]
  // ページの要素を書き換えないように、要素を複製して扱う
  const copy = formElem.cloneNode(true) as HTMLFormElement
  cleanUpFormElement(copy)
  // GPTリクエストAPIを実行
  const defaultText = `I will give you a string representing form tag. 
    Please tell me the JavaScript querySelector function parameter strings that can be used to retrieve the input elements for "Name", "Family Name", "Given Name", "Email Address", "Organization Name",  "Department", "Phone Number", and "Inquiry Content" from the following form tag. If an input field for a specific item is not present, the query should be .
    Please return the response in the following JSON format without any extra text:
    {"nameInput": null, familyNameInput": null, "givenNameInput": null, "emailInput": null, "organizationInput": null, "departmentInput": null, "phoneNumberInput": null, "inquiryInput": null}
    
    `
  const inputText = copy.outerHTML
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 200,
    messages: [
      { role: "user", content: `${defaultText} ${inputText}` },
    ],
  })
  if (response.status === 200) {
    const result = response.data.choices[0].message.content
    const resultJSON = JSON.parse(result) as InputIdentifyQuery
    executeAutofillByAI(resultJSON)
    alert('[FSH] AI自動入力が完了しました\n「OK」を押すと反映されます')
  } else {
    console.error(response.statusText)
    alert(`[FSH] AIリクエストに失敗しました\n\n${response.statusText}`)
  }
  resolve()
}

/**
 * AI返答を元に自動入力を実行
 */
const executeAutofillByAI = async (queryObject: InputIdentifyQuery) => {
  const storage = new Storage()
  const basicInfo = await storage.get("basic-info") as BasicInfo
  const templates = await storage.get("templates") as Templates
  const config = await storage.get("config") as Config

  if (queryObject.nameInput) {
    const input = document.querySelector(queryObject.nameInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, `${basicInfo.familyName} ${basicInfo.givenName}`, true)
  }
  if (queryObject.familyNameInput) {
    const input = document.querySelector(queryObject.familyNameInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.familyName, true)
  }
  if (queryObject.givenNameInput) {
    const input = document.querySelector(queryObject.givenNameInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.givenName, true)
  }
  if (queryObject.emailInput) {
    const input = document.querySelector(queryObject.emailInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.email, true)
  }
  if (queryObject.phoneNumberInput) {
    const input = document.querySelector(queryObject.phoneNumberInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.tel, true)
  }
  if (queryObject.organizationInput) {
    const input = document.querySelector(queryObject.organizationInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.organization, true)
  }
  if (queryObject.departmentInput) {
    const input = document.querySelector(queryObject.departmentInput) as HTMLInputElement
    input &&
      fillAndHighlight(input, basicInfo.department, true)
  }
  if (queryObject.inquiryInput) {
    const input = document.querySelector(queryObject.inquiryInput) as HTMLTextAreaElement
    if (input) {
      const defaultKey = config?.defaultTemplate || 'template1'
      templates && templates[defaultKey] &&
        fillAndHighlight(input, templates[defaultKey], true)
    }
  }
}

/**
 * Form要素から不要な情報を削ぎ落とす（GPT API トークン節約のため）
 */
const cleanUpFormElement = (formElem: HTMLFormElement) => {
  cleanUpAttributes(formElem)
  formElem.querySelectorAll('*').forEach((element) => {
    cleanUpAttributes(element)
  })
  removeUnnecessaryTags(formElem)
}

/** 不要な属性を削除する */
const cleanUpAttributes = (element: Element) => {
  const attributes = element.attributes;
  for (let i = attributes.length - 1; i >= 0; i--) {
    const attributeName = attributes[i].name;
    if (
      attributeName !== "id" &&
      attributeName !== "class" &&
      attributeName !== "type" &&
      attributeName !== "placeholder" &&
      attributeName !== "name"
    ) {
      element.removeAttribute(attributeName);
    }
  }
  return element;
}

const removeUnnecessaryTags = (formElem: HTMLFormElement) => {
  const unnecessaryTags = ['script', 'svg']

  unnecessaryTags.forEach((tagName) => {
    const targets = formElem.querySelectorAll(tagName);
    // 要素を削除
    targets.forEach((target) => {
      target.parentNode.removeChild(target);
    });
  })

}
