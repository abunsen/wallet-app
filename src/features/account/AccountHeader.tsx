import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NetTypes as NetType } from '@helium/address'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import AccountIcon from '../../components/AccountIcon'
import Box from '../../components/Box'
import Text from '../../components/Text'
import { CSAccount } from '../../storage/cloudStorage'
import {
  ellipsizeAddress,
  formatAccountAlias,
  networkCurrencyType,
} from '../../utils/accountUtils'
import useAccountRewardsSum from './useAccountRewardsSum'
import { getSecureAccount } from '../../storage/secureStorage'
import TouchableOpacityBox from '../../components/TouchableOpacityBox'
import { HomeNavigationProp } from '../home/homeTypes'
import useAppear from '../../utils/useAppear'
import { useOnboarding } from '../onboarding/OnboardingProvider'
import { useAppStorage } from '../../storage/AppStorageProvider'

type Props = {
  account: CSAccount
}
const AccountHeader = ({ account }: Props) => {
  const { t } = useTranslation()
  const navigation = useNavigation<HomeNavigationProp>()
  const { change, minutesAgo, formattedChange, tokenChange } =
    useAccountRewardsSum(account.address)
  const { setOnboardingData } = useOnboarding()
  const { showNumericChange, updateShowNumericChange } = useAppStorage()
  const [isRestoredAccount, setIsRestoredAccount] = useState(false)

  useAppear(async () => {
    if (!account?.address || !!account.ledgerDevice) {
      setIsRestoredAccount(false)
      return
    }
    const secureAccount = await getSecureAccount(account.address)
    setIsRestoredAccount(secureAccount === undefined)
  })

  const ticker = useMemo(
    () => networkCurrencyType(account.netType).ticker,
    [account.netType],
  )

  const hadPositiveChange = useMemo(
    () => !tokenChange || tokenChange >= 0,
    [tokenChange],
  )

  const restoreAccount = useCallback(() => {
    setOnboardingData((prev) => ({ ...prev, netType: account.netType }))
    Alert.alert(
      t('restoreAccount.alert.title'),
      t('restoreAccount.alert.message', {
        address: ellipsizeAddress(account.address),
      }),
      [
        {
          text: t('restoreAccount.alert.button12'),
          onPress: () =>
            navigation.navigate('ImportAccount', {
              screen: 'AccountImportScreen',
              params: {
                wordCount: 12,
                restoringAccount: true,
                accountAddress: account.address,
              },
            }),
        },
        {
          text: t('restoreAccount.alert.button24'),
          onPress: () =>
            navigation.navigate('ImportAccount', {
              screen: 'AccountImportScreen',
              params: {
                wordCount: 24,
                restoringAccount: true,
                accountAddress: account.address,
              },
            }),
        },
      ],
    )
  }, [account.address, account.netType, navigation, setOnboardingData, t])

  const toggleChangeType = useCallback(
    () => updateShowNumericChange(!showNumericChange),
    [showNumericChange, updateShowNumericChange],
  )

  return (
    <TouchableOpacityBox
      disabled={!isRestoredAccount}
      onPress={restoreAccount}
      minHeight={88}
      flexDirection="column"
      alignItems="center"
      padding="l"
      borderRadius="xl"
      overflow="hidden"
      backgroundColor={
        account.netType === NetType.TESTNET ? 'lividBrown' : 'secondary'
      }
    >
      <Box flexDirection="row" alignItems="center">
        <AccountIcon size={40} address={account.address} />
        <Box marginLeft="s" flex={1}>
          <Text variant="subtitle2" numberOfLines={1}>
            {formatAccountAlias(account)}
          </Text>
          <Text variant="body3" color="secondaryText">
            {minutesAgo !== undefined
              ? t('accountHeader.timeAgo', { formattedChange })
              : ''}
          </Text>
        </Box>
        <TouchableOpacityBox marginLeft="s" onPress={toggleChangeType}>
          {showNumericChange ? (
            <Text
              variant="subtitle2"
              color={hadPositiveChange ? 'greenBright500' : 'red500'}
            >
              {tokenChange !== undefined
                ? `${hadPositiveChange ? '+' : ''}${tokenChange.toFixed(
                    2,
                  )} ${ticker}`
                : ''}
            </Text>
          ) : (
            <Text variant="subtitle2" color="greenBright500">
              {change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : ''}
            </Text>
          )}
          <Text variant="body3" color="secondaryText" textAlign="right">
            {t('accountHeader.last24')}
          </Text>
        </TouchableOpacityBox>
      </Box>
      <Text
        variant="body3"
        color="red500"
        fontWeight="bold"
        marginTop="m"
        visible={isRestoredAccount}
      >
        {t('restoreAccount.missing')}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(AccountHeader)
