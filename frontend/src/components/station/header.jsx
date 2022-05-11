import { Box, Button, Icon, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import useModal from "../../hooks/useModal";
import { Balance } from "../global/balance";
import TicketForm from "../global/tickets/ticketForm";

const StationHeader = ({ station }) => {

  const { isLogged, logout, balance_eur_cent } = useAuth();
  const openCustomModal = useModal();


  return (
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white.main'}}>
      <Typography ml="50px" component="h1" fontWeight="900" variant="h6">
        Welcome to {station.name}
      </Typography>
      {isLogged &&
        <Box sx={{display: 'flex'}}>
          <Balance bal={balance_eur_cent} enableBuying={false} />
          <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={() => openCustomModal(TicketForm, {stationID: station.id})}><Icon>note_add</Icon> Notify Issue</Button>
          <Button variant="contained" color="white" sx={{ ml: 1, color: 'primary.dark' }} onClick={logout}><Icon>logout</Icon>Log Out</Button>
        </Box>
      }
    </Box>
  )
}

export default StationHeader;
