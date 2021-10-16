import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { CSAccount, SecureAccount } from '../../storage/AccountStorageProvider'

export type OnboardingOpt = 'import' | 'create' | 'assign'

type OnboardingData = {
  onboardingType: OnboardingOpt
  account?: CSAccount
  secureAccount?: SecureAccount
  words: string[]
}

const useOnboardingHook = () => {
  const initialState = {
    onboardingType: 'import',
    words: [],
  } as OnboardingData
  const [onboardingData, setOnboardingData] =
    useState<OnboardingData>(initialState)

  const reset = useCallback(() => {
    setOnboardingData(initialState)
  }, [initialState])

  return { onboardingData, setOnboardingData, reset }
}

const initialState = {
  onboardingData: {
    onboardingType: 'import' as OnboardingOpt,
    words: [] as string[],
  },
  setOnboardingData: () => undefined,
  reset: () => undefined,
}

const OnboardingContext =
  createContext<ReturnType<typeof useOnboardingHook>>(initialState)
const { Provider } = OnboardingContext

const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  return <Provider value={useOnboardingHook()}>{children}</Provider>
}

export const useOnboarding = () => useContext(OnboardingContext)

export default OnboardingProvider