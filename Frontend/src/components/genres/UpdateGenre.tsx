import { Button, Card, CardActions, CardContent, Container, FormLabel, IconButton, TextField, colors } from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import { Author } from "../../models/Author";
import { Genre } from "../../models/Genre";


export const UpdateGenre = () => {
    const { genreId } = useParams<{ genreId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [genre, setGenre] = useState<Genre>({
        id: parseInt(String(genreId)),
        name: "",
        description: "",
        subgenre: "",
        countryOfOrigin: "",
        genreRating: 0, 
        bookList: []

    });

    useEffect(() => {    
        setLoading(true);
        fetch(`${BACKEND_URL}/genres/${genreId}/`).then(response => response.json()).then(data => {
          setGenre(data);
          setLoading(false);
        });
      }, [genreId]);

    const updateGenre = async (event: { preventDefault: () => void }) => {
        event.preventDefault();
        setLoading(true);
        fetch(`${BACKEND_URL}/genres/${genreId}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(genre)
        }).then(response => {
            if (response.ok) {
                alert("Genre updated successfully");
            } else {
                console.error('Error updating genre:', response.statusText);
            }
            navigate(`/genres/`);
            setLoading(false);
        }).catch(error => {
            console.error('Error updating genre:', error);
            setLoading(false);
        });
    }

    const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/genres");
	};

    return (
        <Container>
            <Card>
				<CardContent>
                    <IconButton component={Link} sx={{ mr: 3 }} to={`/genres`}>
						<ArrowBackIcon />
					</IconButton>{" "}
                    <form onSubmit={updateGenre} style={{display: "flex", flexDirection: "column", padding: "8px"}}>
                        <Container sx={{padding: "3px"}} style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <FormLabel style={{marginTop: "15px", fontSize: "18px"}}>
                                Name
                            </FormLabel>
                            <TextField
                                id="name"
                                variant="outlined"
                                value={genre.name}
                                onChange={(event) => setGenre({ ...genre, name: event.target.value })}
                            />
                        </Container>
    
                        <Container sx={{padding: "3px"}} style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <FormLabel style={{marginTop: "15px", fontSize: "18px"}}>
                                Description
                            </FormLabel>
                            <TextField
                                id="description"
                                variant="outlined" 
                                value={genre.description}
                                onChange={(event) => setGenre({ ...genre, description: event.target.value })}
                            />
                        </Container>

                        <Container sx={{padding: "3px"}} style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <FormLabel style={{marginTop: "15px", fontSize: "18px"}}>
                                Subgenre
                            </FormLabel>
                            <TextField
                                id="subgenre"
                                variant="outlined"
                                value={genre.subgenre}
                                onChange={(event) => setGenre({ ...genre, subgenre: event.target.value })}
                            />
                        </Container>

                        <Container sx={{padding: "3px"}} style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <FormLabel style={{marginTop: "15px", fontSize: "18px"}}>
                                Country of Origin
                            </FormLabel>
                            <TextField
                                id="countryOfOrigin"
                                variant="outlined"
                                value={genre.countryOfOrigin}
                                onChange={(event) => setGenre({ ...genre, countryOfOrigin: event.target.value })}
                            />
                        </Container>
                        
                        <Container sx={{padding: "3px"}} style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
                            <FormLabel style={{marginTop: "15px", fontSize: "18px"}}>
                                Genre Rating
                            </FormLabel>
                            <TextField
                                id="genreRating"
                                variant="outlined"
                                value={genre.genreRating}
                                onChange={(event) => setGenre({ ...genre, genreRating: parseInt(event.target.value) })}
                            />
                        </Container>
                    </form>
				</CardContent>
				<CardActions sx={{ justifyContent: "center" }}>
					<Button type="submit" onClick={updateGenre} variant="contained">Update</Button>
					<Button onClick={handleCancel} variant="contained">Cancel</Button>
				</CardActions>
			</Card>
        </Container>
    );
}