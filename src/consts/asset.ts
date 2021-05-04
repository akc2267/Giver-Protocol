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

const terraDenoms = {
  // [symbolOfDenom[AssetNativeDenomEnum.ukrw]]: AssetNativeDenomEnum.ukrw,
  [symbolOfDenom[AssetNativeDenomEnum.uusd]]: AssetNativeDenomEnum.uusd,
  // [symbolOfDenom[AssetNativeDenomEnum.usdr]]: AssetNativeDenomEnum.usdr,
  // [symbolOfDenom[AssetNativeDenomEnum.umnt]]: AssetNativeDenomEnum.umnt,
}

const nativeDenoms = {
  ...terraDenoms,
  // [symbolOfDenom[AssetNativeDenomEnum.uluna]]: AssetNativeDenomEnum.uluna,
}

// DWB = 'Doctors Without Borders',
// CATF = 'Clean Air Task Force',
// AI = 'Amnesty International'

const USTasset = {
  symbol: AssetSymbolEnum.UST,
  name: 'Terra USD',
  loguURI: 'https://assets.terra.money/icon/60/UST.png',
  tokenAddress: '',
};

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
    name: AssetSymbolEnum.CATF,
    loguURI: 'https://www.catf.us/wp-content/themes/catf-5ive/assets/dist/img/logo-clean-air-task-force-color@2x.png',
    tokenAddress: '',
  },
  {
    symbol: AssetSymbolEnum.AI,
    name: AssetSymbolEnum.AI,
    loguURI: 'data:image/jpeg;base64,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',
    tokenAddress: '',
  }
]
export default {
  assetList,
  USTasset,
  nativeDenoms,
  symbolOfDenom,
  TERRA_DECIMAL,
  ETHER_BASE_DECIMAL,
}
