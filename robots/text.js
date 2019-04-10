const algorithmia = require ('algorithmia')
const algorithmiaApiKey = require ('../credencials/algorithmia.json').apiKey

async function robot(content){
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    //breakContentIntoSentences(content)

    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponde.get()
        console.log(wikipediaContent)

        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDatesInParentheses(withoutBlankLinesAndMarkdown)
        console.log(withoutDatesInParentheses)

        function removeBlankLinesAndMarkdown(text){
            const allLines = text.split('\n')
            
            const withoutBlankLinesAndMarkdown = allLines.filter((line) =>{
                if (line.trim().length === 0 || line.trim().startsWith('=')){
                    return false
                }
                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }
    
    function removeDatesInParentheses(text) {
        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

}

module.exports = robot