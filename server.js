const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const request = require("request");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/News";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(MONGODB_URI);

app.get("/scrape/oo", function (req, res) {
    request("https://nplusonemag.com/online-only/", function (requestError, requestResponse, requestBody) {
        let $ = cheerio.load(requestBody);
        $("article.post").each(function (i, element) {
            let link = $(this).children("a").attr("href");
            let headline = $(this).children("h1").children("a").text();
            let excerpt = $(this).children("div.post-excerpt").children("p").text();
            let newArticle = {
                "link": link,
                "headline": headline,
                "excerpt": excerpt
            };
            if (!link || !headline || !excerpt) {
                console.log("Missing something");
            } else {
                db.Article.findOne({ "link": link }, function (err, doc) {
                    // console.log(docs);
                    if (err)
                        console.log(err);
                    if (doc) {
                        console.log("article already exists");
                    } else {
                        console.log("docs:" + doc);
                        db.Article.create(newArticle).then(function (dbArticle) {
                            // console.log(dbArticle);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                });
            }
        });
        res.send("scrape complete");
    });
});

app.get("/scrape/issue", function (req, res) {
    request("https://nplusonemag.com/magazine/issue-31/", function (requestError, requestResponse, requestBody) {
        let $ = cheerio.load(requestBody);
        $("article.post").each(function (i, element) {
            let link = $(this).children("h1.post-title").children("a").attr("href");
            let headline = $(this).children("h1.post-title").children("a").text();
            let excerpt = $(this).children("div.post-summary").children("p").text();
            let newArticle = {
                "link": link,
                "headline": headline,
                "excerpt": excerpt
            };
            if (!link || !headline || !excerpt) {
                console.log("*** Missing something ***");
            } else {
                db.Article.findOne({ "link": link }, function (err, doc) {
                    if (err)
                        console.log(err);
                    if (doc) {
                        console.log("article already exists");
                    } else {
                        db.Article.create(newArticle).then(function (dbArticle) {
                            console.log(dbArticle);
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                });
            }
        });
        res.send("Scrape complete");
    });
});

app.get("/api/articles", function (req, res) {
    db.Article.find().populate("notes").then(function (docs) {
        res.json(docs);
    });
});

app.post("/api/notes", function (req, res) {
    let associatedArticleId = req.body.article;
    let body = req.body.body;
    let user = req.body.user;

    console.log("body: " + body);
    console.log("user: " + user);
    console.log("associatedArticleId: " + associatedArticleId);

    if (body && user && associatedArticleId) {
        db.Article.findOne({ _id: associatedArticleId }, function (err, doc) {
            if (doc) {
                db.Note.create({ "body": body, "user": user }).then(function (dbNote) {
                    db.Article.findOneAndUpdate({ _id: doc._id }, { $push: { notes: dbNote._id } }, function(error, document) {
                        res.json(dbNote);
                        console.log(dbNote);
                        console.log(document);
                    });
                });
            } else {
                console.log("invalid article id");
            }
        });
    }
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});