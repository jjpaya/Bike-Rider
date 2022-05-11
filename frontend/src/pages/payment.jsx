import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import useAuth from "../hooks/useAuth";

export const PaymentPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ok = searchParams.get('ok') == 'true';
  const navigate = useNavigate();
  const { refresh } = useAuth();

  React.useEffect(() => {
    setTimeout(() => {
      // wait for balance update
      refresh();
    }, 500);
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Container maxWidth={false} sx={{ p: 5, display: 'flex', flexGrow: 1, backgroundColor: '#F5F5F5' }}>
      <Grid container spacing={6} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={8} lg={6} >
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" gutterBottom>
              Payment status
            </Typography>
            <Typography>
              Your payment was {ok ? 'successful' : 'cancelled or rejected'}!
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleClick}
            >
              Go to main page
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
