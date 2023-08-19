import { useStorage } from "@plasmohq/storage/hook"
import { sendToContentScript } from "@plasmohq/messaging"
import { type BasicInfo, basicInfoDisplay } from '~entities/BasicInfo';
import { type Templates, templatesDisplay } from '~entities/Templates';
import { type Config } from "~entities/Config";
import { useEffect, useState } from "react"
import "~/style.css"

export default function Popup(): JSX.Element {
  const [basicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates] = useStorage<Templates>('templates')
  const [config] = useStorage<Config>('config')
  const [showCopied, setShowCopied] = useState(false)
  const [currentURL, setCurrentURL] = useState('')
  const [loading, setLoading] = useState(false)

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

  // 手動で実行する
  const startAutofillManually = async () => {
    setLoading(true)
    await sendToContentScript({
      name: "autofillManually"
    })
    setLoading(false)
  }

  // // AIで実行する
  // const startAutofillByAI = async () => {
  //   if (!config.useAI) return
  //   setLoading(true)
  //   await sendToContentScript({
  //     name: "autofillByAI"
  //   })
  //   // 7秒待つ
  //   // FIXME: APIレスポンスを待つようにしたい
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 7000)
  // }

  return (
    <main className="w-[300px] p-4 text-center text-gray-700">
      <h1 className="text-lg mb-2 text-teal-700 font-bold">Form Sales Helper</h1>
      <div>
        <button className="bg-teal-500 rounded hover:bg-teal-400 text-white rounded px-4 py-2 mb-4"
          onClick={openOptionPage}
        >
          設定
        </button>
      </div>
      {(basicInfo || templates) &&
        <div className="mb-2">
          <p>各項目をクリックで<br />コピーできます</p>
          <span className={`text-teal-500 ${showCopied ? 'opacity-100' : 'opacity-0'} transition`}>コピーしました</span>
        </div>
      }
      {basicInfo && <div className="mb-4">
        {basicInfo.givenName &&
          <div className="mb-1">
            <button onClick={() => copyContent(`${basicInfo.familyName} ${basicInfo.givenName}`)}>
              <><span className="opacity-50">姓名:</span> {`${basicInfo.familyName} ${basicInfo.givenName}`}</>
            </button>
          </div>
        }
        {basicInfo.familyNameKatakana && basicInfo.givenNameKatakana &&
          <div className="mb-1">
            <button onClick={() => copyContent(`${basicInfo.familyNameKatakana} ${basicInfo.givenNameKatakana}`)}>
              <><span className="opacity-50">セイメイ:</span> {`${basicInfo.familyNameKatakana} ${basicInfo.givenNameKatakana}`}</>
            </button>
          </div>
        }
        {(Object.keys(basicInfoDisplay) as (keyof BasicInfo)[]).map((k) => {
          if (basicInfo[k]) return (
            <div className="mb-1" key={k}>
              <button onClick={() => copyContent(basicInfo[k])}>
                <p className="truncate">
                  <span className="opacity-50">{basicInfoDisplay[k]}:</span>
                  {basicInfo[k].length <= 26 ? basicInfo[k] : `${basicInfo[k].substring(0, 26)}...`}
                </p>
              </button>
            </div>)
        })}
      </div>}
      {templates &&
        <div className="mb-2">
          {(Object.keys(templatesDisplay) as (keyof Templates)[]).map((k) => {
            if (templates[k]) return (
              <div className="mb-2 relative group" key={k}>
                <span
                  className="bg-gray-500 text-white rounded p-2 absolute w-72 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                >
                  {templates[k].length <= 60 ? templates[k] : `${templates[k].substring(0, 60)}...`}
                </span>
                <button onClick={() => copyContent(templates[k])}>
                  <span>{templatesDisplay && templatesDisplay[k]}</span>
                </button>
              </div>
            )
          })}
        </div>
      }
      {loading
        ? <div className="px-4 py-2 mt-2">お待ちください</div>
        : <div>
          <button className="rounded bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 mt-2"
            onClick={startAutofillManually}
          >
            手動実行
          </button>
          {/* {config?.useAI &&
            <button className="rounded bg-violet-500 hover:bg-violet-400 text-white px-4 py-2 mt-2 ml-2"
              onClick={startAutofillByAI}
            >
              AI実行(β版)
            </button>
          } */}
        </div>
      }
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
