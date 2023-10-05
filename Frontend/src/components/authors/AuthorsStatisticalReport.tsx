import { useEffect, useState } from "react";
import { Container, TableContainer, TableHead, TableRow, TableCell, TableBody, colors, Paper } from "@mui/material";
import { BACKEND_URL } from "../../constants";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';



interface AuthorAvgBookLengthDTO{
    id: number;
    name: string;
    yearOfBirth: number;
    address: string;
    email: string;
    phoneNumber: string;
    avgPages: number;
}

export const AuthorWithAvgBookLength = () => {
    const [loading, setLoading] = useState(false);
    const [authors, setAuthors] = useState([])

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}/authors/get/orderedBooks`)
        .then(response => response.json())
        .then(data => { setAuthors(data); setLoading(false); });
    } , []);

    return (
      <Container>
         <h2 style={{textAlign: "left", marginLeft: "12px"}}>Authors with their average book length</h2>
         {!loading && authors.length === 0 && <div>No authors in the list</div>}
         {!loading &&
            authors.length > 0 && (
                // set the table background color to white and the text color to black
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 600}} aria-label="simple table">
                        <Thead>
                            <Tr>
                                <Th align="center">#</Th>
                                <Th align="center">Name</Th>
                                <Th align="center">Year of Birth</Th>
                                <Th align="center">Address</Th>
                                <Th align="center">Email</Th>
                                <Th align="center">Phone Number</Th>
                                <Th align="center">Average Book Length</Th>
                            </Tr>
                        </Thead>
                        
                        <Tbody>
                        {authors.map((author: AuthorAvgBookLengthDTO, index) => (
                            <Tr key={author.id}>
                                <Td align="center" component="th" scope="row">{index + 1}</Td>
                                <Td align="center" component="th" scope="row">{author.name}</Td>
                                <Td align="center">{author.yearOfBirth}</Td>
                                <Td align="center">{author.address}</Td>
                                <Td align="right" style={{ whiteSpace: "pre-line", maxWidth: "200px", wordBreak: "break-word" }}>{author.email}</Td>
					            <Td align="right" style={{ whiteSpace: "pre-line", maxWidth: "200px", wordBreak: "break-word" }}>{author.phoneNumber}</Td>
                                <Td align="center">{author.avgPages}</Td>
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