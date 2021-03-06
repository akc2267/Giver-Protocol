import { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import { useDebouncedCallback } from 'use-debounce'
import BigNumber from 'bignumber.js'

import { ASSET, COLOR } from 'consts'

import { BlockChainType } from 'types/network'
import { ValidateItemResultType } from 'types/send'
import { AssetNativeDenomEnum } from 'types/asset'

import { Col, Row } from 'components'
import FormLabel from 'components/FormLabel'
import FormErrorMessage from 'components/FormErrorMessage'

import useSend from 'hooks/useSend'
import useShuttle from 'hooks/useShuttle'
import useSendValidate from 'hooks/useSendValidate'
import useAsset from 'hooks/useAsset'

import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import AssetList from './AssetList'
import FormFeeInfo from './FormFeeInfo'
import FormLabelInput from 'components/FormLabelInput'

const StyledContainer = styled.div``

const StyledFormSection = styled.div`
  margin-bottom: 40px;
`

const StyledMaxButton = styled.div`
  position: absolute;
  top: 50%;
  margin-top: -13px;
  right: 0;
  background-color: ${COLOR.darkGray2};
  font-size: 12px;
  border-radius: 5px;
  padding: 0 10px;
  line-height: 24px;
  height: 26px;

  cursor: pointer;
  :hover {
    background-color: #323842;
  }
`

const SendForm = ({
  feeValidationResult,
}: {
  feeValidationResult: ValidateItemResultType
}): ReactElement => {
  const loginUser = useRecoilValue(AuthStore.loginUser)
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  const USTWallet = useRecoilValue(SendStore.USTWallet)
  const [amount, setAmount] = useRecoilState(SendStore.amount)
  // const [memo, setMemo] = useRecoilState(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  // Computed data from Send data
  const setTax = useSetRecoilState(SendStore.tax)
  const setGasFeeList = useSetRecoilState(SendStore.gasFeeList)
  const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const setShuttleFee = useSetRecoilState(SendStore.shuttleFee)
  const setAmountAfterShuttleFee = useSetRecoilState(
    SendStore.amountAfterShuttleFee
  )

  const [validationResult, setValidationResult] = useRecoilState(
    SendStore.validationResult
  )

  const [inputAmount, setInputAmount] = useState('')

  const { getTerraShuttleFee } = useShuttle()
  const { formatBalance, getAssetList, getUSTWallet } = useAsset()
  const { getTerraFeeList, getTerraSendTax } = useSend()
  const { validateSendData } = useSendValidate()

  // const onChangeToAddress = ({ value }: { value: string }): void => {
  //   setToAddress(value)
  // }

  const onChangeAmount = ({ value }: { value: string }): void => {
    if (_.isEmpty(value)) {
      setInputAmount('')
      setAmount('')
      return
    }

    if (false === _.isNaN(_.toNumber(value))) {
      setInputAmount(value)
      const decimalSize = new BigNumber(
        fromBlockChain === 'terra'
          ? ASSET.TERRA_DECIMAL
          : ASSET.ETHER_BASE_DECIMAL
      )
      setAmount(new BigNumber(value).times(decimalSize).toString(10))
    }
  }

  // const onChangeMemo = ({ value }: { value: string }): void => {
  //   setMemo(value)
  // }

  const onClickMaxButton = async (): Promise<void> => {
    const assetAmount = new BigNumber(USTWallet?.balance || 0)
    const terraTax = await getTerraSendTax({
      denom: USTWallet?.tokenAddress as AssetNativeDenomEnum,
      feeDenom,
      amount: assetAmount.toString(10),
    })
    const taxAmount = new BigNumber(terraTax?.amount.toString() || 0)

    onChangeAmount({ value: formatBalance(assetAmount.minus(taxAmount)) })
  }

  const setTerraShuttleFee = async (): Promise<void> => {
    // get terra shutte Fee Info
    if (
      toBlockChain === BlockChainType.ethereum ||
      toBlockChain === BlockChainType.bsc
    ) {
      const sendAmount = new BigNumber(amount)
      if (sendAmount.isGreaterThan(0)) {
        getTerraShuttleFee({
          denom: USTWallet?.tokenAddress || '',
          amount: sendAmount,
        }).then((shuttleFee) => {
          setShuttleFee(shuttleFee)
          const computedAmount = sendAmount.minus(shuttleFee)
          setAmountAfterShuttleFee(
            computedAmount.isGreaterThan(0) ? computedAmount : new BigNumber(0)
          )
        })
      } else {
        setShuttleFee(new BigNumber(0))
      }
    }
  }

  // It's for Fee(gas), Tax and ShuttleFee
  const dbcGetFeeInfoWithValidation = useDebouncedCallback(async () => {
    const sendDataResult = validateSendData()
    console.log('sendDataResult', sendDataResult)
    setValidationResult(sendDataResult)

    const ableToGetFeeInfo =
      isLoggedIn &&
      fromBlockChain === BlockChainType.terra &&
      amount &&
      feeDenom
      // toAddress

    if (USTWallet?.tokenAddress && ableToGetFeeInfo) {
      if (sendDataResult.isValid) {
        // get terra Send Fee Info
        const terraFeeList = await getTerraFeeList()
        setGasFeeList(terraFeeList)
      }

      const terraTax = await getTerraSendTax({
        denom: USTWallet?.tokenAddress as AssetNativeDenomEnum,
        feeDenom,
        amount,
      })
      setTax(terraTax)

      setTerraShuttleFee()
    }
  }, 300)

  //get terra send fee info
  useEffect(() => {
    dbcGetFeeInfoWithValidation.callback()
    return (): void => {
      dbcGetFeeInfoWithValidation.cancel()
    }
  }, [amount, toBlockChain, USTWallet?.tokenAddress])

  useEffect(() => {
    console.log('running effect')
    getAssetList();
    getUSTWallet();
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      // if user logs in, fetch their wallet
      getUSTWallet();
    }
  }, [isLoggedIn])

  useEffect(() => {
    onChangeAmount({ value: inputAmount })
    // getAssetList().then((): void => {
    //   dbcGetFeeInfoWithValidation.callback()
    // })
  }, [
    // to check decimal length by network
    loginUser,
    // to check if asset valid by network
    toBlockChain,
  ])

  return (
    <StyledContainer>
      <StyledFormSection>
        <Row>
          <Col>
            <FormLabel title={'Charity'} />
          </Col>
        </Row>
        <AssetList {...{ selectedAsset: asset, USTWallet, onChangeAmount }} />

        <FormErrorMessage errorMessage={validationResult.errorMessage?.asset} />
      </StyledFormSection>

      <StyledFormSection>
        <div style={{ position: 'relative' }}>
          <FormLabelInput
            inputProps={{
              type: 'number',
              value: inputAmount,
              onChange: ({ target: { value } }): void => {
                onChangeAmount({ value })
              },
            }}
            labelProps={{ children: 'Amount' }}
          />
          <StyledMaxButton onClick={onClickMaxButton}>Max</StyledMaxButton>
        </div>

        {isLoggedIn && (
          <FormErrorMessage
            errorMessage={validationResult.errorMessage?.amount}
          />
        )}
      </StyledFormSection>
      {!!inputAmount ? 
        <StyledFormSection style={{'justifyContent': 'center', display: 'flex'}}>
          <div style={{ position: 'relative', width: '50%' }}>
          <FormLabelInput
              inputProps={{
                style: {
                  // fontSize: 12,
                  color: '#42f581',
                  fontWeight: 'bold'
                },
                type: 'string',
                value: `$${(parseInt(inputAmount) * 1.1).toFixed(0)}`,
                onChange: ({ target: { value } }): void => {
                  
                },
              }}
              labelProps={{ children: 'Savings Value in 1 Year' }}
            />
            {/* <StyledMaxButton onClick={onClickMaxButton}>Max</StyledMaxButton> */}
          </div>
          <div style={{ position: 'relative', width: '50%' }}>
          <FormLabelInput
              inputProps={{
                style: {
                  // fontSize: 12,
                  color: '#42f581',
                  fontWeight: 'bold'
                },
                type: 'string',
                value: `$${(parseInt(inputAmount) * .1).toFixed(0)}`,
                onChange: ({ target: { value } }): void => {
                  
                },
              }}
              labelProps={{ children: 'Donation Value in 1 Year' }}
            />
            {/* <StyledMaxButton onClick={onClickMaxButton}>Max</StyledMaxButton> */}
          </div>
        </StyledFormSection> : null
        }

      {/* <StyledFormSection>
        <FormLabelInput
          inputProps={{
            value: toAddress,
            onChange: ({ target: { value } }): void => {
              onChangeToAddress({ value })
            },
          }}
          labelProps={{ children: 'Destination Address' }}
        />
        <FormErrorMessage
          errorMessage={validationResult.errorMessage?.toAddress}
        />
      </StyledFormSection> */}

      {/* {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledFormSection>
            <FormLabelInput
              inputProps={{
                value: memo,
                onChange: ({ target: { value } }): void => {
                  onChangeMemo({ value })
                },
              }}
              labelProps={{ children: 'Memo (optional)' }}
            />
            <FormErrorMessage
              errorMessage={validationResult.errorMessage?.memo}
            />
          </StyledFormSection>
        )} */}

      {/* only if from terra */}
      <FormFeeInfo feeValidationResult={feeValidationResult} />
    </StyledContainer>
  )
}

export default SendForm
