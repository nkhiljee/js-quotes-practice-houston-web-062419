document.addEventListener("DOMContentLoaded", () => {
    const ul = document.getElementById("quote-list")
    const form = document.getElementById("new-quote-form")

    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => {
        quotes.forEach(quote => renderQuote(quote))
    })

    function renderQuote(quote) {
        const li = document.createElement("li")
            li.className = "quote-card"
        const blockquote = document.createElement("blockquote")
            blockquote.className = "blockquote"
        const p = document.createElement("p")
            p.className = "mb-0"
            p.innerText = `"${quote.quote}"`
        const footer = document.createElement("footer")
            footer.className = "blockquote-footer"
            footer.innerText = quote.author
        const br = document.createElement("br")
        const button1 = document.createElement("button")
            button1.className = "btn btn-outline-success"
            button1.innerText="Likes: "
        const span = document.createElement("span")
            span.innerText = (quote.likes.length ? quote.likes.length : 0)
        const button2 = document.createElement("button")
            button2.className = "btn btn-outline-danger"
            button2.innerText="Delete"
            
        button1.append(span)
        blockquote.append(p, footer, br, button1, button2)
        li.append(blockquote)
        ul.prepend(li)

        button2.addEventListener("click", () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: "DELETE"
            })
            .then(() => {
                li.remove()
            })
        })

        let alreadyClicked = false
        button1.addEventListener("click", () => {
            if (alreadyClicked == false){
                fetch(`http://localhost:3000/likes`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quoteId: quote.id
                    })
                })
                .then(res => res.json())
                .then(like => {
                    button1.innerText = `Likes: ${quote.likes.length + 1}`
                })
            alreadyClicked = !alreadyClicked
            }
        })
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault()
        const newQuote = event.target[0].value
        const newAuthor = event.target[1].value
        fetch("http://localhost:3000/quotes", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quote: newQuote,
                author: newAuthor,
                likes: []
            })
        })
        .then(res => res.json())
        .then(quote => renderQuote(quote))
    })
})