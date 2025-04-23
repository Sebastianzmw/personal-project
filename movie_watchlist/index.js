const API_KEY = '7aed05a0';

const searchForm = document.getElementById("search-form");
let watchList = JSON.parse(localStorage.getItem("watchList")) || []; 
let resultArr = [];

if (searchForm) {
	searchForm.addEventListener("submit", searchMovie);
}

function searchMovie(event){
	event.preventDefault();
	const movieName = document.getElementById("search-input").value.trim();
	if (!movieName) {
		alert("Please enter a movie title");
		return;
	}
	searchMovieAPI(movieName);
}

function searchMovieAPI(movieName) {
	fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${API_KEY}`)
		.then(res => res.json())
		.then(data => {
			if(data.Response === "True")
				displayResult(data);
			else {
				const resultContainer = document.querySelector(".result");
				resultContainer.innerHTML = `
					<div class="result-empty">
						<i class="fa-solid fa-film" style="color: #DFDDDD;"></i>
						<h2 class="result-nosearch">Unable to find what you're looking for. Please try another search.</h2>
					</div>
				`;
			}
		})
		.catch(error => {
			console.log("Error fetching data: ", error)
		})
}

function displayResult(data) {
	const resultContainer = document.querySelector(".result");
	resultContainer.innerHTML = '';
	resultArr = [];

	const resultHeading = document.createElement('h2');
	resultHeading.classList.add('result__heading');
	resultHeading.textContent = `Search results for "${document.getElementById("search-input").value}":`;
	resultContainer.appendChild(resultHeading);
	
	data.Search.forEach(movie => {
		const imdbID = movie.imdbID
		fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${API_KEY}`)
			.then(res => res.json())
			.then(movieData => {
				resultArr.push(movieData);
				renderMovie(movieData, resultContainer);
			})
			.catch(error => console.log("Error fetching full movie data: ", error));
	})
}

function renderMovie(movieData, resultContainer) {
	const {imdbID, Poster, Title, imdbRating, Runtime, Genre, Plot} = movieData;
	const {btnInner, ariaLabel} = renderWatchlistBtn(imdbID);

	const movieElement = document.createElement('div');
	movieElement.className = 'movie-card';
	movieElement.innerHTML = `
		<img src="${Poster}" alt="Poster for ${Title}" class="movie-poster">
		<div class="movie-card-content">
			<div class="movie-header">
				<h3 class="movie-title">${Title}</h3>
				<p class="movie-rating">
					<i class="fa-solid fa-star" style="color: #FFD43B;"></i>
					<span class="sr-only">IMDb rating:</span> ${imdbRating}
				</p>
			</div>
			<div class="movie-info">
				<p class="movie-runtime">${Runtime}</p>
				<p class="movie-genre">${Genre}</p>
				<button class="watchlist-btn" data-watchlist="${imdbID}" aria-label="${ariaLabel}">
					${btnInner}
				</button>
			</div>
			<p class="movie-plot">${Plot}</p>
		</div>
	`;
	resultContainer.appendChild(movieElement);
}

function renderWatchlistBtn(imdbID) {
	let isInWatchlist = watchList.some(movie => movie.imdbID === imdbID);

	return {
		btnInner: isInWatchlist
			? `<i class="fa-solid fa-circle-minus" aria-hidden="true"></i> Remove`
			: `<i class="fa-solid fa-circle-plus" aria-hidden="true"></i> Watchlist`,
		ariaLabel: isInWatchlist
			? 'Remove from Watchlist'
			: 'Add to Watchlist'
	};
}

document.addEventListener('click', (event) => {
	const watchlistBtn = event.target.closest('[data-watchlist]');
	if (!watchlistBtn) return;

    const imdbID = watchlistBtn.dataset.watchlist;
	// Check if movie is already in watchlist
	const movieIndex = watchList.findIndex(m => m.imdbID === imdbID);
	if (movieIndex !== -1) {
		// Movie is in watchlist, remove it
		watchList.splice(movieIndex, 1);
	} else {
		// Movie not in watchlist, add it
		const fullMovieData = resultArr.find(m => m.imdbID === imdbID)
		if (fullMovieData)
			watchList.push(fullMovieData);
	}
	// Save updated watchlist to localStorage
	localStorage.setItem("watchList", JSON.stringify(watchList));
	// Update btn appearance
	const {btnInner, ariaLabel} = renderWatchlistBtn(imdbID);
	watchlistBtn.innerHTML = btnInner;
	watchlistBtn.setAttribute("aria-label", ariaLabel);
});

if (document.querySelector('.watchlist-page')) {
	displayWatchlist();
}

function displayWatchlist() {
	const watchlistContainer = document.querySelector('.watchlist');
	watchlistContainer.innerHTML = '';

	if (watchList.length === 0) {
		watchlistContainer.innerHTML = `
			<div class="watchlist-empty">
				<i class="fa-solid fa-film" style="color: #DFDDDD;"></i>
				<h2>Your watchlist is looking a little empty...</h2>
				<p><i class="fa-solid fa-circle-plus"></i> <a href="index.html">Let's add some movies!</a></p>
			</div>
		`;
	} else {
		watchList.forEach(movie => {
			renderMovie(movie, watchlistContainer);
		});
	}
}

