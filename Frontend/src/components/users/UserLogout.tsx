import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { logOut, setAccount, setAuthToken } from "../../auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserLogout = () => {
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

	const handleLogout = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
        displaySuccess("You logged out successfully!");
		logOut();
		navigate("/");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
        console.log("cancel logout");
		navigate("/");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to logout?
				</CardContent>
				<CardActions>
					<Button onClick={handleLogout}>Logout</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};