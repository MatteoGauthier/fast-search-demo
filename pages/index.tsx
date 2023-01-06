import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "../styles/Home.module.css"
import { create, insertBatch, search, SearchResult, formatNanoseconds } from "@lyrasearch/lyra"
import { useState } from "react"
import json_tweets from "../data/formatted_tweets.json"

const allTweets = JSON.stringify(json_tweets)

type Search = SearchResult<{
  tweet_content: "string"
  posted_by: "string"
}> | null

const tweetsDB = create({
  schema: {
    tweet_content: "string",
    posted_by: "string",
  },
})

export default function Home() {
  const [result, setResult] = useState<Search>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const searchTerm = e.target.value
    const searchResult = search(tweetsDB, {
      term: searchTerm,
      properties: "*",
    })

    setResult(searchResult)
  }

  const handleIngestDataSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const source = e.currentTarget.source.value

    const tweets = JSON.parse(source)

    insertBatch(tweetsDB, tweets, tweets.length)
    console.log("data ingested")
  }

  return (
    <>
      <main>
        <h1>Fast Search website in order to demo Lyra</h1>

        <form onSubmit={handleIngestDataSubmit}>
          <h2>Add the raw data source here</h2>
          <textarea defaultValue={allTweets} name="source" id="srouce" cols={30} rows={5}></textarea>
          <button>Ingest data</button>
        </form>
        <hr />
        <h2>Make a search here</h2>
        <input autoFocus type="text" onChange={handleChange} />
        <pre>
          <>{result?.count} results</>
        </pre>
        <pre>{<>{result?.elapsed && formatNanoseconds(result?.elapsed)} seconds</>}</pre>
        {result && (
          <ul>
            {result.hits.map((r) => (
              <li key={r.id}>
                <p>{r.document.tweet_content}</p> - <p>{r.document.posted_by}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
