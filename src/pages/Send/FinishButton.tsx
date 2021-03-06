import { ReactElement } from 'react'
import { useSetRecoilState } from 'recoil'

import { Button } from 'components'

import SendProcessStore, { ProcessStatus } from 'store/SendProcessStore'

const FinishButton = ({
  formScrollView,
}: {
  formScrollView: React.RefObject<HTMLDivElement>
}): ReactElement => {
  const setStatus = useSetRecoilState(SendProcessStore.sendProcessStatus)

  const onClickHomeButton = async (): Promise<void> => {
    setStatus(ProcessStatus.Input)
    formScrollView.current?.scrollTo({ left: 0 })
  }

  return <Button onClick={onClickHomeButton}>Home</Button>
}

export default FinishButton
