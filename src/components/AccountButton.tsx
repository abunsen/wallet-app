/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback } from 'react'
import ChevronDown from '@assets/images/chevronDown.svg'
import { Keyboard, StyleSheet } from 'react-native'
import { BoxProps } from '@shopify/restyle'
import TestnetIcon from '@assets/images/testnetIcon.svg'
import { NetType } from '@helium/crypto-react-native'
import { useColors, useHitSlop } from '../theme/themeHooks'
import AccountIcon from './AccountIcon'
import Box from './Box'
import Text from './Text'
import TouchableOpacityBox from './TouchableOpacityBox'
import { Theme } from '../theme/theme'

type Props = {
  onPress?: (address?: string) => void
  address?: string
  title?: string
  subtitle?: string
  showBubbleArrow?: boolean
  netType?: NetType.NetType
  innerBoxProps?: BoxProps<Theme>
  showChevron?: boolean
} & BoxProps<Theme>

const AccountButton = ({
  onPress,
  address,
  title,
  subtitle,
  showBubbleArrow,
  netType = NetType.MAINNET,
  innerBoxProps,
  showChevron = true,
  ...boxProps
}: Props) => {
  const hitSlop = useHitSlop('l')
  const { red500 } = useColors()

  const handlePress = useCallback(() => {
    Keyboard.dismiss()
    onPress?.(address)
  }, [address, onPress])

  return (
    <TouchableOpacityBox
      hitSlop={hitSlop}
      alignItems="center"
      onPress={handlePress}
      {...boxProps}
    >
      <Box
        backgroundColor={
          netType === NetType.TESTNET ? 'lividBrown' : 'secondary'
        }
        borderRadius="xl"
        alignItems="center"
        flexDirection="row"
        paddingHorizontal={innerBoxProps?.paddingHorizontal || 'l'}
        paddingVertical={innerBoxProps?.paddingVertical || 'm'}
        {...innerBoxProps}
      >
        <AccountIcon size={40} address={address} />
        <Box flex={1}>
          <Box flexDirection="row" alignItems="center">
            <Text marginLeft="ms" marginRight="xs" variant="subtitle2">
              {title}
            </Text>
            {netType === NetType.TESTNET && <TestnetIcon color={red500} />}
          </Box>
          {!!subtitle && (
            <Text marginLeft="ms" variant="body3" color="secondaryText">
              {subtitle}
            </Text>
          )}
        </Box>
        {showChevron && <ChevronDown />}
      </Box>
      {showBubbleArrow && (
        <Box
          backgroundColor={
            netType === NetType.TESTNET ? 'lividBrown' : 'secondary'
          }
          alignSelf="center"
          style={styles.rotatedBox}
        />
      )}
    </TouchableOpacityBox>
  )
}

const styles = StyleSheet.create({
  rotatedBox: {
    height: 18,
    width: 18,
    margin: -9,
    transform: [{ rotate: '45deg' }],
  },
})

export default memo(AccountButton)