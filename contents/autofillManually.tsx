import { useMessage } from "@plasmohq/messaging/hook"
import { autofill } from "~logic/autofill"

const AutofillManually = () => {
  useMessage(async (req, res) => {
    if (req.name === 'autofillManually') {
      if (document.forms.length > 0) {
        autofill()
        res.send('手動実行が終了しました')
      } else {
        res.send('フォームが見つかりませんでした')
      }
    }
  })
}

export default AutofillManually
