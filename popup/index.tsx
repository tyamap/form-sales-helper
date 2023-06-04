import { useStorage } from "@plasmohq/storage/hook"
import { BasicInfo, basicInfoDisplay } from '~entities/BasicInfo';
import { Templates, templatesDisplay } from '~entities/Templates';
import { useState } from "react"
import "~/style.css"

export default function Popup(): JSX.Element {
  const [basicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates] = useStorage<Templates>('templates')
  const [showCopied, setShowCopied] = useState(false)

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

  return (
    <main className="w-[300px] px-4 py-5 text-center text-gray-700">
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
      <div className="mb-4">
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
        <button className="bg-teal-500 roundedbg-teal-500 hover:bg-teal-400 text-white rounded px-4 py-2 mt-2"
          onClick={openOptionPage}
        >
          設定
        </button>
      </div>
    </main >
  )
}
