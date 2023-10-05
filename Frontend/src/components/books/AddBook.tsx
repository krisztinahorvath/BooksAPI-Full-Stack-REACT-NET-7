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

export const AddBook = () => {
	const navigate = useNavigate();

	const [book, setBook] = useState<Book>({
        title: "",
        description: "",
        year: 0,
        pages: 0,
        price: 0,
        transcript: "",
        genreId: 0
    });


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

	const addBook = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
		  await axios.post(`${BACKEND_URL}/books/`, book);
		  displaySuccess("The book was added successfully!");
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
					<form onSubmit={addBook} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            onChange={(event) => setBook({...book, title: event.target.value})}
						/>
                        <TextField
                            id="description"
                            label="Description"
                            variant="outlined"
                            onChange={(event) => setBook({...book, description: event.target.value})}
						/>
                        <TextField
                            id="year"
                            label="Year"
                            variant="outlined"
                            onChange={(event) => setBook({...book, year: parseInt(event.target.value)})}
						/>
                        <TextField
                            id="pages"
                            label="Pages"
                            variant="outlined"
                            onChange={(event) => setBook({...book, pages: parseInt(event.target.value)})}
						/>
                        <TextField
                            id="price"
                            label="Price"
                            variant="outlined"
                            onChange={(event) => setBook({...book, price: parseFloat(event.target.value)})}
						/>
                        <TextField
                            id="transcript"
                            label="Transcript"
                            variant="outlined"
                            onChange={(event) => setBook({...book, transcript: event.target.value})}
						/>
                        <Autocomplete
                                id="genreId"
                                options={genreNames}
                                getOptionLabel={(option) => `${option.name} - ${option.subgenre}`}
                                renderInput={(params) => <TextField {...params} label="Genre" variant="outlined" />}
                                filterOptions={(x) => x}
                                onInputChange={handleInputChange}
                                onChange={(event, value) => {
                                    if (value) {
                                        console.log(value);
                                        setBook({ ...book, genreId: value.id });
                                    }
                                }}
                            />

						<Button type="submit">Add Book</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};