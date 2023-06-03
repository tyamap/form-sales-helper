
import { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useStorage } from "@plasmohq/storage/hook"
import { BasicInfo, basicInfoDisplay } from '~entities/BasicInfo';
import { Templates, templatesDisplay } from '~entities/Templates';
import "~/style.css"

type OptionForm = BasicInfo & Templates

export default function Options(): JSX.Element {
  const [basicInfo, setBasicInfo] = useStorage<BasicInfo>('basic-info')
  const [templates, setTemplates] = useStorage<Templates>('templates')
  const form = useForm<OptionForm>({ defaultValues: { ...basicInfo, ...templates } })

  useEffect(() => {
    form.reset({ ...basicInfo, ...templates })
  }, [basicInfo, templates])

  const onSubmit = (data: OptionForm) => {
    setBasicInfo(data)
    setTemplates(data)
  };

  return (
    <main className="px-4 py-10 text-center text-gray-700">
      <h1 className="text-lg">Options</h1>
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
        <button className='bg-teal-500 hover:bg-teal-400 text-white rounded px-4 py-2' type="submit">保存</button>
      </form>
    </main>
  )
}