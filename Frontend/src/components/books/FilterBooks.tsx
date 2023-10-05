import { SetStateAction, useState } from 'react';
import { TextField, Button, Container, TableContainer, colors, TableHead, TableCell, TableRow, TableBody, Tooltip, IconButton, Paper } from '@mui/material';
import ReadMoreIcon from "@mui/icons-material/ReadMore"
import EditIcon from "@mui/icons-material/Edit"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import { Link } from "react-router-dom";
import { BACKEND_URL } from '../../constants';
import { Book } from '../../models/Book';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

export const FilterBooks = () => {
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState<Book[]>([]);

    const handleYearChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setYear(event.target.value);
    };

    const handleFilterClick = () => {
        fetch(`${BACKEND_URL}/books/filter/${year}`)
        .then(response => response.json())
        .then(data => setBooks(data));
    };

    return (
        <Container>
             <Container style={{backgroundColor: "purple", borderRadius: 10}}>
                <TextField 
                    label="Year" 
                    onChange={handleYearChange} 
                    InputProps={{style: {color: "white"}}}
                />
                <Button variant="contained" onClick={handleFilterClick}>Filter</Button>
            </Container>
            {!loading && books.length === 0 && <div>No books published after the given year.</div>}
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
							</Tr>
						</Thead>
						<Tbody>
							{books.map((book, index) => (
								<Tr key={book.id}>
									<Td component="th" scope="row">
										{index + 1}
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
           
        </Container>
    );
}