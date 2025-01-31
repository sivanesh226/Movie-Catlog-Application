# Movie Catalog Application

## Introduction
Movie Catalog is a web application built with Angular that allows users to search, filter, and view detailed information about movies. It integrates with an external movie API to fetch real-time movie data and provides an intuitive interface for users to explore movie details.

## Features
✔️ Fetch movies from a public API (TMDb API)  
✔️ Display movies in a grid layout  
✔️ Search for movies by title  
✔️ Filter movies by genre and rating  
✔️ Paginate results for easy navigation  
✔️ View detailed movie information including cast, director, ratings, and release date  
✔️ Responsive design (desktop & mobile)  
✔️ State management using RxJS  
✔️ Error handling for failed API requests and empty results  

## Technologies Used
- **Frontend:** Angular, TypeScript, Angular Material  
- **Styling:** CSS, Angular Material, Bootstrap  

## Running the Application

### Prerequisites
Ensure you have the following installed:
- **Node.js** v20.9.0  
- **Angular CLI** v18.1.0  

### Installation Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/sivanesh226/Movie-Catlog-Application
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Obtain an API key from the TMDb API provider and add it to the environment file. [Get TMDb API key here](https://www.themoviedb.org/).
4. Start the development server:
   ```sh
   ng serve
   ```
5. Open your browser and navigate to [http://localhost:4200](http://localhost:4200)

## Additional Features
- **Search for Movies**  
- **Filter Movies**  
- **Pagination**  
- **View Movie Details**  
- **Mark Favorite Movies (Stored in Local Storage)**  
- **Sort Movies by Release Year, Rating, or Title**  

## Error Handling
- Displays user-friendly error messages for failed API requests.
- Handles empty search results gracefully.
- Prevents excessive API requests with debounce techniques.

## Live Demo
The app is deployed at: [Live Link](https://smartflix.tech/)

---
Feel free to reach out if you need any modifications or further details!
