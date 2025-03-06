/**
 * Intersperses zero-width spaces in certain words to make them illegible to password managers like
 * 1Password. This is probably terrible for screen readers...
 */
export function Munge({ children }: { children: string }) {
  const magicWords = ["name", "email", "address", "phone", "password", "code"]
  return <span dangerouslySetInnerHTML={{ __html: munge(children, magicWords) }} />
}

const munge = (text: string, words: string[]) => {
  return words.reduce(
    (result, word) =>
      result.replaceAll(new RegExp(word, "gi"), (word: string) =>
        [...word].join("&ZeroWidthSpace;"),
      ),
    text,
  )
}
