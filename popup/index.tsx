import { useStorage } from "@plasmohq/storage/hook"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"
import { BasicInfo, basicInfoDisplay } from '~entities/BasicInfo';
import { Templates, templatesDisplay } from '~entities/Templates';
import { useEffect, useState } from "react"
import "~/style.css"

export default function Popup(): JSX.Element {
  const [basicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates] = useStorage<Templates>('templates')
  const [showCopied, setShowCopied] = useState(false)
  const [currentURL, setCurrentURL] = useState('')

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const url = tabs[0]?.url;
      setCurrentURL(url)
    });
  }, [])

  const copyContent = (value: string) => {
    navigator.clipboard.writeText(value).then(
      () => {
        setShowCopied(true)
        setTimeout(() => {
          setShowCopied(false)
        }, 2000)
      })
  }

  const openOptionPage = () => {
    chrome.runtime.openOptionsPage()
  }

  const startAutofillByAI = async () => {
    const res = await sendToContentScript({
      name: "autofillByAI"
    })
    alert(res)
  }

  return (
    <main className="w-[300px] p-4 text-center text-gray-700">
      <h1 className="text-lg mb-2 text-teal-700 font-bold">Form Sales Helper</h1>
      {(basicInfo || templates) &&
        <div className="mb-2">
          <p>各項目をクリックで<br />コピーできます</p>
          <span className={`text-teal-500 ${showCopied ? 'opacity-100' : 'opacity-0'} transition`}>コピーしました</span>
        </div>
      }
      <div className="mb-4">
        {basicInfo && basicInfo.familyName && basicInfo.givenName &&
          <div className="mb-1">
            <button onClick={() => copyContent(`${basicInfo.familyName} ${basicInfo.givenName}`)}>
              <><span className="opacity-50">名前:</span> {`${basicInfo.familyName} ${basicInfo.givenName}`}</>
            </button>
          </div>
        }
        {(Object.keys(basicInfoDisplay) as (keyof BasicInfo)[]).map((k) => (
          <>{basicInfo && basicInfo[k] &&
            <div className="mb-1" key={k}>
              <button onClick={() => copyContent(basicInfo ? basicInfo[k] : '')}>
                <p className="truncate">
                  <span className="opacity-50">{basicInfoDisplay[k]}:</span>
                  {basicInfo[k].length <= 26 ? basicInfo[k] : `${basicInfo[k].substring(0, 26)}...`}
                </p>
              </button>
            </div>
          }</>
        ))}
      </div>
      <div className="mb-2">
        {(Object.keys(templatesDisplay) as (keyof Templates)[]).map((k) => (
          <>{templates && templates[k] &&
            <div className="mb-2 relative group" key={k}>
              <span
                className="bg-gray-500 text-white rounded p-2 absolute w-72 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none"
              >
                {templates[k].length <= 60 ? templates[k] : `${templates[k].substring(0, 60)}...`}
              </span>
              <button onClick={() => copyContent(templates ? templates[k] : '')}>
                <span>{templatesDisplay && templatesDisplay[k]}</span>
              </button>
            </div>
          }</>
        ))}
      </div>
      <div>
        <button className="bg-teal-500 rounded bg-teal-500 hover:bg-teal-400 text-white rounded px-4 py-2 mt-2"
          onClick={openOptionPage}
        >
          設定
        </button>
      </div>
      <div>
        <button className="bg-teal-500 rounded bg-violet-500 hover:bg-violet-400 text-white rounded px-4 py-2 mt-2"
          onClick={startAutofillByAI}
        >
          AI実行(β版)
        </button>
      </div>
      <div className="text-right mt-4">
        <a
          className="underline text-gray-400"
          href={`https://docs.google.com/forms/d/e/1FAIpQLSdtC-jM2WUO_JECXAL0N44oYlvIFYVcsoucKqGx-98-Vxaqhg/viewform?usp=pp_url&entry.153732000=${currentURL}`}
          target="_blank">
          非対応サイトを報告
        </a>
      </div>

    </main >
  )
}
