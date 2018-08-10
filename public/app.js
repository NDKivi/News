$(document).ready(function() {
    console.log("Link working");
    $.get("/api/articles", function(data) {
        console.log(data);

        let newDiv = $("<div class='article-list'></div>");
        for (let i = 0; i < data.length; i++) {
            let articleHTML = `
                <div class='article'>
                    <h1>${data[i].headline}</h1>
                    <a href='${data[i].link}' target='_blank'>View Full Article</a>
                    <p>${data[i].excerpt}</p>
                    <div class='notes'>
                        <label for='user'>User Handle:</label>
                        <input type='text' id='user'>
                        <label for='body'>Comment:</label>
                        <textarea rows='4' cols='50' id='body'></textarea>
                        <button class='add-comment' data-article='${data[i]._id}'>Comment</button>
                        <h3>Comments:</h3>
                        <section>
                        `;

            let notes = data[i].notes;
            for (let j = notes.length-1; j >=0; j--) {
                articleHTML += `<h5>${notes[j].user}</h5>
                                <p>${notes[j].body}<p>`;
            }

            articleHTML += "</section></div></div>";
            newDiv.append(articleHTML);
        }

        newDiv.on("click", ".add-comment", function() {
            let myButton = $(this);
            let body = myButton.siblings("#body").val();
            let user = myButton.siblings("#user").val();
            let article = myButton.data("article");

            console.log("body", body);
            console.log("user", user);
            console.log("articleID", article);

            let requestBody = {
                "body": body,
                "user": user,
                "article": article
            };

            $.post("/api/notes", requestBody, function(data) {
                console.log(data);
                myButton.siblings("section").prepend(`<h5>${user}</h5>
                                        <p>${body}</p>`);
                
            }, "json");
        });

        $("main").html(newDiv);
    });

});