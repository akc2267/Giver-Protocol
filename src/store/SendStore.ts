import { Coin, StdFee } from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import { atom } from 'recoil'

import { AssetNativeDenomEnum, AssetType } from 'types/asset'
import { ASSET } from 'consts'
import { BlockChainType } from 'types/network'
import { ValidateResultType } from 'types/send'

// Send Data Start
const asset = atom<AssetType | undefined>({
  key: 'sendAsset',
  default: undefined,
})
const USTWallet = atom<AssetType | undefined>({
  key: 'wallet',
  default: ASSET.USTasset,
})
const toAddress = atom<string>({
  key: 'sendToAddress',
  default: '',
})
const amount = atom<string>({
  key: 'sendAmount',
  default: '',
})
const memo = atom<string>({
  key: 'sendMemo',
  default: '',
})
const fromBlockChain = atom<BlockChainType>({
  key: 'sendFromBlockChain',
  default: BlockChainType.terra,
})
const toBlockChain = atom<BlockChainType>({
  key: 'sendToBlockChain',
  default: BlockChainType.terra,
})
const fee = atom<StdFee | undefined>({
  key: 'sendFee',
  default: undefined,
})
const gasPrices = atom<Record<string, string>>({
  key: 'sendGasPrices',
  default: {},
})
// Send Data End

const loginUserAssetList = atom<AssetType[]>({
  key: 'loginUserAssetList',
  default: [],
})

const loginUserUSTWallet = atom<AssetType[]>({
  key: 'loginUserUSTWallet',
  default: [],
})

// Computed data from Send data Start
const feeDenom = atom<AssetNativeDenomEnum>({
  key: 'sendFeeDenom',
  default: AssetNativeDenomEnum.uusd,
})
const gasFeeList = atom<
  {
    denom: AssetNativeDenomEnum
    fee?: StdFee
  }[]
>({
  key: 'sendGasFeeList',
  default: [],
})
const gasFee = atom<BigNumber>({
  key: 'sendGasFee',
  default: new BigNumber(0),
})
const tax = atom<Coin | undefined>({
  key: 'sendTax',
  default: undefined,
})
const shuttleFee = atom<BigNumber>({
  key: 'sendShuttleFee',
  default: new BigNumber(0),
})
const amountAfterShuttleFee = atom<BigNumber>({
  key: 'sendAmountAfterShuttleFee',
  default: new BigNumber(0),
})
// Computed data from Send data End

const validationResult = atom<ValidateResultType>({
  key: 'sendValidationResult',
  default: {
    isValid: false,
  },
})

export default {
  asset,
  USTWallet,
  toAddress,
  amount,
  memo,
  fromBlockChain,
  toBlockChain,
  fee,
  gasPrices,

  loginUserAssetList,
  loginUserUSTWallet,
  feeDenom,
  gasFeeList,
  gasFee,
  tax,
  shuttleFee,
  amountAfterShuttleFee,

  validationResult,
}
