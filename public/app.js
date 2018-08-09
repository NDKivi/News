$(document).ready(function() {
    console.log("Link working");
    $.get("/api/articles", function(data) {
        console.log(data);

        let newDiv = $("<div='articles'></div>");
        for (let i = 0; i < data.length; i++) {
            newDiv.append(`
                <div>
                    <h1>${data[i].headline}</h1>
                    <a href='${data[i].link}' target='_blank'>View Full Article</a>
                    <p>${data[i].excerpt}</p>
                    <label for='user'>User Handle:</label>
                    <input type='text' id='user'>
                    <label for='body'>Comment:</label>
                    <textarea rows='4' cols='50' id='body'></textarea>
                    <button class='add-comment' data-article='${data[i]._id}'>Comment</button>
                </div>
            `);
        }

        newDiv.on("click", ".add-comment", function() {
            let body = $(this).siblings("#body").val();
            let user = $(this).siblings("#user").val();
            let article = $(this).data("article");

            console.log("body", body);
            console.log("user", user);
            console.log("articleID", article);

            let requestBody = {
                "body": body,
                "user": user,
                "article": article
            };

            $.post("/api/notes", requestBody, function() {
                console.log("post attempted");
            }, "json");
        });

        $("main").html(newDiv);
    });



    $()
});