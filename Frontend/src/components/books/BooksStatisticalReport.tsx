import { useEffect, useState } from "react";
import { Container, TableContainer, TableHead, TableRow, TableCell, TableBody, colors, Paper } from "@mui/material";
import { BACKEND_URL } from "../../constants";

import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

interface BookWithAverageAuthorAgeDTO{
    id: number;
    title: string;
    description: string;
    year: number;
    pages: number;
    price: number;
    transcript: string;
    averageAuthorAge: number;
}

export const BookWithAvgAuthorAge= () => {
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([])

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/books/get/orderedAuthors`)
        .then(response => response.json())
        .then(data => { setBooks(data); setLoading(false); });
    } , []);

    return (
      <Container>
         <h2 style={{textAlign: "left", marginLeft: "12px"}}>Books with their average author age</h2>
         {!loading && books.length === 0 && <div>No books in the list</div>}
         {!loading &&
            books.length > 0 && (
                // set the table background color to white and the text color to black
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 600}} aria-label="simple table">
                        <Thead>
                            <Tr>
                                <Th align="center">#</Th>
                                <Th align="center">Title</Th>
                                <Th align="center">Description</Th>
                                <Th align="center">Year</Th>
                                <Th align="center">Pages</Th>
                                <Th align="center">Price</Th>
                                <Th align="center">Transcript</Th>
                                <Th align="center">Average Author Age</Th>
                            </Tr>
                        </Thead>
                        
                        <Tbody>
                        {books.map((book: BookWithAverageAuthorAgeDTO, index) => (
                            <Tr key={book.id}>
                                <Td align="center" component="th" scope="row">{index + 1}</Td>
                                <Td align="center" component="th" scope="row">{book.title}</Td>
                                <Td align="center">{book.description}</Td>
                                <Td align="center">{book.year}</Td>
                                <Td align="center">{book.pages}</Td>
                                <Td align="center">{book.price}</Td>
                                <Td align="center">{book.transcript}</Td>
                                <Td align="center">{book.averageAuthorAge}</Td>
                            </Tr>
                        ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )
            } 
      </Container>
    )
  }