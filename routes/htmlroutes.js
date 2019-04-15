var Note = require("../models/Note");
var Article = require("../models/Article");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {

    // Home Page
    app.get("/", function(req, res) {
        Article.find({}, null, {sort: {created: -1}}, function(err, data) {
            if(data.length === 0) {
                res.render("placeholder", {message: "There's nothing scraped yet. Please click \"Scrape For Newest Articles\" for fresh and delicious news."});
            }
            else{
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
                console.log("Scrape finished.");
                res.redirect("/"); 
            });

    });

    app.get("/favorites", function(req, res) {
        res.render("favorite", {});
    });

    app.get("/favorite/:id", function(req, res) {
        res.render("comment", {});
    });

    app.get("*", function(req, res) {
        res.render("404");
    });

};