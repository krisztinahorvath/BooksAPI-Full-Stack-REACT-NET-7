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
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { debounce } from "lodash";
import { Author } from "../../models/Author";
import { Book } from "../../models/Book";
import { Genre } from "../../models/Genre";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UpdateBook = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books/${bookId}/`).then(response => response.json()).then(data => {
          setBook(data.books);
          setLoading(false);
        });
      }, [bookId]);

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

    const updateBook = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        fetch(`${BACKEND_URL}/books/${bookId}/`, { // use axios.put
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(book) 
        }).then(response => {
            if (response.ok) {
                displaySuccess("The book was updated successfully!");
            } else {
                console.error('Error updating book:', response.statusText);
               displayError(response.statusText);
            }
            navigate(`/books`);
            setLoading(false);
        }).catch(error => {
            console.error('Error updating book:', error);
            displayError(error);
            setLoading(false);
        });
    }

    const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/books");
	};

    const [genreNames, setGenreNames] = useState<Genre[]>([]);

	const fetchSuggestions = async (query: string) => {
		try {
			const response = await axios.get<Genre[]>(
				`${BACKEND_URL}/books/autocomplete-genre?query=${query}`
			);
			const data = await response.data;
			setGenreNames(data);
		} catch (error) {
			console.error("Error fetching suggestions:", error);
		}
	};

	const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 500), []);

	useEffect(() => {
		return () => {
			debouncedFetchSuggestions.cancel();
		};
	}, [debouncedFetchSuggestions]);

    const handleInputChange = (event: any, value: any, reason: any) => {
		console.log("input", value, reason);

		if (reason === "input") {
			debouncedFetchSuggestions(value);
		}
	};

    return (
        <Container>
            <Card>
				<CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
						<ArrowBackIcon />
					</IconButton>{" "}
                    <form onSubmit={updateBook} style={{display: "flex", flexDirection: "column", padding: "8px", width: 400}}>
                    <TextField style={{margin: 10}}
                            id="title"
                            label="Title"
                            variant="outlined"
                            value={book.title}
                            onChange={(event) => setBook({...book, title: event.target.value})}
						/>
                        <TextField style={{margin: 10}}
                            id="description"
                            label="Description"
                            variant="outlined"
                            value={book.description}
                            onChange={(event) => setBook({...book, description: event.target.value})}
						/>
                        <TextField style={{margin: 10}}
                            id="year"
                            label="Year"
                            variant="outlined"
                            value={book.year}
                            onChange={(event) => setBook({...book, year: parseInt(event.target.value)})}
						/>
                        <TextField style={{margin: 10}}
                            id="pages"
                            label="Pages"
                            variant="outlined"
                            value={book.pages}
                            onChange={(event) => setBook({...book, pages: parseInt(event.target.value)})}
						/>
                        <TextField style={{margin: 10}}
                            id="price"
                            label="Price"
                            variant="outlined"
                            value={book.price}
                            onChange={(event) => setBook({...book, price: parseFloat(event.target.value)})}
						/>
                        <TextField style={{margin: 10}}
                            id="transcript"
                            label="Transcript"
                            variant="outlined"
                            value={book.transcript}
                            onChange={(event) => setBook({...book, transcript: event.target.value})}
						/>
                        <Autocomplete style={{margin: 10}}
                                id="genreId"
                                options={genreNames}
                                getOptionLabel={(option) => `${option.name} - ${option.subgenre} - ${option.countryOfOrigin}`}
                                renderInput={(params) => <TextField {...params} label="Genre" variant="outlined" />}
                                filterOptions={() => genreNames}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        setBook({ ...book, genreId: value.id });
                                    }
                                }}
                        />
                    </form>
				</CardContent>
				<CardActions sx={{ justifyContent: "center" }}>
					<Button type="submit" onClick={updateBook} variant="contained">Update</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
			</Card>
        </Container>
    );
}