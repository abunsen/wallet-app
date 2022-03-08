/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useCallback } from 'react'
import { BoxProps } from '@shopify/restyle'
import { useTranslation } from 'react-i18next'
import Clipboard from '@react-native-community/clipboard'
import Toast from 'react-native-simple-toast'
import { Theme } from '../theme/theme'
import useHaptic from '../utils/useHaptic'
import TouchableOpacityBox from './TouchableOpacityBox'
import Text from './Text'
import { ellipsizeAddress } from '../utils/accountUtils'

type Props = BoxProps<Theme> & { address: string }

const CopyAddress = ({ address, ...boxProps }: Props) => {
  const { triggerNavHaptic } = useHaptic()
  const { t } = useTranslation()

  const showToast = useCallback(() => {
    if (!address) return
    Toast.show(
      t('generic.copied', {
        target: ellipsizeAddress(address),
      }),
    )
  }, [address, t])

  const copyAddress = useCallback(() => {
    if (!address) return

    Clipboard.setString(address)
    showToast()
    triggerNavHaptic()
  }, [address, showToast, triggerNavHaptic])

  return (
    <TouchableOpacityBox
      {...boxProps}
      flexDirection="row"
      borderRadius="round"
      alignItems="center"
      padding="m"
      justifyContent="center"
      onPress={copyAddress}
      marginRight="ms"
    >
      <Text variant="body1" fontSize={17} color="primaryText">
        {ellipsizeAddress(address)}
      </Text>
    </TouchableOpacityBox>
  )
}

export default memo(CopyAddress)