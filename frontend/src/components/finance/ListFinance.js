import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
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

  const types = [
    { label: 'Lựa chọn 1', value: 'option1' },
    { label: 'Lựa chọn 2', value: 'option2' },
    { label: 'Lựa chọn 3', value: 'option3' },
    // Thêm các lựa chọn khác nếu cần
  ];

  const methods = [
    {label: 'Vietcombank', value: 'Vietcombank'},
    {label: 'Timo', value: 'Timo'},
    {label: 'Momo', value: 'Momo'},
    {label: 'Tiền mặt', value: 'Tiền mặt'}
  ]

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Button sx={{m:2}} onClick={handleButtonAdd} variant="contained" startIcon={<LibraryAddIcon />} color="primary">
          Thêm
        </Button>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Tên chi tiêu</TableCell>
              <TableCell align="right">Tên món hàng</TableCell>
              <TableCell align="right">Loại mặt hàng</TableCell>
              <TableCell align="right">Số tiền</TableCell>
              <TableCell align="right">Phương thức giao dịch</TableCell>
              <TableCell align="right">Địa điểm</TableCell>
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
              <TextField sx={{m:1}} label="Tên chi tiêu" fullWidth />
              <TextField sx={{m:1}} label="Tên món hàng" fullWidth/>
              <Autocomplete
              options={types}
              sx={{m:1, mr:-1}}
              getOptionLabel={(option) => option.label}
               renderInput={(params) => <TextField {...params} label="Chọn loại hàng"/>}/>
               <TextField sx={{m:1}} label="Số tiền" fullWidth/>
               <Autocomplete
              options={methods}
              sx={{m:1, mr:-1}}
              getOptionLabel={(option) => option.label}
               renderInput={(params) => <TextField {...params} label="Chọn phương thức giao dịch"/>}/>
               <TextField sx={{m:1}} label="Nơi giao dịch" fullWidth/>
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





