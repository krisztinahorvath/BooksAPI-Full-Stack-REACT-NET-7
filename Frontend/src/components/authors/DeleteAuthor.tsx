import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../auth";


export const DeleteAuthor = () => {
	const { authorId } = useParams();
	const navigate = useNavigate();

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

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try{
			await axios.delete(`${BACKEND_URL}/authors/${authorId}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
				},
			});
			displaySuccess("Author deleted successfully!");
		}
		catch(error: any)
		{
			if (error.response.status === 401) {
				displayError("You don't have permission to perform this action it!");
			  } 
			displayError("There was an error deleting the author!");
		}		
		navigate("/authors");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		navigate("/authors");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/authors`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this author? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete it</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};