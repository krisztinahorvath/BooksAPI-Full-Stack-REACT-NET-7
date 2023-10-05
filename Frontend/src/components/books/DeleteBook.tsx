import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../auth";

export const DeleteBook = () => {
	const { bookId } = useParams();
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
	  
		try {
		  const authToken = getAuthToken();
		  await axios.delete(`${BACKEND_URL}/books/${bookId}`, {
			headers: {
			  Authorization: `Bearer ${authToken}`,
			},
		  });
		} catch (error: any) {
			console.log(error);
		  if (error.response.status === 401) {
			displayError(error.response.data);
			
		  }
		}
		// go to courses list
		navigate("/books");
	  };

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// go to courses list
		navigate("/books");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/books`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this book? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete it</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};