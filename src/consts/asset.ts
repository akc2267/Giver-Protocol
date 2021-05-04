import { AssetType, AssetSymbolEnum, AssetNativeDenomEnum } from 'types/asset'

const TERRA_DECIMAL = 1e6
const ETHER_BASE_DECIMAL = 1e18

const symbolOfDenom: Record<AssetNativeDenomEnum, AssetSymbolEnum> = {
  // [AssetNativeDenomEnum.ukrw]: AssetSymbolEnum.KRT,
  [AssetNativeDenomEnum.uusd]: AssetSymbolEnum.UST,
  // [AssetNativeDenomEnum.uluna]: AssetSymbolEnum.Luna,
  // [AssetNativeDenomEnum.usdr]: AssetSymbolEnum.SDT,
  // [AssetNativeDenomEnum.umnt]: AssetSymbolEnum.MNT,
}

// const terraDenoms = {
//   [symbolOfDenom[AssetNativeDenomEnum.ukrw]]: AssetNativeDenomEnum.ukrw,
//   [symbolOfDenom[AssetNativeDenomEnum.uusd]]: AssetNativeDenomEnum.uusd,
//   [symbolOfDenom[AssetNativeDenomEnum.usdr]]: AssetNativeDenomEnum.usdr,
//   [symbolOfDenom[AssetNativeDenomEnum.umnt]]: AssetNativeDenomEnum.umnt,
// }

// const nativeDenoms = {
//   ...terraDenoms,
//   [symbolOfDenom[AssetNativeDenomEnum.uluna]]: AssetNativeDenomEnum.uluna,
// }

// DWB = 'Doctors Without Borders',
// CATF = 'Clean Air Task Force',
// AI = 'Amnesty International'

const assetList: AssetType[] = [
  {
    symbol: AssetSymbolEnum.DWB,
    name: AssetSymbolEnum.DWB,
    // loguURI: 'https://assets.terra.money/icon/60/Luna.png',
    loguURI: 'https://donate.doctorswithoutborders.org/images/msf_logo_sm.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.CATF,
    name: 'Terra USD',
    loguURI: 'https://assets.terra.money/icon/60/UST.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.AI,
    name: 'Terra KRW',
    loguURI: 'https://assets.terra.money/icon/60/KRT.png',
    tokenAddress: '',
  }
]
export default {
  assetList,
  // nativeDenoms,
  symbolOfDenom,
  TERRA_DECIMAL,
  ETHER_BASE_DECIMAL,
}
