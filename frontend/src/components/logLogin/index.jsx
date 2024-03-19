import { useCallback, useState } from "react"
import { useAuth } from "../../provider/auth";
import { Alert, Button, CircularProgress, Snackbar, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function LogLogin() {
    const [load, setLoad] = useState(false);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const auth = useAuth();

    const sendRequestGetData = useCallback(async () => {
        try {
            setLoad(true)
            const response = await fetch(`${auth.urlAPI}/api/v1/user/logs`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": auth.token
                },
            })
            const res = await response.json();
            if (res.success) {
                setStatus('success');
                setData(res.data)
                setOpen(true)
                setMessage(res.msg);
            } else {
                setStatus('warning');
                setOpen(true);
                setMessage(res.msg)
                throw new Error(res.msg);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoad(false);
        }
    }, [auth.token, auth.urlAPI]);

    useEffect(() => {
        sendRequestGetData();
    }, [sendRequestGetData]);

    const handleClose = ()=>{
        setOpen(false);
    }

    if (load) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </div>
    return <>
        <Table sx={{ minWidth: 650, mt: 1, ml:1, mr:1 }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                    <TableCell>login_date</TableCell>
                    <TableCell align="right">expires_in</TableCell>
                    <TableCell align="right">logout_date</TableCell>
                    <TableCell align="right">ip_address</TableCell>
                    <TableCell align="right">device_info</TableCell>
                    <TableCell align="right">browser_info</TableCell>
                    <TableCell align="right">is_active</TableCell>
                    <TableCell align="center">Logout</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data && data.map((row) => (
                    <TableRow
                        key={row._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {row.login_date}
                        </TableCell>
                        <TableCell align="right">{row.expires_in}</TableCell>
                        <TableCell align="right">{row.logout_date}</TableCell>
                        <TableCell align="right">{row.ip_address.split(":").pop()}</TableCell>
                        <TableCell align="right">{row.device_info}</TableCell>
                        <TableCell align="right">{row.browser_info}</TableCell>
                        <TableCell align="right">{
                            row.is_active?<text style={{color: 'green'}}>Active</text>:<text style={{color:'red'}}>Inactive</text>
                        }</TableCell>
                        <TableCell align="center">
                            {row.is_active?<Button variant="contained">Logout</Button>:<></>}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={status}>
          {message}
        </Alert>
      </Snackbar>
    </>
}