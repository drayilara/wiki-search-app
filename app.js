// url : https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=value&format=json

// add listener to search field

const searchField = document.getElementById("searchBox");


searchField.addEventListener("input", fetchTitles);

function fetchTitles(evt){
    // go fetch the requested title

    let searchTerm = evt.target.value;

    console.log(evt);

    let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchTerm}`;

    let promise = myFetch(url);

    promise.then(data => {
            //create fragment

            const fragment = new DocumentFragment();

            // get the fields needed
            let arrayOfResults = data.query.search;

            arrayOfResults.forEach(result => {

                // create html to render
                let h3 = document.createElement("h3");
                let p = document.createElement("p");

                h3.textContent = result.title;
                p.innerHTML = result.snippet;

                const newNodes = [h3, p];

                fragment.append(...newNodes);
            })

            document.body.appendChild(fragment);


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

















// let counter = 0;

// function debounce(fn, delay){
//    let timer;
//    return function(){
//    clearTimeout(timer);
//    timer = setTimeout(() => {
//            fn();
//        }, delay);
//    }
// }

// function logger(){
//     console.log(++counter);
// }

// logger = debounce(logger, 1000)

// addEventListener("scroll",logger)