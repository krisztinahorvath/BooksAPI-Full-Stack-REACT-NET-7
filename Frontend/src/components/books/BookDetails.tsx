import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { alignProperty } from "@mui/material/styles/cssUtils";
import { BACKEND_URL } from "../../constants";
import { Author } from "../../models/Author";
import { AuthorWithBookDTO } from "../../models/AuthorWithBookDTO";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Book } from "../../models/Book";
import { Genre } from "../../models/Genre";


interface BookWithAuthorDTO{
    book: Book;
    author: Author[];
}

export const BookDetails = () => {
	const { bookId } = useParams();
	
	const [book, setBook] = useState<Book>({
        id: parseInt(String(bookId)),
        title: "",
        description: "",
        year: 0,
        pages: 0,
        price: 0,
        transcript: "",
        genreId: 0,
        genre: {} as Genre
    });

	const [authors, setAuthors] = useState<Author[]>([]);

	useEffect(() => {
		const fetchBook = async () => {
			const response = await fetch(`${BACKEND_URL}/books/${bookId}`);
			const data = await response.json();
			setBook(data.books);
			setAuthors(data.authors);
		};
		fetchBook();
	}, [bookId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h3>Book Details</h3>
					<p>Title: {book.title}</p> 
                	<p>Description: {book.description}</p>
                    <p>Year: {book.year}</p>
                    <p>Pages: {book.pages}</p>
                    <p>Price: {book.price}</p>
					<p>Transcript: {book.transcript}</p>
					<p>Genre: {book.genre?.name}</p>
					<p>Subgenre: {book.genre?.subgenre}</p>
                    <p style={{textAlign: "left", marginLeft: "12px"}}>Authors:</p>
                    <ul>
						{authors.map(author => (
							<li key={author.email}>{author.name}</li>
						))}
					</ul>
				</CardContent>
                <CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${bookId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${bookId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>

			</Card>
		</Container>
	);
};