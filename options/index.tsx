
import { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useStorage } from "@plasmohq/storage/hook"
import { type BasicInfo, basicInfoDisplay } from '~entities/BasicInfo';
import { type Templates, templatesDisplay } from '~entities/Templates';
import { type Config } from '~entities/Config';
import "~/style.css"

type OptionForm = BasicInfo & Templates & Config

export default function Options(): JSX.Element {
  const [basicInfo, setBasicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates, setTemplates] = useStorage<Templates>('templates')
  const [config, setConfig] = useStorage<Config>('config')
  const form = useForm<OptionForm>({ defaultValues: { ...basicInfo, ...templates, ...config } })

  useEffect(() => {
    form.reset({ ...basicInfo, ...templates, ...config })
  }, [basicInfo, templates, config])

  const onSubmit = (data: OptionForm) => {
    setBasicInfo(data)
    setTemplates(data)
    setConfig(data)
  };

  return (
    <main className="px-4 py-10 text-center text-gray-700">
      <h1 className="text-lg text-teal-700 font-bold">Form Sales Helper</h1>
      <h2 className="text-md mb-4 text-teal-700 font-bold">Options</h2>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4">
          {(Object.keys(basicInfoDisplay) as (keyof BasicInfo)[]).map((k) => (
            <div className="mt-2" key={k}>
              <label>
                <span className="mr-2">{basicInfoDisplay[k]}</span>
                <input
                  className="border border-gray-400 rounded px-2 py-1"
                  {...form.register(k)} />
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <span className="mr-2">規約の自動チェック</span>
            <input type="checkbox" className="sr-only peer" {...form.register('autoCheck')} />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[18px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-400"></div>
          </label>
        </div>
        <div className="mb-4">
          {(Object.keys(templatesDisplay) as (keyof Templates)[]).map((k) => (
            <div className="mt-2" key={k}>
              <label>
                <span>{templatesDisplay[k]}</span>
                <div>
                  <textarea className="w-80 h-40 border border-gray-400 rounded px-2 py-1" {...form.register(k)} />
                </div>
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="mr-2" htmlFor="default-template">デフォルト</label>
          <select id="default-template" className="border runded border-gray-500 py-1 px-2" {...form.register('defaultTemplate')}>
            {(Object.keys(templatesDisplay) as (keyof Templates)[]).map((k) => (
              <option key={`option-${k}`} value={k}>{templatesDisplay[k]}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <p>サイトの情報を OpenAI API に送信することに同意して</p>
          <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <span className="mr-2">AI実行ボタン(β版)を使う</span>
            <input type="checkbox" className="sr-only peer" {...form.register('useAI')} />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[18px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-400"></div>
          </label>
        </div>
        <div className="mb-4">
          <label>
            <span className="mr-2">ボタンを表示しないページのドメイン（改行区切り）</span>
            <div>
              <textarea className="w-80 h-40 border border-gray-400 rounded px-2 py-1" {...form.register('excludeDomains')} />
            </div>
          </label>
        </div>
        <button className='bg-teal-500 hover:bg-teal-400 text-white rounded px-4 py-2' type="submit">保存</button>
      </form>
    </main>
  )
}