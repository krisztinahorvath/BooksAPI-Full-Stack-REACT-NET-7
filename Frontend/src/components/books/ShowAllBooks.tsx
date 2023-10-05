import { Book } from "../../models/Book";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants";
import {Button, CircularProgress, colors, Container, IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useLocation } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


let page = 1;
export const ShowAllBooks = () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);
	
    const pageSize = 10;
		const [noOfPages, setNoOfPages] = useState(0);

	useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books/total-number-pages?pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNoOfPages(parseInt(data));
			console.log(noOfPages);
            setLoading(false); });
    } , []);

	const [nrAuthors, setNrAuthors] = useState([]);
	  
	useEffect(() => {
		page = 1;
        setLoading(true);
        fetch(`${BACKEND_URL}/books/count-authors?pageNumber=${page-1}&pageSize=${pageSize}`)
        .then(response => response.json())
        .then(data => { 
            setNrAuthors(data); 
            setLoading(false); });
    } , []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books`)
        .then(response => response.json())
        .then(data => { 
            setBooks(data); 
            setLoading(false); });
    } , []);

	const reloadData = () => {
		console.log(page);
		setLoading(true);
		Promise.all([
			fetch(`${BACKEND_URL}/books/?pageNumber=${page-1}&pageSize=${pageSize}`).then((response) => response.json()),
			fetch(`${BACKEND_URL}/books/count-authors?pageNumber=${page-1}&pageSize=${pageSize}`).then((response) => response.json())
		])
			.then(([data, count]) => {
				setBooks(data);
				setNrAuthors(count);
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
			<h1>All books</h1>

			{loading && <CircularProgress />}
			{!loading && books.length === 0 && <p>No books found</p>}
			{!loading && (
				<IconButton component={Link} sx={{ mr: 3 }} to={`/books/add`}>
					<Tooltip title="Add a new book" arrow>
						<AddIcon color="primary" />
					</Tooltip>
				</IconButton>
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/filter-year") ? "outlined" : "text"}
					to="/books/filter-year"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Filter
				</Button> 
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/order-by-author-age") ? "outlined" : "text"}
					to="/books/order-by-author-age"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Books ordered by average author age
				</Button> 
			)}

			{!loading && (
				<Button
					variant={path.startsWith("/books/add-authors") ? "outlined" : "text"}
					to="/books/add-authors"
					component={Link}
					color="inherit"
					sx={{ mr: 5 }}
					startIcon={<ViewListIcon />}>
					Add authors to book
				</Button> 
			)}

			{!loading && books.length > 0 && (
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<Thead>
							<Tr>
								<Th>#</Th>
								<Th align="right">Title</Th>
								<Th align="right">Description</Th>
								<Th align="right">Year</Th>
								<Th align="right">Pages</Th>
                                <Th align="right">Price</Th>
                                <Th align="right">Transcript</Th>
                            	<Th align="right">No of Authors</Th> 
								<Th align="right">User Name</Th> 
							</Tr>
						</Thead>
						<Tbody>
							{books.map((book, index) => (
								<Tr key={(page-1) * 10 + index + 1}>
									 <Td component="th" scope="row">
									 	{(page-1) * 10 + index + 1}
									 </Td> 
									<Td component="th" scope="row">
										<Link to={`/books/${book.id}/details`} title="View book details">
											{book.title}
										</Link>
									</Td>
									<Td align="right">{book.description}</Td>
									<Td align="right">{book.year}</Td>
                                    <Td align="right">{book.pages}</Td>
                                    <Td align="right">{book.price}</Td>
                                    <Td align="right">{book.transcript}</Td>
                                    <Td align="right">{nrAuthors.at(index)}</Td>
									<Td component="th" scope="row" align="right">
										<Link to={`/users/${book.userId}/details`} title="View user profile">
											{book.userName}
										</Link>
									</Td>
									<Td align="right">
										<IconButton
											component={Link}
											sx={{ mr: 3 }}
											to={`/books/${book.id}/details`}>
											<Tooltip title="View book details" arrow>
												<ReadMoreIcon color="primary" />
											</Tooltip>
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${book.id}/edit`}>
											<EditIcon />
										</IconButton>

										<IconButton component={Link} sx={{ mr: 3 }} to={`/books/${book.id}/delete`}>
											<DeleteForeverIcon sx={{ color: "red" }} />
										</IconButton>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</TableContainer>
			)}
			<Container style={{ backgroundColor: 'white', borderRadius: 10, width: '100%', maxWidth: 500, margin: '0 auto'}}>
				<Stack spacing={2}>
					<Pagination count={noOfPages} page={page} onChange={handlePageChange} size="large" variant="outlined" color="secondary" />
				</Stack> 
			</Container>		
		</Container>
	);
}