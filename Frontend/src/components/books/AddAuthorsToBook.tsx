import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { debounce } from "lodash";
import { Author } from "../../models/Author";
import { Book } from "../../models/Book";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BookWithAuthorDTO{
    bookId?: number;
    authorId: number[];
    bookRating: number;
    authorRating: number;
}


export const AddAuthorsToBook = () => {
	const navigate = useNavigate();

	const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
	const [bookAuthor, setBookAuthor] = useState<BookWithAuthorDTO>({
		bookId: 0,
		authorId: [],
		bookRating: 0,
		authorRating: 0,
	});

	// authors
	const fetchSuggestionsAuthors = async (query: string) => {
		try {
			const response = await axios.get<Author[]>(
				`${BACKEND_URL}/authors/autocomplete?query=${query}&pageNumber=1&pageSize=100`
			);
			const data = await response.data;
			setAuthors(data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const debouncedFetchSuggestionsAuthors = useCallback(debounce(fetchSuggestionsAuthors, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchSuggestionsAuthors.cancel();
		};
	}, [debouncedFetchSuggestionsAuthors]);

	const handleInputChangeAuthors = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchSuggestionsAuthors(value);
		}
	};


	// books
	const fetchSuggestionsBooks = async (query: string) => {
		try {
			const response = await axios.get<Book[]>(
				`${BACKEND_URL}/books/autocomplete-book?query=${query}`
			);
			const data = await response.data;
			setBooks(data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const debouncedFetchSuggestionsBooks = useCallback(debounce(fetchSuggestionsBooks, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchSuggestionsBooks.cancel();
		};
	}, [debouncedFetchSuggestionsBooks]);

	const handleInputChangeBooks = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchSuggestionsBooks(value);
		}
	};

	const displayError = (message: string) => {
		toast.error(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	  };	  

	const displaySuccess = (message: string) => {
		toast.success(message, {
		  position: toast.POSITION.TOP_CENTER,
		});
	};	

	const addBookAuthor = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`${BACKEND_URL}/books/${bookAuthor?.bookId}/authorsList/`, bookAuthor);
			navigate("/books");
		} catch (error: any) {
			console.log(error);
			if (error.response.status === 401) {
				displayError("You don't have permission to do this action it!");
			  } else {
				displayError(error.response.data);
			  }
		}
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addBookAuthor} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
						<Autocomplete
                                id="bookId"
                                options={books}
                                getOptionLabel={(option) => `${option.title} - ${option.year} - ${option.description}`}
                                renderInput={(params) => <TextField {...params} label="Book" variant="outlined" />}
                                filterOptions={(x) => x}
                                onInputChange={handleInputChangeBooks}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        setBookAuthor({ ...bookAuthor, bookId: value.id });
                                    }
                                }}
                            />
						
						<TextField
                            id="bookRating"
                            label="Book Rating"
                            variant="outlined"
                            onChange={(event) => setBookAuthor({...bookAuthor, bookRating: parseInt(event.target.value)})}
						/>

						<Autocomplete
							multiple
							id="authorId"
							options={authors}
							getOptionLabel={(option) => `${option.name} - ${option.yearOfBirth} - ${option.email}`}
							renderInput={(params) => <TextField {...params} label="Authors" variant="outlined" placeholder="Authors"/>}
							filterSelectedOptions
							onInputChange={handleInputChangeAuthors}
							onChange={(event, value) => {
								if (value) {
									console.log(value);
									const authorIds = value.map((author) => author?.id) as number[];
           							setBookAuthor({ ...bookAuthor, authorId: authorIds });
								}
							}}
                    	/> 


                        <TextField
                            id="authorRating"
                            label="Author Rating"
                            variant="outlined"
                            onChange={(event) => setBookAuthor({...bookAuthor, authorRating: parseInt(event.target.value)})}
						/>

						<Button type="submit">Add BookAuthor</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};