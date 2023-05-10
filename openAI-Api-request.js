const content = args[0]
// const Rules = args[1]
// const content = args[2]

if (!secrets.openaiKey) {
  throw Error("Need to set OPENAI_KEY environment variable")
}

// example request:
// curl https://api.openai.com/v1/completions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d '{"model": "text-davinci-003", "prompt": "Say this is a test", "temperature": 0, "max_tokens": 7}

// example response:
// {"id":"cmpl-6jFdLbY08kJobPRfCZL4SVzQ6eidJ","object":"text_completion","created":1676242875,"model":"text-davinci-003","choices":[{"text":"\n\nThis is indeed a test","index":0,"logprobs":null,"finish_reason":"length"}],"usage":{"prompt_tokens":5,"completion_tokens":7,"total_tokens":12}}
// const openAIRequest = Functions.makeHttpRequest({
//   url: "https://api.openai.com/v1/completions",
//   method: "POST",
//   headers: {
//     Authorization: `Bearer ${secrets.openaiKey}`,
//   },
//   data: { model: "text-davinci-003", prompt: prompt, temperature: 0, max_tokens: 25 },
// })

const openAIRequest = Functions.makeHttpRequest({
  url: "https://api.openai.com/v1/moderations",
  method: "POST",
  headers: {
    Authorization: `Bearer ${secrets.openaiKey}`,
  },
  data: {
    input: content,
    temperature: 0,
    max_tokens: 3,
  },
})

const [openAiResponse] = await Promise.all([openAIRequest])
console.log("raw response", openAiResponse.data.results)

// console.log("categories", openAiResponse.data.results[0].categories)

const categories = openAiResponse.data.results[0].categories

let trueCategories = []
let trueCount = 0
for (let category in categories) {
  if (categories[category] === true) {
    trueCount++
    trueCategories.push(category)
  }
}

if (trueCount >= 1) {
  console.log(`content contains : ${trueCategories.join(", ")}`)
} else {
  console.log("content is safe ")
}

console.log("Result =", openAiResponse)

const result = openAiResponse.data.results[0].categories

return Functions.encodeString(result)
