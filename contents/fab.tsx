import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const fab = () => {
  const [open, setOpen] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  // ボタンクリックしたら内容をコピーする
  const copyContent = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setShowCopied(true)
        setTimeout(() => {
          setShowCopied(false)
        }, 2000)
      })
  }

  return (
    <div className="fixed bottom-4 right-4">
      <div className={`absolute bottom-0 right-0 w-64 h-64 p-2 bg-white rounded shadow-lg transform transition-all duration-300 ${open ? 'scale-100' : 'scale-0'}`}>
        <button className="ML-2" onClick={() => setOpen(false)}>
          X
        </button>
        <span className={`text-teal-500 ${showCopied ? 'opacity-100' : 'opacity-0'} transition ml-2`}>コピーしました</span>
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