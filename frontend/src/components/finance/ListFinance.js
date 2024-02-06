import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect } from "react";
import * as React from 'react';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const ListFinance = () => {
  const [form, setForm] = React.useState(false);

  const handleButtonAdd = () => {
    setForm(true);
  }

  const handleCloseForm = () => {
    setForm(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Button onClick={handleButtonAdd} variant="contained" startIcon={<LibraryAddIcon />} color="primary">
          Thêm
        </Button>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))} */}
          </TableBody>
        </Table>
        <Dialog open={form} onClose={handleCloseForm}>
          <DialogTitle>Thêm mới chi tiêu</DialogTitle>
          <DialogContent>
            <form>
              <TextField label="Field 1" fullWidth />
              {/* Add more form fields as needed */}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>Hủy</Button>
            <Button color="primary">Lưu</Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
}

export default ListFinance;





