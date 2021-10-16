import React, { useCallback, useEffect, useState } from 'react'
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import MatchingWord from './MatchingWord'
import wordlist from '../../constants/wordlists/english.json'
import TextInput from '../../components/TextInput'
import TextTransform from '../../components/TextTransform'
import Box from '../../components/Box'

type Props = {
  onSelectWord: (fullWord: string, idx: number) => void
  wordIdx: number
}

export const TOTAL_WORDS = 12

const PassphraseAutocomplete = ({ onSelectWord, wordIdx }: Props) => {
  const [word, setWord] = useState('')
  const [matchingWords, setMatchingWords] = useState<Array<string>>([])
  const { t } = useTranslation()
  const ordinal = wordIdx < TOTAL_WORDS ? t(`ordinals.${wordIdx}`) : ''

  useEffect(() => {
    setMatchingWords(
      wordlist.filter((w) => w.indexOf(word.trim().toLowerCase()) === 0),
    )
  }, [word])

  const handleWordSelect = useCallback(
    (selectedWord: string) => {
      setWord('')
      onSelectWord(selectedWord, wordIdx)
    },
    [onSelectWord, wordIdx],
  )

  const handleSubmit = useCallback(() => {
    if (matchingWords.length === 0) return

    handleWordSelect(matchingWords[0])
  }, [handleWordSelect, matchingWords])

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <>
        <TextTransform
          variant="h1"
          numberOfLines={3}
          maxFontSizeMultiplier={1}
          marginHorizontal="l"
          adjustsFontSizeToFit
          paddingVertical="xxxl"
          i18nKey={t('accountImport.wordEntry.title')}
        />

        <Box minHeight={53}>
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            showsHorizontalScrollIndicator={false}
          >
            {matchingWords.length <= 20 &&
              matchingWords.map((matchingWord, idx) => (
                <MatchingWord
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${matchingWord}.${idx}`}
                  fullWord={matchingWord}
                  matchingText={word.toLowerCase()}
                  onPress={handleWordSelect}
                />
              ))}
          </ScrollView>
        </Box>
        <TextInput
          placeholder={t('accountImport.wordEntry.placeholder', {
            ordinal,
          })}
          marginHorizontal="l"
          variant="regular"
          onChangeText={setWord}
          onSubmitEditing={handleSubmit}
          value={word}
          keyboardAppearance="dark"
          autoCorrect={false}
          autoCompleteType="off"
          blurOnSubmit={false}
          returnKeyType="next"
          marginBottom="s"
          autoFocus
        />
      </>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%', flex: 1 },
})

export default PassphraseAutocomplete