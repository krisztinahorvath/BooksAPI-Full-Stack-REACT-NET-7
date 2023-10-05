import { CssBaseline, Container, Typography } from "@mui/material";
import React from "react";

export const HomePage = () => {
	return (
		<React.Fragment>
			<CssBaseline />

			<Container>
				<Typography variant="h4" component="h4" gutterBottom>
					So many books, so little time...
				</Typography>
			</Container>
		</React.Fragment>
	);
};