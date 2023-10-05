import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";
import {
	Autocomplete,
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
    Container
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-toastify/dist/ReactToastify.css";
import { logOut, setAccount, setAuthToken } from "../../auth";
import { User } from "../../models/User";

export const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    name: "",
    password: "",
  });

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

    const handleLogin = async (event: {preventDefault: () => void }) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${BACKEND_URL}/users/login`, user);
          const token = response.data.token;
          setAuthToken(token);
          setAccount(response.data.user);
          displaySuccess("The login was successful!");
          navigate("/");
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            const errorMessage = error.response.data;
            displayError(errorMessage);
          } else {
            displayError("An error occurred while logging in.");
          }
        }      
    };

  return (
    <Container>
      <h1>Login</h1>
        <Card>
            <CardContent>
                <IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
                    <ArrowBackIcon />
                </IconButton>{" "}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={(event) => setUser({...user, name: event.target.value})}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={(event) => setUser({...user, password: event.target.value})}
                    />

                    <Button type="submit">Login</Button>
                </form>
            </CardContent>
            <CardActions></CardActions>
        </Card>
    </Container>
);
};
