import { Alert, Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import * as React from 'react';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { useAuth } from "../../provider/auth";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { PieChart } from '@mui/x-charts/PieChart';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { useNavigate, useParams } from "react-router-dom";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useCallback } from "react";

const ListFinance = () => {
  const [data, setData] = React.useState(null);
  const [chart, setChart] = React.useState([]);
  const [chart_all, setChart_all] = React.useState([]);
  const [form, setForm] = React.useState(false);
  const [formAdd, setFormAdd] = React.useState(false);
  const [formUpdate, setFormUpdate] = React.useState(false);
  const [change, setChange] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const nameRef = React.useRef();
  const descriptionRef = React.useRef();

  const navigate = useNavigate();

  const { id } = useParams();

  const auth = useAuth();

  let VND = new Intl.NumberFormat('en-US');

  const handleDeleteFinance = async (id) => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/finance/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        setMessage(res.msg);
        setStatus('success');
        setChange(!change);
        setOpen(true);
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const getData = useCallback(async () => {
    try {
      setLoad(true);
      const response = await fetch(`${auth.urlAPI}/api/v1/group/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        if (res.data.is_deleted) {
          navigate('/dashboard');
        }
        setData(res.data);

      } else {
        navigate('/dashboard');
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    } finally{
      setLoad(false);
    }
  },[id, auth.token, auth.urlAPI, navigate]);

  const get_chart_month = useCallback(async () => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/finance/month/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        setChart(res.data);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  },[auth.urlAPI, auth.token, id])

  const get_chart_all = useCallback(async () => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/finance/all/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        setChart_all(res.data);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  },[auth.token, auth.urlAPI, id])

  React.useEffect(() => {
    getData()
    get_chart_month()
    get_chart_all()
  }, [change, id, get_chart_all, get_chart_month, getData])

  const handleButtonAddMember = () => {
    setFormAdd(true);
  }

  const handleCloseFormAddMember = () => {
    setFormAdd(false);
  }

  const handleButtonAdd = () => {
    setForm(true);
  }

  const handleCloseForm = () => {
    setForm(false);
  };

  const handleButtonUpdate = () => {
    setFormUpdate(true);
  }

  const handleCloseFormUpdate = () => {
    setFormUpdate(false);
  };

  const [input, setInput] = React.useState({
    name: "",
    mon_hang: "",
    money: "",
    place: "",
    email: "",
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
    { label: 'Thu', value: 'Thu' },
    { label: 'Chi', value: 'Chi' },
    { label: 'Nợ', value: 'Nợ' },
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
      const response = await fetch(`${auth.urlAPI}/api/v1/finance`, {
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
          group: id,
        })
      })
      const res = await response.json();
      if (res.success) {
        setStatus('success');
        setOpen(true)
        setMessage(res.msg);
        setForm(false);
        setChange(!change);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequestInsert();

  }

  const handleSubmitAddMember = async (e) => {
    e.preventDefault();
    await sendRequestAddMember();
  }

  const handleSubmitEditGroup = async (e) => {
    e.preventDefault();
    const nameValue = nameRef.current.value;
    const descriptionValue = descriptionRef.current.value;
    await sendRequestEditGroup(nameValue, descriptionValue);
  }

  const sendRequestDeleteGroup = async () => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/group/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        }
      })
      const res = await response.json();
      if (res.success) {
        window.location.reload();
      } else {
        setStatus('warning');
        setMessage(res.msg)
        setOpen(true);
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const sendRequestAddMember = async () => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/group/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({
          email: input.email,
          group_id: id
        })
      })
      const res = await response.json();
      if (res.success) {
        setStatus('success');
        setMessage(res.msg);
        setOpen(true)
        setFormAdd(false);
      } else {
        setStatus('warning');
        setMessage(res.msg);
        setOpen(true)
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const sendRequestEditGroup = async (name, description) => {
    try {
      const response = await fetch(`${auth.urlAPI}/api/v1/group/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth.token
        },
        body: JSON.stringify({
          name: name,
          description: description,
          _id: id
        })
      })
      const res = await response.json();
      if (res.success) {
        setStatus('success');
        setMessage(res.msg);
        setOpen(true)
        setFormUpdate(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        setStatus('warning');
        setMessage(res.msg);
        setOpen(true)
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  }
  if(load) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <CircularProgress />
</div>
  return (
    <>
      <div style={{ display: "flex" }}>
        <PieChart
          series={[
            {
              data: chart,
            },
          ]}
          width={500}
          height={200}
        />
        <PieChart
          series={[
            {
              data: chart_all,
            },
          ]}
          width={500}
          height={200}
        />
      </div>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Button sx={{ m: 2 }} onClick={handleButtonAdd} variant="contained" startIcon={<LibraryAddIcon />} color="primary">
          Thêm
        </Button>
        <Button sx={{ m: 2 }} onClick={handleButtonAddMember} variant="contained" startIcon={<LibraryAddIcon />} color="primary">
          Thêm Thành  Viên
        </Button>
        <Button sx={{ m: 2, backgroundColor: "red" }} onClick={sendRequestDeleteGroup} variant="contained" startIcon={<AutoDeleteIcon />} color="primary">
          Delete Group
        </Button>
        <Button sx={{ m: 2 }} onClick={handleButtonUpdate} variant="contained" startIcon={<EditNoteIcon />} color="primary">
          Update Group
        </Button>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Tên chi tiêu</TableCell>
              <TableCell align="right">Người giao dịch</TableCell>
              <TableCell align="right">Tên món hàng</TableCell>
              <TableCell align="right">Loại</TableCell>
              <TableCell align="right">Số tiền</TableCell>
              <TableCell align="right">Phương thức giao dịch</TableCell>
              <TableCell align="right">Thời gian</TableCell>
              <TableCell align="right">Địa điểm</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.finances.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.user.name}</TableCell>
                <TableCell align="right">{row.mon_hang}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{VND.format(row.money)}</TableCell>
                <TableCell align="right">{row.method}</TableCell>
                <TableCell align="right">{row.date}</TableCell>
                <TableCell align="right">{row.place}</TableCell>
                <TableCell align="right">
                  <DeleteForeverIcon onClick={() => {
                    handleDeleteFinance(row._id)
                  }} />
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
                renderInput={(params) => <TextField {...params} label="Chọn loại" />} />
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
        <Dialog open={formAdd} onClose={handleCloseFormAddMember}>
          <DialogTitle>Thêm thành viên mới</DialogTitle>
          <DialogContent>
            <form>
              <TextField name="email" onChange={handleInput} sx={{ m: 1 }} label="Email thành viên" fullWidth />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFormAddMember}>Hủy</Button>
            <Button color="primary" onClick={handleSubmitAddMember}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={formUpdate} onClose={handleCloseFormUpdate}>
          <DialogTitle>Edit finance group</DialogTitle>
          <DialogContent>
            <form>
              <TextField inputRef={nameRef} defaultValue={data?.name} sx={{ m: 1 }} label="Group Name" fullWidth />
              <TextField inputRef={descriptionRef} defaultValue={data?.description} sx={{ m: 1 }} label="Description" fullWidth />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFormUpdate}>Hủy</Button>
            <Button color="primary" onClick={handleSubmitEditGroup}>Lưu</Button>
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