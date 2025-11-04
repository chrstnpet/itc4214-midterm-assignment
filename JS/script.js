// Import header and footer

$(function() {
    $("#import-header").load("./header.html");
});

$(function() {
    $("#import-footer").load("./footer.html");
});

//----------------------------------------------------
// API integration 

const api_url = "http://api.quotable.io/random?tags=technology";
const quote = document.querySelector('#quote');
const author = document.querySelector('#author');

async function getquote(url){
    const response = await fetch(url);  
    var data = await response.json();
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
}

getquote(api_url);
