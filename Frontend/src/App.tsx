import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import * as React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppMenu } from "./components/AppMenu";
import { HomePage } from "./components/HomePage";
import { ShowAllAuthors } from "./components/authors/ShowAllAuthors";
import { AuthorDetails } from "./components/authors/AuthorDetails";
import { AddAuthor } from "./components/authors/AddAuthor";
import { DeleteAuthor } from "./components/authors/DeleteAuthor";
import { UpdateAuthor } from "./components/authors/UpdateAuthor";
import { AuthorWithAvgBookLength } from "./components/authors/AuthorsStatisticalReport";
import { SortAuthors } from "./components/authors/SortAuthors";
import { ShowAllBooks } from "./components/books/ShowAllBooks";
import { BookDetails } from "./components/books/BookDetails";
import { ShowAllGenres } from "./components/genres/ShowAllGenres";
import { GenreDetails } from "./components/genres/GenreDetails";
import { AddGenre } from "./components/genres/AddGenre";
import { DeleteGenre } from "./components/genres/DeleteGenre";
import { UpdateGenre } from "./components/genres/UpdateGenre";
import { DeleteBook } from "./components/books/DeleteBook";
import { AddBook } from "./components/books/AddBook";
import { UpdateBook } from "./components/books/UpdateBook";
import { BookWithAvgAuthorAge } from "./components/books/BooksStatisticalReport";
import { FilterBooks } from "./components/books/FilterBooks";
import { AddAuthorsToBook } from "./components/books/AddAuthorsToBook";
import { ToastContainer } from "react-toastify";
import { UserDetails } from "./components/users/UserDetails";
import { UserLogin } from "./components/users/UserLogin";
import { ConfirmCode, DisplayConfirmationCode, UserRegister } from "./components/users/UserRegister";
import { UserLogout } from "./components/users/UserLogout";
import { ChatMessages } from "./components/chats/Chat";


function App() {

  return (
	
		<React.Fragment>
			<ToastContainer />
			<Router>
				<AppMenu />

				<Routes>
					<Route path="/" element={<HomePage />} />

					<Route path="/authors" element={<ShowAllAuthors />} />
					<Route path="/authors/add" element={<AddAuthor />} /> 
					<Route path="/authors/:authorId/details" element={<AuthorDetails />} />
					<Route path="/authors/:authorId/delete" element={<DeleteAuthor />} />
					<Route path="/authors/:authorId/edit" element={<UpdateAuthor />} />
					<Route path="/authors/order-by-page-number" element={<AuthorWithAvgBookLength />} />	
					<Route path="/authors/ordered-authors" element={< SortAuthors/>} />	

					<Route path="/books" element={<ShowAllBooks />} />
					<Route path="/books/add" element={<AddBook />} /> 
					<Route path="/books/:bookId/details" element={<BookDetails />} />
					<Route path="/books/:bookId/delete" element={<DeleteBook />} />
					<Route path="/books/:bookId/edit" element={<UpdateBook />} /> 
					<Route path="/books/order-by-author-age" element={<BookWithAvgAuthorAge />} />
					<Route path="/books/filter-year" element={<FilterBooks />} />
					<Route path="/books/add-authors" element={<AddAuthorsToBook />} />

					<Route path="/genres" element={<ShowAllGenres />} />
					<Route path="/genres/add" element={<AddGenre />} /> 
					<Route path="/genres/:genreId/details" element={<GenreDetails />} />
					<Route path="/genres/:genreId/delete" element={<DeleteGenre />} />
					<Route path="/genres/:genreId/edit" element={<UpdateGenre />} />

					<Route path="/users/:userId/details" element={<UserDetails />}/>
					<Route path="/login" element={<UserLogin />}/>
					<Route path="/logout" element={<UserLogout />}/>
					
					<Route path="/register" element={<UserRegister />}/>
					<Route path="/register/:confirmationCode/show-confirm-code" element={<DisplayConfirmationCode />} />
					<Route path="/register/confirm/:confirmationCode" element={<ConfirmCode />} />

					<Route path="/chat" element={<ChatMessages />} />
				</Routes>
			</Router>
		</React.Fragment>
	);
}

export default App
