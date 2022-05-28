// url : https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=value&format=json

// <a href="https://en.wikipedia.org/?curid=${result.pageid}">

// add listener to search field

const searchField = document.getElementById("searchBox");

// Implement a debounce function.

function debounce(fetcherFn, timer = 2000){
        
        let timeOutId;

        return function(...args){
           clearTimeout(timeOutId);
           timeOutId = setTimeout(() => {
               fetcherFn(...args);
           }, timer);
        }
}







let debouncedFetcher = debounce(fetchTitles);

searchField.addEventListener("input", e => debouncedFetcher(e.target.value));









// You could potentially break this code down to smaller functions,but I dont want to be chasing functions around.

function fetchTitles(value){
    // go fetch the requested title

    let searchResultInDom = document.getElementById("searchResults");

    let fragment = new DocumentFragment();
    
    /* critical condition.Hot reload for DOM.Ensures the DOM is not continously populated with titles without being removed.
    On "input", it checks if the DOM currently has contents,if so,it removes them,and on going down in this fn,it adds fresh relevant content.
    */
    if(searchResultInDom.innerHTML) searchResultInDom.innerHTML = "";

    let searchTerm = value;


    let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&format=json&generator=links&origin=*&srlimit=10&srsearch=${searchTerm}`;

    let promise = myFetch(url);


    promise.then(data => {
            // get the fields needed.By default we have ten documents back(as specified in the url).
            let arrayOfResults = data.query.search;
            return arrayOfResults;
    })
    .then(results => {

        results.forEach(result => {
            let title = document.createElement("h3");
            let snippet = document.createElement("p");
            let link = document.createElement("a");


            // construct the url for title
            link.setAttribute("href", `https://en.wikipedia.org/?curid=${result.pageid}`);
            link.textContent = result.title;
            
            // Bury the link in the h3 for hero formating.
            title.appendChild(link);

            snippet.innerHTML = result.snippet;  //the snippet has a span tag inside, and I want it formatted properly

            let appendToFragment = new Array(title, snippet);

            // append newly formated titles to a cold, lite DOM.
            fragment.append(...appendToFragment);
        })
        
        // Append all titles to DOM after full construction
        searchResultInDom.appendChild(fragment);

        // Highlight search terms
        textHighlighting(searchTerm, searchResultInDom);
    })
    .catch(err => {
        throw new Error("Error: " + err.message);
    })
   
}










async function myFetch(url){
        const response = await fetch(url)
        if(!response.ok) {
            throw new Error(`HTTP response error ${response.status}`);
        }

        return await response.json();
}









function textHighlighting(searchTerm, searchResultInDom){

        let re = new RegExp(searchTerm, "gi");

        let currentDomContent = searchResultInDom.innerHTML;

        let newDomContent = currentDomContent.replace(re, `<span style="background-color: #fff6ea; padding: 5px">${searchTerm}</span>`);

        searchResultInDom.innerHTML = newDomContent;    
}