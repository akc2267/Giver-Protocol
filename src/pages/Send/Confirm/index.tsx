import { ReactElement } from 'react'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { BoxArrowUpRight } from 'react-bootstrap-icons'

import { UTIL, COLOR } from 'consts'

import { ExtLink, Text } from 'components'
import FormImage from 'components/FormImage'

import SendStore from 'store/SendStore'

import useAsset from 'hooks/useAsset'

import { BlockChainType } from 'types/network'
// import { AssetNativeDenomEnum } from 'types/asset'
import SendProcessStore from 'store/SendProcessStore'
import useNetwork from 'hooks/useNetwork'

const StyledContainer = styled.div`
  padding-top: 20px;
`

const StyledSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  word-break: break-all;
`

const StyledSecH = styled.div`
  display: inline-block;
  color: ${COLOR.white};
  white-space: nowrap;
  opacity: 0.6;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.25;
  letter-spacing: -0.28px;
`

const StyledSecD = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  padding-left: 10px;
`

const StyledSecDText = styled(Text)<{ isError?: boolean }>`
  color: ${(props): string => (props.isError ? COLOR.red : COLOR.text)};
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: -0.37px;
`

const StyledSecDText2 = styled(Text)`
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.19px;
  text-align: right;
`

const StyledSpaceBetween = styled.div`
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
`

const Confirm = (): ReactElement => {
  const { formatBalance } = useAsset()

  // Send Data
  const asset = useRecoilValue(SendStore.asset)
  //const toAddress = useRecoilValue(SendStore.toAddress)
  const amount = useRecoilValue(SendStore.amount)
  // const memo = useRecoilValue(SendStore.memo)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)

  // Computed data from Send data
  // const gasFee = useRecoilValue(SendStore.gasFee)
  const tax = useRecoilValue(SendStore.tax)
  // const feeDenom = useRecoilValue<AssetNativeDenomEnum>(SendStore.feeDenom)
  const shuttleFee = useRecoilValue(SendStore.shuttleFee)
  //const amountAfterShuttleFee = useRecoilValue(SendStore.amountAfterShuttleFee)

  const requestTxResult = useRecoilValue(SendProcessStore.requestTxResult)

  const { getScannerLink } = useNetwork()

  return (
    <StyledContainer>
      <StyledSection>
        <StyledSecH>Charity</StyledSecH>
        <StyledSecD>
          <FormImage
            src={asset?.loguURI || ''}
            size={18}
            style={{ paddingRight: 5 }}
          />
          <StyledSecDText>{asset?.symbol}</StyledSecDText>
        </StyledSecD>
      </StyledSection>
      {/* {fromBlockChain === BlockChainType.terra &&
        toBlockChain === BlockChainType.terra && (
          <StyledSection>
            <StyledSecH>Memo</StyledSecH>
            <StyledSecD>
              <Text>{memo}</Text>
            </StyledSecD>
          </StyledSection>
        )} */}
      {/*<StyledSection>
        <StyledSecH>Destination Address</StyledSecH>
        <StyledSecD>
          <StyledSecDText>{UTIL.truncate(toAddress, [15, 15])}</StyledSecDText>
        </StyledSecD>
      </StyledSection>*/}

      {fromBlockChain === BlockChainType.terra && (
        <StyledSection style={{ flexDirection: 'column', paddingBottom: 0 }}>
          {tax && (
            <StyledSpaceBetween style={{ marginBottom: 16 }}>
              <StyledSecH>Tax</StyledSecH>
              <StyledSecD>
                <StyledSecDText2>
                  {formatBalance(tax.amount.toString())} {'UST'}
                </StyledSecDText2>
              </StyledSecD>
            </StyledSpaceBetween>
          )}
          { <StyledSpaceBetween style={{ marginBottom: 16 }}>
            <StyledSecH>GAS Fee</StyledSecH>
            <StyledSecD>
              <StyledSecDText2>
                {`0.08 UST`}
              </StyledSecDText2>
            </StyledSecD>
          </StyledSpaceBetween> }

          {shuttleFee &&
            (toBlockChain === BlockChainType.ethereum ||
              toBlockChain === BlockChainType.bsc) && (
              <StyledSpaceBetween style={{ marginBottom: 16 }}>
                <StyledSecH>Shuttle fee (estimated)</StyledSecH>
                <StyledSecD>
                  <StyledSecDText2>
                    {`${formatBalance(shuttleFee)} ${asset?.symbol}`}
                  </StyledSecDText2>
                </StyledSecD>
              </StyledSpaceBetween>
            )}
        </StyledSection>
      )}

      <StyledSection>
          <StyledSpaceBetween>
            <StyledSecH>Savings Deposit Amount</StyledSecH>
            <StyledSecD>
              <StyledSecDText>{`${formatBalance((Math.round(parseInt(amount)*.9167)-80000).toString())} ${
                'UST'
              }`}</StyledSecDText>
            </StyledSecD>
          </StyledSpaceBetween>
      </StyledSection>
      <StyledSection>
          <StyledSpaceBetween>
            <StyledSecH>Charity Donation Amount</StyledSecH>
            <StyledSecD>
              <StyledSecDText>{`${formatBalance(Math.round(parseInt(amount)*.0833).toString())} ${
                'UST'
              }`}</StyledSecDText>
            </StyledSecD>
          </StyledSpaceBetween>
      </StyledSection>

      {requestTxResult?.success && (
        <StyledSection>
          <StyledSecH style={{ color: '#5592f7', opacity: 1 }}>TX</StyledSecH>
          <StyledSecD>
            <StyledSecDText2>
              {
                <ExtLink
                  href={getScannerLink({
                    address: requestTxResult.hash,
                    type: 'tx',
                  })}
                  style={{ padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <div>{UTIL.truncate(requestTxResult.hash, [15, 15])}</div>
                  <BoxArrowUpRight
                    color="#5592f7"
                    style={{ paddingLeft: 3, marginTop: -2 }}
                  />
                </ExtLink>
              }
            </StyledSecDText2>
          </StyledSecD>
        </StyledSection>
      )}
    </StyledContainer>
  )
}

export default Confirm
