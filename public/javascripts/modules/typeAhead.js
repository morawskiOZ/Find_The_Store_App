import axios from "axios";
import dompurify from "dompurify"

function searchResultsHTML(stores) {
	return stores.map(store => {
		return `
		<a href="/stores/${store.slug}" class="search__result">
			<strong> ${store.name}</strong>
		</a>
		`;
	}).join("")
}

function  typeAhead(search) {
	if(!search) return;

	const searchInput = search.querySelector('input[name="search"]');
	
	const searchResults = search.querySelector(".search__results");
	
	searchInput.on("input", function () {
		// if there is no value , quit it
		if(!this.value){
			searchResults.style.display = "none";
			return;
		}
		
		searchResults.style.display = "block";
		searchResults.innerHTML = "";
		
		axios
			.get(`/api/search?q=${this.value}`)
			.then (res => {
				if(res.data.length){
				searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
					return
				}
			// tell the user nothing came back
				searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`)
			})
			.catch ( err => {
				console.log(err)
			})
	});
	
	// if (items){
	// 	items.forEach(element => {
	// 		console.log("działa")
	// 		element.on("mouseover", (e)=> e.classList.add(activeClass))
	// 	})
	// }
	
	// handle keyboard inputs
	let counter = -1;
	searchInput.on("keyup", (e)=> {
		
		// if they are not pressing up, down or enter just skup it
		if (![38, 40, 13].includes(e.keyCode)){
			return
		}
		const activeClass = "search__result--active";
		const current = search.querySelector(`.${activeClass}`);
		const items = search.querySelectorAll(".search__result");
		
		
		let next;
		if (e.keyCode === 40 && current) {
			next = current.nextElementSibling || items[0];
		} else if (e.keyCode === 40 ){
			next = items[0]
		} else if (e.keyCode === 38 && current ) {
			next = current.previousElementSibling || items[items.length-1]
		}else if (e.keyCode === 38) {
			next = items[items.length -1]
		}else if (e.keyCode === 13 && current.href){
			window.location = current.href;
			return;
		}
		if (current){
			current.classList.remove(activeClass)
		}
		next.classList.add(activeClass)
		
		
	// 	const allA = [...searchResults.querySelectorAll("a")];
	// 	allA.forEach( element=> {
	// 		element.style.backgroundColor = "";
	// 	});
	// 	if (e.keyCode === 40) {
	// 		counter++;
	// 		if (counter > allA.length-1) {
	// 			counter = 0
	// 		}
	// 	}
	// 		if (e.keyCode === 38) {
	// 			counter--;
	// 			if (counter < 0) {
	// 				counter = allA.length-1
	// 		}
	// 	}
	// 	allA[counter].style.backgroundColor = "grey";
	// 		if (e.keyCode === 13){
	// 			allA[counter].click();
	// 		}
	//
	//
	})
	
}

export default typeAhead;