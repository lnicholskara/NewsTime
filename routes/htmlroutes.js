var Note = require("../models/Note");
var Article = require("../models/Article");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {

    // Home Page
    app.get("/", function(req, res) {
        Article.find({}, null, {
            skip:0, // Starting Row
            limit:10, // Ending Row
            sort:{
                date_added: -1 //Sort by Date Added DESC
            }
        }, function(err, data) {
            if(data.length === 0) {
                res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
            }
            else{
                console.log(data);
                res.render("index", {articles: data});
            }
        });
    });

    // Scraper
    app.get("/scrape", function(req, res) {

            console.log("Does this work?")
        
            axios.get("https://www.npr.org/sections/world/")
            .then(function(response) {
                // Then, we load that into cheerio and save it to $ for a shorthand selector
                var $ = cheerio.load(response.data);
        
                // Now, we grab every h2 within an article tag, and do the following:
                $("article.has-image").each(function(i, element) {
                // Save an empty result object
                    var result = {};
        
                    result.title = $(element).find("h2.title").text();
                    result.link = $(element).find("h2.title").children().attr("href");
                    result.summary = $(element).find("p.teaser").text();
                    result.picture = $(element).find("img").attr("src");

                    console.log(result);

                    var entry = new Article(result);
                    Article.find({title: result.title}, function(err, data) {
                    if (data.length === 0) {
                        entry.save(function(err, data) {
                            if (err) {console.log(err)}
                            console.log("This worked!")
                        });
                    }
                });
                
                });
            })
            .then(function(reply) {
                console.log("Scrape finished.");
                res.redirect("/"); 
            });

    });

    app.get("/favorites", function(req, res) {
        Article.find({favorite: true}, null, {sort: {date_added: -1}}, function(err, data) {
            if(data.length === 0) {
                res.render("placeholder", {message: "There's nothing favorited yet. Please go back to the home page and 'heart' an article."});
            }
            else{
                res.render("favorite", {articles: data});
            }
        });
    });

    app.post("/api/favorite/:id", function(req, res) {
        console.log(req.params.id);
        Article.findByIdAndUpdate(req.params.id, {$set: {favorite: true}}, {new: true}, function(err, data) {
            console.log(data);
        });
    });

    app.post("/api/remove/:id", function(req, res) {
        Article.findByIdAndUpdate(req.params.id, {$set: {favorite: false}}, {new: true}, function(err, data) {
            res.redirect("/favorites")
        });
    });

    app.get("/favorite/:id", function(req, res) {
        console.log(req.params.id);
        Article.find({_id: req.params.id}, null, function(err, data) {
        var object = data[0];
        console.log(object);
        res.render("comment", data[0]);
        });
    });

    app.get("*", function(req, res) {
        res.render("404");
    });

};