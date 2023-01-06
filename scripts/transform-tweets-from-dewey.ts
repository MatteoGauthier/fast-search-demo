import { readFile, writeFile } from "fs/promises"

async function main() {
  const tweets_not_formatted = JSON.parse(await readFile("../data/tweets.json", "utf-8"))
  const tweets = []
  for (let i = 0; i < tweets_not_formatted.length; i++) {
    const item = tweets_not_formatted[i]
    tweets.push(...item.tweets)
  }

  console.log("🚀 ~ file: test.ts:6 ~ tweets", tweets)

  writeFile("../data/formatted_tweets.json", JSON.stringify(tweets))
}

main()
