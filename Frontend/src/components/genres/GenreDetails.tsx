import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { alignProperty } from "@mui/material/styles/cssUtils";
import { BACKEND_URL } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Genre } from "../../models/Genre";

export const GenreDetails = () => {
	const { genreId } = useParams();
	const [genre, setGenre] = useState<Genre>();

	useEffect(() => {
		const fetchGenre = async () => {
			const response = await fetch(`${BACKEND_URL}/genres/${genreId}`);
			const g = await response.json();
			setGenre(g);
		};
		fetchGenre();
	}, [genreId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/genres`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h3>Genre Details</h3>
					<p>Name: {genre?.name}</p>
                    <p>Description: {genre?.description}</p>
                    <p>Subgenre: {genre?.subgenre}</p>
                    <p>Genre Rating: {genre?.genreRating}</p>
                    <p style={{textAlign: "left", marginLeft: "12px"}}>Books:</p>
                    <ul>
						{genre?.bookList?.map((book) => (
                            <li key={book.id}>{book.title}</li>
						))}
					</ul>
				</CardContent>
                <CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/genres/${genreId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/genres/${genreId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>

			</Card>
		</Container>
	);
};