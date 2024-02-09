import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import * as React from 'react';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useAuth } from "../../provider/auth";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const ListFinance = () => {
  const [data, setData] = React.useState(null);
  const [form, setForm] = React.useState(false);
  const auth = useAuth();
  const [load, setLoad] = React.useState(true);

  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState('');


  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/v1/finance', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        setData(res.data);
        setStatus('success');
        setOpen(true)
        setMessage(res.msg);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoad(false)
    }
  }

  React.useEffect(() => {
    getData()
  }, [form])

  const handleButtonAdd = () => {
    setForm(true);
  }

  const handleCloseForm = () => {
    setForm(false);
  };

  const [input, setInput] = React.useState({
    name: "",
    mon_hang: "",
    money: "",
    place: "",
  })

  const [selectedMethod, setSelectedMethod] = React.useState(null);
  const [selectedType, setSelectedType] = React.useState(null);

  const handleMethodChange = (event, newValue) => {
    setSelectedMethod(newValue);
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedType(newValue);
  };

  const handleInput = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const types = [
    { label: 'Lựa chọn 1', value: 'option1' },
    { label: 'Lựa chọn 2', value: 'option2' },
    { label: 'Lựa chọn 3', value: 'option3' },
    // Thêm các lựa chọn khác nếu cần
  ];

  const methods = [
    { label: 'Vietcombank', value: 'Vietcombank' },
    { label: 'Timo', value: 'Timo' },
    { label: 'Momo', value: 'Momo' },
    { label: 'Tiền mặt', value: 'Tiền mặt' }
  ]

  const sendRequestInsert = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/v1/finance', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({
          name: input.name,
          mon_hang: input.mon_hang,
          money: input.money,
          place: input.place,
          type: selectedType.value,
          method: selectedMethod.value,
        })
      })
      const res = await response.json();
      if (res.success) {
        setStatus('success');
        setOpen(true)
        setMessage(res.msg);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true)
    await sendRequestInsert();
    setLoad(false)
    setForm(false);
  }

  if (load) {
    return <></>
  }
  else
    return (
      <>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Button sx={{ m: 2 }} onClick={handleButtonAdd} variant="contained" startIcon={<LibraryAddIcon />} color="primary">
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
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.mon_hang}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.money}</TableCell>
                  <TableCell align="right">{row.method}</TableCell>
                  <TableCell align="right">{row.place}</TableCell>
                  <TableCell align="right">
                  <DeleteForeverIcon onClick={()=>console.log(row._id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={form} onClose={handleCloseForm}>
            <DialogTitle>Thêm mới chi tiêu</DialogTitle>
            <DialogContent>
              <form>
                <TextField name="name" onChange={handleInput} sx={{ m: 1 }} label="Tên chi tiêu" fullWidth />
                <TextField name="mon_hang" onChange={handleInput} sx={{ m: 1 }} label="Tên món hàng" fullWidth />
                <Autocomplete
                  options={types}
                  value={selectedType}
                  onChange={handleTypeChange}

                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  sx={{ m: 1, mr: -1 }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} label="Chọn loại hàng" />} />
                <TextField name="money" onChange={handleInput} sx={{ m: 1 }} label="Số tiền" fullWidth />
                <Autocomplete
                  name="method"
                  options={methods}
                  value={selectedMethod}

                  onChange={handleMethodChange}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  sx={{ m: 1, mr: -1 }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} label="Chọn phương thức giao dịch" />} />
                <TextField name="place" onChange={handleInput} sx={{ m: 1 }} label="Nơi giao dịch" fullWidth />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm}>Hủy</Button>
              <Button color="primary" onClick={handleSubmit}>Lưu</Button>
            </DialogActions>
          </Dialog>
        </TableContainer>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={status}>
            {message}
          </Alert>
        </Snackbar>
      </>
    );
}

export default ListFinance;





