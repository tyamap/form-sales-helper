import { useStorage } from "@plasmohq/storage/hook"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import { BasicInfo, basicInfoDisplay } from "~entities/BasicInfo"
import { Templates, templatesDisplay } from "~entities/Templates"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const SELECTED_TEXT_ID = 'fsh-selected-text'

const fab = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const [basicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates] = useStorage<Templates>('templates')

  // ボタンクリックしたら内容を保持する
  const selectContent = (value: string) => {
    if (document.querySelector(`#${SELECTED_TEXT_ID}`)) {
      document.querySelector(`#${SELECTED_TEXT_ID}`)?.remove()
    }
    // テキストを保持する要素を作成
    const elem = document.createElement('div')
    elem.id = SELECTED_TEXT_ID
    elem.style.display = 'none'
    elem.textContent = value
    document.body.appendChild(elem)
    setSelected(value)
  }

  const handleClose = () => {
    // テキストを保持する要素があれば削除する
    if (document.querySelector(`#${SELECTED_TEXT_ID}`)) {
      document.querySelector(`#${SELECTED_TEXT_ID}`)?.remove()
    }
    setSelected("")
    setOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`absolute bottom-0 right-0 w-64 p-2 bg-white rounded shadow-xl transform transition-all duration-300 ${open ? 'scale-100' : 'scale-0'}`}>
        <div className="flex justify-between">
          <button className="ml-2" onClick={handleClose}>
            X
          </button>
          <button className="ml-2 relative group">?
            <span
              className="text-left bg-gray-500 text-white text-xs right-0 rounded p-2 absolute w-72 opacity-0 group-hover:opacity-100 transition pointer-events-none"
            >
              入力したい項目を選択し、フォームの入力欄をクリックすると、選択した項目が入力されます。<br />
              このモーダルを開いている間のみ、選択した項目が保持されます。<br />
              うまくいかない場合はページを再読み込みしてください。
            </span>
          </button>
        </div>
        {basicInfo &&
          <div className="flex flex-wrap gap-2 p-2">
            {basicInfo.familyName && basicInfo.givenName &&
              <button
                className={buttonStyle}
                onClick={() => selectContent(`${basicInfo.familyName} ${basicInfo.givenName}`)}
              >
                姓 名
              </button>
            }
            {basicInfo.familyNameKatakana && basicInfo.givenNameKatakana &&
              <button
                className={buttonStyle}
                onClick={() => selectContent(`${basicInfo.familyNameKatakana} ${basicInfo.givenNameKatakana}`)}
              >
                セイ メイ
              </button>
            }
            {(Object.keys(basicInfoDisplay) as (keyof BasicInfo)[]).map((k) => {
              if (basicInfo[k]) {
                return (
                  <button key={k}
                    className={buttonStyle}
                    onClick={() => selectContent(basicInfo[k])}
                  >
                    {basicInfoDisplay[k]}
                  </button>
                )
              }
            })}
          </div>
        }
        {templates &&
          <div className="flex flex-wrap gap-2 p-2">
            {(Object.keys(templatesDisplay) as (keyof Templates)[]).map((k) => {
              if (templates[k]) {
                return (
                  <button key={k}
                    className={buttonStyle}
                    onClick={() => selectContent(templates[k])}
                  >
                    {templatesDisplay[k]}
                  </button>
                )
              }
            })}
          </div>
        }
        <div className="text-gray-700 text-xs">
          <span>選択中: </span>
          <span>{selected.length <= 16 ? selected : `${selected.substring(0, 16)}...` || '-'}</span>
        </div>
      </div>
      <button className="rounded-full bg-teal-500 hover:bg-teal-400 text-white px-3 py-2"
        onClick={() => setOpen(true)}
      >
        FSH
      </button>
    </div>
  );
};

export default fab;

const buttonStyle = `
py-1 px-2 rounded border-solid border-2 border-teal-500 text-sm text-gray-700
`

window.addEventListener("load", () => {
  document.querySelectorAll('input,textarea').forEach((elm) => {
    elm.addEventListener("focus", (e) => {
      const value = document.querySelector(`#${SELECTED_TEXT_ID}`).textContent
      console.log(document.querySelector(`#${SELECTED_TEXT_ID}`))
      const target = e.target as HTMLInputElement
      target.value += value
    })
  })
})