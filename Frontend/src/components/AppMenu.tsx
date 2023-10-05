import { AppBar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography, colors } from "@mui/material";
import { Link, useLocation} from "react-router-dom";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import AddIcon from '@mui/icons-material/Add';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAuthToken } from "../auth";
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Authors', 'Books', 'Genres', 'Chat'];
const settings = ['Login', 'Register', 'Logout'];
export const AppMenu = () => {
    const location = useLocation();
	const path = location.pathname;
	const isAuthenticated = Boolean(getAuthToken());

	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

	const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
		null
	);
	
	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	  };

	  const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	  };

	return (
		<AppBar position="static" sx={{backgroundColor: colors.purple[200]}}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component="a"
						href="/"
						sx={{
						mr: 2,
						display: { xs: 'none', md: 'flex' },
						color: 'inherit',
						textDecoration: 'none',
						}}
					    >
						Books management
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
							>
							<MenuIcon />
            			</IconButton>

						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: 'block', md: 'none' },
							}}
							>
							{pages.map((page) => (
  								<MenuItem key={page} 
									component={Link} to={`/${page.toLowerCase()}`} 
									onClick={handleCloseNavMenu} 
									selected={location.pathname === `/${page.toLowerCase()}`}>
									<Typography textAlign="center">{page}</Typography>
  								</MenuItem>
							))}						
						</Menu>
					</Box>

					<MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
						mr: 2,
						display: { xs: 'flex', md: 'none' },
						flexGrow: 1,
						color: 'inherit',
						textDecoration: 'none',
						}}
					>
						Books management
					</Typography>

					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
						<Button
							key={page}
							component={Link}
							to={`/${page.toLowerCase()}`}
							onClick={handleCloseNavMenu}
							sx={{ my: 2, color: 'white', display: 'block' }}
						>
							{page}
						</Button>
						))}
					</Box>

					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open user profile">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<PersonIcon sx={{color: "white"}}/>
							</IconButton>
						</Tooltip>
						<Menu
						sx={{ mt: '45px' }}
						id="menu-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
						>
						{settings.map((setting) => {
							if (setting === 'Login' && isAuthenticated) {
								return null; // hide the Login button if authenticated
							} else if (setting === 'Logout' && !isAuthenticated) {
								return null; // hide the Logout button if not authenticated
							} else if (setting === "Register" && isAuthenticated) {
								return null;
							} else {
								return (
									<MenuItem
									key={setting}
									component={Link}
									to={`/${setting.toLowerCase()}`}
									onClick={handleCloseNavMenu}
									selected={location.pathname === `/${setting.toLowerCase()}`}
									>
									<Typography textAlign="center">{setting}</Typography>
									</MenuItem>
								);
							}
						})}
						</Menu>
					</Box>
					
				</Toolbar>
			</Container>
			</AppBar>
	)
}