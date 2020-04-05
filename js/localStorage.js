//local storage load a render
let comments=[];
if(localStorage.blogComments){
    comments=JSON.parse(localStorage.blogComments);
}
renderCommentary();


//event for form
document.getElementById("commentary").addEventListener("submit", ev => {
    const formData = document.getElementById("commentary").elements;

    ev.preventDefault();

    const submitObject = {
        name: checkRequired(formData["name"]),
        email: checkRequired(formData["email"]),
        url: formData["url"].value,
        rating: getRadio(formData["rating"]),
        textarea: checkRequired(formData["textarea"]),
        date: new Date()
    };

    comments.push(submitObject);
    localStorage.blogComments = JSON.stringify(comments);

    commentInfo("Comment added", "green");
    renderCommentary();

    document.getElementById("commentary").reset();
});


//delete button  ---------------
document.getElementById("delete").addEventListener("click", ev => {
    let i;
    for(i = 0; i < comments.length; i++){
        const DAY = 86400000; //time of day in ms
        if( (new Date() - new Date(comments[i].date)) > DAY){
            comments.splice(i, 1);
            i--;
        }
    }

    localStorage.blogComments = JSON.stringify(comments);
    renderCommentary();
});


function renderCommentary() {
    if(comments.length == 0){
        document.getElementById("delete").style.visibility = "hidden";
    } else {
        document.getElementById("delete").style.visibility = "visible";
    }

    let commentsAsHTML = "";
    for (const opn of comments) {
        commentsAsHTML += parseForMustache(opn);
    }
    document.getElementById("comments").innerHTML = commentsAsHTML;
}

function commentInfo(text, color) {
    const value = document.createTextNode(text);

    document.getElementById("infoOutput").style.color = color;
    if(document.getElementById("infoOutput").childNodes.length > 0){
        document.getElementById("infoOutput").firstChild.replaceWith(value);
    } else {
        document.getElementById("infoOutput").appendChild(value);
    }
}

function checkRequired(elem) {
    const submission = elem.value.trim();
    if(submission === ""){
        commentInfo("If missing, then set value for required", "red");
        throw new Error("Required input is empty!");
    }
    return submission;
}

function getRadio(elem) {
    let submission = "";
    elem.forEach(v => {
        if(v.checked){
            submission = v.value;
        }
    });
    return submission;
}

function parseForMustache(submitObjekt) {
    const data = {
        name: submitObjekt.name,
        email: submitObjekt.email,
        url: submitObjekt.url == "" ? '' : '<img src="' + submitObjekt.url + '" alt="">',
        rating: submitObjekt.rating,
        textarea: submitObjekt.textarea,
        date: (new Date(submitObjekt.date)).toLocaleDateString("sk-SK", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };

    const template = document.getElementById("commentOutput").innerHTML;
    return Mustache.render(template, data);
}
