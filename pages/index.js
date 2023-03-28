import { useState, useEffect } from "react"
import Head from 'next/head'
import Script from 'next/script'


export default function MyPage() {


  const [prompt, setPrompt] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    const response = await fetch("/api/get-answer", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt })
    })
    const data = await response.json()
    setAnswer(data.text.trim())
    setIsLoading(false)
  }

  function handleChange(e) {
    setPrompt(e.target.value)
  }
  

  return (
    <><div>
      <Head>
        <title>gondii</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js" />
      </Head>


      <a href="/" title="gondii - reload"><h1>gondii</h1></a>
    </div><div className="container">
    <script type="text/javascript" src="/sketch.js" />
        <form className="our-form" onSubmit={handleSubmit}>
          <input className="prompt-field" type="text" onChange={handleChange}  placeholder="was siehst du"/>
          <button className="prompt-button">go</button>
        </form>
      <div className="loadCont">
        {isLoading && <div className="loading-spinner"></div>}
      </div>
        <div className="answer-area">{answer}</div>
      </div>
      </>

  )
}
