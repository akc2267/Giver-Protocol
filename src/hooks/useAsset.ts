import { useRecoilValue, useSetRecoilState } from 'recoil'
import _ from 'lodash'
import BigNumber from 'bignumber.js'

import { ASSET } from 'consts'
import AuthStore from 'store/AuthStore'
import SendStore from 'store/SendStore'

import { AssetType, WhiteListType, BalanceListType } from 'types/asset'
import { BlockChainType } from 'types/network'

import useTerraBalance from './useTerraBalance'
import useEtherBaseBalance from './useEtherBaseBalance'
import ContractStore from 'store/ContractStore'

const useAsset = (): {
  getAssetList: () => Promise<void>
  getUSTWallet: () => Promise<void>
  formatBalance: (balance: string | BigNumber) => string
} => {
  const isLoggedIn = useRecoilValue(AuthStore.isLoggedIn)
  const fromBlockChain = useRecoilValue(SendStore.fromBlockChain)
  const toBlockChain = useRecoilValue(SendStore.toBlockChain)

  const terraWhiteList = useRecoilValue(ContractStore.terraWhiteList)
  const ethWhiteList = useRecoilValue(ContractStore.ethWhiteList)
  const bscWhiteList = useRecoilValue(ContractStore.bscWhiteList)

  const setAssetList = useSetRecoilState(SendStore.loginUserAssetList)
  const setUSTWallet = useSetRecoilState(SendStore.loginUserUSTWallet)

  const { getTerraBalances } = useTerraBalance()
  const { getEtherBalances } = useEtherBaseBalance()

  const getTerraWhiteList = async (): Promise<WhiteListType> => {
    return {
      ...ASSET.nativeDenoms,
      ...terraWhiteList,
    }
  }

  const setBalanceToAssetList = ({
    assetList,
    whiteList,
    balanceList,
  }: {
    assetList: AssetType[]
    whiteList: WhiteListType
    balanceList: BalanceListType
  }): AssetType[] => {
    if (_.some(balanceList)) {
      return _.map(assetList, (asset) => {
        const tokenAddress = whiteList[asset.symbol]

        return {
          ...asset,
          tokenAddress,
          balance: balanceList[tokenAddress],
        }
      }).filter((x) => x.tokenAddress)
    }

    return assetList
  }

  const getAssetList = async (): Promise<void> => {
    const assetList = ASSET.assetList
    // const assetList = [
    //   ASSET.USTasset
    // ]

    console.log('assetList', assetList)
    let whiteList: WhiteListType = {}
    let balanceList: BalanceListType = {}
    if (isLoggedIn) {
      if (fromBlockChain === BlockChainType.terra) {
        whiteList = await getTerraWhiteList()
        balanceList = await getTerraBalances({
          terraWhiteList: _.map(whiteList, (token) => ({ token })),
        });
        console.log('ASSET BALANCE LIST', balanceList);
      } else if (fromBlockChain === BlockChainType.ethereum) {
        whiteList = ethWhiteList
        balanceList = await getEtherBalances({ whiteList })
      } else if (fromBlockChain === BlockChainType.bsc) {
        whiteList = bscWhiteList
        balanceList = await getEtherBalances({ whiteList })
      }
    }

    const fromList = setBalanceToAssetList({
      assetList,
      whiteList,
      balanceList,
    })

    if (
      fromBlockChain !== toBlockChain &&
      [BlockChainType.ethereum, BlockChainType.bsc].includes(toBlockChain)
    ) {
      const toWhiteList =
        toBlockChain === BlockChainType.ethereum ? ethWhiteList : bscWhiteList

      const pairList = _.map(fromList, (item) => {
        const disabled = _.isEmpty(toWhiteList[item.symbol])
        return {
          ...item,
          disabled,
        }
      })
      console.log('setAssetList', pairList)
      setAssetList(pairList)
    } else {
      console.log('setAssetList', fromList)
      setAssetList(fromList)
    }
  }

  const getUSTWallet = async (): Promise<void> => {
    // const assetList = ASSET.assetList
    const assetList = [
      ASSET.USTasset
    ]

    console.log('getUSTWallet', assetList)
    console.log('fromBlockChain', fromBlockChain)
    let whiteList: WhiteListType = {}
    let balanceList: BalanceListType = {}
    if (isLoggedIn) {
      if (fromBlockChain === BlockChainType.terra) {
        whiteList = await getTerraWhiteList()
        balanceList = await getTerraBalances({
          terraWhiteList: _.map(whiteList, (token) => ({ token })),
        });
      } else if (fromBlockChain === BlockChainType.ethereum) {
        whiteList = ethWhiteList
        balanceList = await getEtherBalances({ whiteList })
      } else if (fromBlockChain === BlockChainType.bsc) {
        whiteList = bscWhiteList
        balanceList = await getEtherBalances({ whiteList })
      }
    }

    console.log('1', assetList)
    console.log('2', whiteList)
    console.log('3', balanceList)

    const fromList = setBalanceToAssetList({
      assetList,
      whiteList,
      balanceList,
    })

    console.log('fromList', fromList)

    if (
      fromBlockChain !== toBlockChain &&
      [BlockChainType.ethereum, BlockChainType.bsc].includes(toBlockChain)
    ) {
      const toWhiteList =
        toBlockChain === BlockChainType.ethereum ? ethWhiteList : bscWhiteList

      const pairList = _.map(fromList, (item) => {
        const disabled = _.isEmpty(toWhiteList[item.symbol])
        return {
          ...item,
          disabled,
        }
      })

      console.log('ust wallet', pairList)
      setUSTWallet(pairList)
    } else {
      setUSTWallet(fromList)
    }
  }

  const formatBalance = (balance: string | BigNumber): string => {
    if (balance) {
      const bnBalance =
        typeof balance === 'string' ? new BigNumber(balance) : balance

      return fromBlockChain === BlockChainType.terra
        ? bnBalance.div(ASSET.TERRA_DECIMAL).toString(10)
        : bnBalance
            .div(ASSET.ETHER_BASE_DECIMAL / ASSET.TERRA_DECIMAL)
            .integerValue(BigNumber.ROUND_DOWN)
            .div(ASSET.TERRA_DECIMAL)
            .toString(10)
    }

    return ''
  }

  return {
    getAssetList,
    getUSTWallet,
    formatBalance,
  }
}

export default useAsset
