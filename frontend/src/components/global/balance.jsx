import { Box, Button, CircularProgress, Icon, Popover, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React from "react";
import useSubscription from '../../hooks/useSubscription';
import Form from "./form";
import { rules } from "../../utils/validate";
import usePayments from "../../hooks/usePayments";

const BalancePopup = ({ bal, enableBuying = true }) => {
  const { subscription } = useSubscription();
  const [creditAdd, setCreditAdd] = React.useState(false);
  const [buyAmount, _setBuyAmount] = React.useState(5);
  const { state, paymentStart, stripe } = usePayments();

  const handleSubmit = () => {
    paymentStart(Math.floor(buyAmount * 100))
    .then(v => stripe.redirectToCheckout({sessionId: v}));
  };

  const setBuyAmount = n => {
    if (+n > 0) {
      _setBuyAmount(+(+n).toFixed(2));
    } else {
      _setBuyAmount('');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography fontWeight={"bold"}>Remaining credit:</Typography>
            </TableCell>
            <TableCell>
              <Typography fontSize={24}>
                {bal % 100 != 0 ? (bal / 100).toFixed(2) : bal / 100} EUR
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography fontWeight={"bold"}>Subscription:</Typography>
            </TableCell>
            <TableCell>
              <Typography>
                {subscription?.name || 'None'}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography fontWeight={"bold"}>Price:</Typography>
            </TableCell>
            <TableCell>
              {subscription?.min_minutes && <Typography>
                {('' + subscription?.min_minutes).substring(3)}h FREE,
              </Typography>}
              <Typography fontSize={14}>
                {(subscription?.cent_minute || 5) / 100} EUR/min
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {enableBuying &&
        (!creditAdd ? (
          <Button fullWidth sx={{mt: 1}} variant="contained" onClick={() => setCreditAdd(true)}>Add credit</Button>
        ) : (
          <Form>
            <Box sx={{display: 'flex', mt: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TextField
                variant="standard"
                type="number"
                sx={{mr: 2, width: 100}}
                getter={buyAmount}
                setter={setBuyAmount}
                rules={[rules.buyAmount]}

              />
              <Button disabled={state.loading} variant="contained" onSubmit={handleSubmit}>
                { !state.loading ? 'Buy EUR' : <CircularProgress />}
              </Button>
            </Box>
          </Form>
        ))
      }
    </Box>
  )
};

export const Balance = ({ bal, sx = {}, enableBuying }) => {
  const [anchorElBalance, setAnchorElBalance] = React.useState(null);

  const handleOpenBalance = (event) => {
    setAnchorElBalance(event.currentTarget);
  };

  const handleCloseBalance = () => {
    setAnchorElBalance(null);
  };

  return (
    <Box sx={{ flexGrow: 1, ...sx }}>
      <Button
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenBalance}
        color="inherit"
      >
        {bal % 100 != 0 ? (bal / 100).toFixed(2) : bal / 100} EUR
      </Button>
      <Popover
        id="balance-appbar"
        anchorEl={anchorElBalance}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElBalance)}
        onClose={handleCloseBalance}
      >
        <BalancePopup bal={bal} enableBuying={enableBuying} />
      </Popover>
    </Box>
  );
};
