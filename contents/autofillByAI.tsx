import { useMessage } from "@plasmohq/messaging/hook"

const AutofillByAI = () => {
  useMessage(async (req, res) => {
    if (req.name === 'autofillByAI') {
      const formElem = document.forms[0]
      if (formElem) {
        // ページの要素を書き換えないように、要素を複製して扱う
        const copy = formElem.cloneNode(true) as HTMLFormElement
        cleanUpFormElement(copy)
        // TODO: GPTリクエストAPIを実行
        res.send('成功しました')
      } else {
        res.send('問合せフォームが見つかりません')
      }
    }
  })
}

/**
 * Form要素から不要な情報を削ぎ落とす（GPT API トークン節約のため）
 */
const cleanUpFormElement = (formElem: HTMLFormElement) => {
  console.log(formElem.outerHTML.length, formElem.outerHTML)
  cleanUpAttributes(formElem)
  formElem.querySelectorAll('*').forEach((element) => {
    cleanUpAttributes(element)
  })
  removeUnnecessaryTags(formElem)
  console.log(formElem.outerHTML.length, formElem.outerHTML)
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

export default AutofillByAI
