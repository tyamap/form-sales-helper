import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useRef, useState } from "react"

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

  // ボタンクリックしたら内容をコピーする
  const copyContent = (value: string) => {
    if (document.querySelector(`#${SELECTED_TEXT_ID}`)) {
      document.querySelector(`#${SELECTED_TEXT_ID}`)?.remove()
    }
    // テキストを保持する要素を作成
    const elem = document.createElement('div')
    elem.id = SELECTED_TEXT_ID
    elem.style.display = 'none'
    elem.textContent = value
    document.body.appendChild(elem)
  }

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`absolute bottom-0 right-0 w-64 h-64 p-2 bg-white rounded shadow-lg transform transition-all duration-300 ${open ? 'scale-100' : 'scale-0'}`}>
        <button className="ml-2" onClick={() => setOpen(false)}>
          X
        </button>
        <div className="flex flex-col justify-center items-center h-full">
          <button onClick={() => copyContent('ACTION')}>
            ACTION
          </button>
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

window.addEventListener("load", () => {
  document.querySelectorAll('input,textarea').forEach((elm) => {
    elm.addEventListener("focus", (e) => {
      const value = document.querySelector(`#${SELECTED_TEXT_ID}`).textContent
      console.log(document.querySelector(`#${SELECTED_TEXT_ID}`))
      const target = e.target as HTMLInputElement
      target.value = value
    })
  })
})