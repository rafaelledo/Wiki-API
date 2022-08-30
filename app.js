const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.route("/articles").
    get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err)
            }
        })
    }).
    post((req, res) => {
        // POST
        console.log(req.body.title)
        console.log(req.body.content)

        // CREATE
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save((err) => {
            if (!err) {
                res.send("New article saved.")
            } else {
                res.send(err)
            }
        })
    }).
    delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Deleted all the documents.")
            } else {
                res.send(err)
            }
        })
    })

app.route("/articles/:articleTitle")    

    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("Article not found")
            }
        })
    })

    .put((req, res) => {
        try{
            Article.updateOne(
                {"title": req.params.articleTitle},
                {$set: {"title": req.body.title, "content": req.body.content}},
                (err) => {
                    if (!err) {
                        console.log("Document updated")
                    }
                }
            )
        } catch (e) {
            console.log(e)
        }
    })

    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Article updated")
                } else {
                    res.send(err)
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send("Article deleted")
                } else {
                    res.send(err)
                }
            }
        )
    })

app.listen(3000, () => {
    console.log("Server started on port 3000")
})