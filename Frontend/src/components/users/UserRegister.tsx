import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants";
import { toast } from "react-toastify";
import {
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

export const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    const handleRegister = async (event: {preventDefault: () => void }) => {
        event.preventDefault();
        try {
          const response = await axios.post(`${BACKEND_URL}/users/register`, { name: username, password });
          const confirmationCode = response.data.confirmationCode;
          displaySuccess("You registered successfully!");
          navigate(`/register/${confirmationCode}/show-confirm-code`);
        } catch (error: any) {
          console.log(error);
          if (error.response) {
            const errorMessage = error.response.data;
            displayError(errorMessage);
          } else {
            displayError("An error occurred while registering.");
          }
        }      
    };

  return (
    <Container>
        <h1>Register</h1>
        <Card>
            <CardContent>
                <IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
                    <ArrowBackIcon />
                </IconButton>{" "}
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <Button type="submit">Register</Button>
                </form>
            </CardContent>
            <CardActions></CardActions>
        </Card>
    </Container>
);
};


export const DisplayConfirmationCode = () => {
    const { confirmationCode } = useParams<{ confirmationCode: string }>();
 const location = useLocation();
	const path = location.pathname;

    return (
        <Container>
            <h2>Your confirmation code is: {confirmationCode}</h2>
            <h2>It is valid for 10 minutes.</h2>
            <Button
                variant={path.startsWith(`/register/confirm/${confirmationCode}`) ? "outlined" : "text"}
                to={`/register/confirm/${confirmationCode}`}
                component={Link}
                color="inherit"
                sx={{ mr: 5 }}>
                Confirm
            </Button>
        </Container>
    );
};


export const ConfirmCode = () => {
   const navigate = useNavigate();
   const [confirmationCode, setConfirmationCode] = useState("");
  
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
  
      const handleConfirmCode = async (event: {preventDefault: () => void }) => {
        event.preventDefault();
        try {
          const response = await fetch(`${BACKEND_URL}/users/register/confirm/${confirmationCode}`);
          if (response.ok) {
            displaySuccess("Your account was registered successfully, you can now login!");
            navigate("/");
          } else {
            const errorMessage = await response.text();
            displayError(errorMessage);
          }
        } catch (error: any) {
          console.log(error);
          displayError("An error occurred while registering you.");
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
                  <form onSubmit={handleConfirmCode} style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
                      <TextField
                          id="confirmationcode"
                          label="Confirmation Code"
                          variant="outlined"
                          onChange={(event) => setConfirmationCode(event.target.value)}
                      />
  
                      <Button type="submit">Verify</Button>
                  </form>
              </CardContent>
              <CardActions></CardActions>
          </Card>
      </Container>
  );
  };