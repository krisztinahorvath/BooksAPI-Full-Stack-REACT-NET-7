import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import {Button, CircularProgress, colors, Container, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Author } from "../../models/Author";
import { Link, useLocation} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ViewListIcon from '@mui/icons-material/ViewList';
import { PagePreference } from "../users/UserDetails";
import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

let page = 1;
export const ShowAllAuthors = () => {
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);

	let [pageSize, setPageSize] = useState(10);

	const [noOfPages, setNoOfPages] = useState(0);

	useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/authors/total-number-pages?pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNoOfPages(parseInt(data));
			console.log(noOfPages);
            setLoading(false); });
    } , []);

	const [nrBooks, setNrBooks] = useState([]);
	  
	useEffect(() => {
		page = 1;
        setLoading(true);
        fetch(`${BACKEND_URL}/authors/count-books?pageNumber=${page-1}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNrBooks(data); 
            setLoading(false); });
    } , []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/authors`)
        .then(response => response.json())
        .then(data => { 
            setAuthors(data); 
            setLoading(false); });
    } , []);

	const reloadData = () => {
		setLoading(true);
		Promise.all([
			fetch(`${BACKEND_URL}/authors/?pageNumber=${page-1}&pageSize=${pageSize}`).then(response => response.json()),
			fetch(`${BACKEND_URL}/authors/count-books?pageNumber=${page-1}&pageSize=${pageSize}`).then(response => response.json()),
		])
			.then(([data, count]) => {
				setAuthors(data);
				setNrBooks(count);
				setLoading(false);
			});
	};

	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		page = value;
		reloadData();
	  };

	  const location = useLocation();
	  const path = location.pathname;

    return (
		<Container>
			<h1>All authors</h1>
			{loading && <CircularProgress />}
			{!loading && authors.length === 0 && <p>No authors found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/add`}>
					<Tooltip title="Add a new author" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/ordered-authors`}>
					<Tooltip title="Sort authors alphabetically" arrow>
						<FilterListIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && (
			<Button
				variant={path.startsWith("/authors/order-by-page-number") ? "outlined" : "text"}
				to="/authors/order-by-page-number"
				component={Link}
				color="inherit"
				sx={{ mr: 5 }}
				startIcon={<ViewListIcon />}>
				Authors With Average Book Length
			</Button> )}

			{!loading && authors.length > 0 && (
			<TableContainer component={Paper} >
			<Table  >
				<Thead>
				<Tr>
					<Th>#</Th>
					<Th>Name</Th>
					<Th>Year of Birth</Th>
					<Th>Address</Th>
					<Th>Email</Th>
					<Th>Phone Number</Th>
					<Th>No of Books</Th>
					<Th>User Name</Th>
					<Th>Action</Th>
				</Tr>
				</Thead>
				<Tbody>
				{authors.map((author, index) => (
					<Tr key={(page - 1) * 10 + index + 1}>
					<Td>{(page - 1) * 10 + index + 1}</Td>
					<Td>
						<Link to={`/authors/${author.id}/details`} title="View authors details">
						{author.name}
						</Link>
					</Td>
					<Td>{author.yearOfBirth}</Td>
					<Td>{author.address}</Td>
					<Td align="right" style={{ whiteSpace: "pre-line", maxWidth: "200px", wordBreak: "break-word" }}>{author.email}</Td>
					<Td align="right" style={{ whiteSpace: "pre-line", maxWidth: "200px", wordBreak: "break-word" }}>{author.phoneNumber}</Td>
					<Td align="center">{nrBooks.at(index)}</Td>
					<Td align="right" style={{ whiteSpace: "pre-line", maxWidth: "200px", wordBreak: "break-word" }}>
						<Link to={`/users/${author.userId}/details`} title="View user profile">
						{author.userName}
						</Link>
					</Td>
					<Td >
						<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${author.id}/details`}>
						<Tooltip title="View author details" arrow>
							<ReadMoreIcon color="primary" />
						</Tooltip>
						</IconButton>

						<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${author.id}/edit`}>
						<EditIcon />
						</IconButton>

						<IconButton component={Link} sx={{ mr: 3 }} to={`/authors/${author.id}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
						</IconButton>
					</Td>
					</Tr>
				))}
				</Tbody>
			</Table></TableContainer>
			)}
		<Container style={{ backgroundColor: 'white', borderRadius: 10, width: '100%', maxWidth: 500, margin: '0 auto'}}>
			<Stack spacing={2}>
				<Pagination count={noOfPages} page={page} onChange={handlePageChange} size="large" variant="outlined" color="secondary" />
			</Stack> 
		</Container>	
		</Container>
	);
}