module.exports = function(app) {

    app.get("/", function(req, res) {
        res.render("index", {});
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