const filmsList = document.getElementById('films');
const movieTitle = document.getElementById('movie-title');
const moviePoster = document.getElementById('movie-poster');
const movieDescription = document.getElementById('movie-description');
const movieRuntime = document.getElementById('movie-runtime');
const movieShowtime = document.getElementById('movie-showtime');
const availableTickets = document.getElementById('available-tickets');
const buyTicketButton = document.getElementById('buy-ticket-button');

let currentFilmId = 1;


function fetchFilms() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            filmsList.innerHTML = ''; 
            films.forEach(film => {
                const li = document.createElement('li');
                li.className = 'list-group-item film item';
                li.textContent = film.title;
                li.dataset.id = film.id;
                li.addEventListener('click', () => loadFilmDetails(film.id));
                filmsList.appendChild(li);
            });
            loadFilmDetails(currentFilmId); 
        });
}


function loadFilmDetails(id) {
    fetch(`http://localhost:3000/films/${id}`)
        .then(response => response.json())
        .then(film => {
            currentFilmId = film.id;
            movieTitle.textContent = film.title;
            moviePoster.src = film.poster;
            movieRuntime.textContent = film.runtime;
            movieShowtime.textContent = film.showtime;
            movieDescription.textContent = film.description;
            const ticketsAvailable = film.capacity - film.tickets_sold;
            availableTickets.textContent = ticketsAvailable;

           
            if (ticketsAvailable <= 0) {
                buyTicketButton.textContent = 'Sold Out';
                buyTicketButton.disabled = true;
                document.querySelector(`li[data-id='${film.id}']`).classList.add('sold-out');
            } else {
                buyTicketButton.textContent = 'Buy Ticket';
                buyTicketButton.disabled = false;
                document.querySelector(`li[data-id='${film.id}']`).classList.remove('sold-out');
            }
        });
}


buyTicketButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/films/${currentFilmId}`)
        .then(response => response.json())
        .then(film => {
            if (film.tickets_sold < film.capacity) {
                film.tickets_sold++; 
                fetch(`http://localhost:3000/films/${currentFilmId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tickets_sold: film.tickets_sold }) 
                })
                .then(response => response.json())
                .then(() => {
                    loadFilmDetails(currentFilmId);
                });
            }
        });
});

fetchFilms();