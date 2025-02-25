import React, { useCallback, useState, useEffect } from 'react'
import { GoogleMap, Marker, useJsApiLoader, InfoWindow, Circle } from '@react-google-maps/api';
import { Box, Button, CircularProgress, Divider, List, ListItem, ListItemText } from '@mui/material'
import { useStations } from '../../hooks/useStations';
import Counter from './counter';
import useBooking from '../../hooks/useBooking';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import TicketList from '../panel/modals/ticketlist';
import { BikeList } from '../panel/modals/bikelist';

const containerStyle = {
  display: 'flex',
  flexGrow: '1',
  alignItems: 'center',
  justifyContent: 'center'
};

const mapContainerStyle = {
  width: '100vw',
};

const center = {
  lat: 40.4378698,
  lng: -3.8196206
};

const options = {
  strokeColor: '#11DD11',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 80000,
  zIndex: 1
}

const StationBookingList = ({ stationId }) => {
  const [bookings, setBookings] = useState([]);
  const stations = useStations();
  const { isLogged } = useAuth();
  const { reservation, createReservation, setReservation } = useBooking();

  useEffect(() => {
    stations.loadClientDetails(stationId);
  }, [stations.loadClientDetails, reservation]);

  useEffect(() => {
    if (!stations.state.error && stations.stationDetails) {
      setBookings(stations.stationDetails.bookings || []);
    }
  }, [stations.stationDetails]);

  return (
    <>
      {isLogged && (
        <Button
          sx={{ mt: 1 }}
          disabled={stations.stationDetails?.av_bike_ct <= 0 || !!reservation?.id}
          fullWidth
          variant="contained"
          onClick={() => createReservation(stationId)}
        >Book a Bike</Button>
      )}
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        {stations.state.loading ? (
          <CircularProgress />
        ) : (
          <List sx={{ maxHeight: '20vmin', overflowY: 'auto' }}>
            <Divider />
            {bookings.length === 0 && (
              <>
                <ListItem>
                  <ListItemText primary="No bookings on this station." />
                </ListItem>
                <Divider />
              </>
            )}
            {bookings.map(b =>
              <React.Fragment key={b.id}>
                <ListItem sx={{ display: 'flex', flexDirection: 'column', }}>
                  <ListItemText
                    primary={(reservation?.id === b.id ? 'Your' : 'A') + ' bike is booked until:'}
                  />
                  <Counter
                    date={b.time_end}
                    width="100%"
                    timeUp={() => {
                      stations.loadClientDetails(stationId);
                      if (reservation?.id === b.id) {
                        setReservation({});
                      }
                    }}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            )}
          </List>
        )}
      </Box>
    </>
  );
};

const StationClientInfoWindow = ({ station, closeCb }) => {
  return (
    <InfoWindow
      position={{ lat: station.lat, lng: station.lon }}
      onCloseClick={closeCb}
    >
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <img style={{ maxWidth: '20vmin', margin: 'auto' }} src={`/api/data/${station.image}`} alt={`Station ${station.id}`} title={`Station ${station.id}`} />
          <h2>{station.name}</h2>
          {station.dist >= 0 && <div>Distance from center of circle: {station.dist.toFixed(2)} km</div>}
          <div>Available bikes: {station.av_bike_ct}</div>
          <div>Available slots: {station.av_slots}</div>
          <div>Number of booked bikes: {station.av_bike_ct}</div>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <StationBookingList stationId={station.id} />
        </Box>
      </Box>
    </InfoWindow>
  )
};

const StationMaintainerInfoWindow = ({ station, closeCb }) => {
  const openCustomModal = useModal();

  const openBikeModal = () => openCustomModal(BikeList, {bikes: station.bike, onTicketClosed: openBikeModal});

  return (
    <InfoWindow
      key={station.id}
      position={{ lat: station.lat, lng: station.lon }}
      onCloseClick={closeCb}
    >
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <img style={{ maxWidth: '20vmin', margin: 'auto' }} src={`/api/data/${station.image}`} alt={`Station ${station.id}`} title={`Station ${station.id}`} />
        </Box>
        <Box sx={{ display: 'flex', ml: 2, mb: 2, flexDirection: 'column' }}>
          <h2>Station Info:</h2>
          <div>Station name: {station.name}</div>
          <div>Station ID: {station.id}</div>
          <div>Station IP: {station.ip ?? '(None)'}</div>
          <div>GPS Coords: {station.lat}, {station.lon}</div>
          <div>Maintainer: {station.maintainer?.dni ?? '(None)'}</div>
          <div>Number of slots: {station.nslots}</div>
          <div>Number of maintainer tickets: {station.maintenance_ticket.length}</div>
          <Button
            sx={{ mt: 1 }}
            disabled={station.maintenance_ticket.length === 0}
            fullWidth
            variant="contained"
            onClick={() => openCustomModal(TicketList, {tickets: station.maintenance_ticket})}
          >View Tickets ({station.maintenance_ticket.length})</Button>

          <Button
            sx={{ mt: 1 }}
            disabled={station.bike.length === 0}
            fullWidth
            variant="contained"
            onClick={openBikeModal}
          >View Bikes ({station.bike.length})</Button>
        </Box>
      </Box>
    </InfoWindow>
  );
};

const StationMapComponent = ({ type = "client" }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GMAPS_PUBLIC_KEY || "NONE",
  });

  const [map, setMap] = useState(null);
  const [circleCenter, setCircleCenter] = useState({ ...center });
  const [infoWindows, setInfoWindows] = useState([]);
  const stations = useStations();

  const addInfoWindow = useCallback(win => {
    setInfoWindows([...infoWindows.filter(w => w.key != win.key), win]);
  }, [infoWindows, setInfoWindows]);

  const closeInfoWindow = useCallback(winKey => {
    setInfoWindows([...infoWindows.filter(w => w.key != winKey)]);
  }, [infoWindows, setInfoWindows]);

  // useEffect(() => { // clean windows
  //   setInfoWindows([...infoWindows.filter(w => stations.stationList.find(v => v.id == w.key))]);
  // }, [stations.stationList, setInfoWindows]);

  const onLoad = useCallback(map => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(map => {
    setMap(null);
  }, []);

  const onCenterChanged = () => {
    if (!map) {
      return;
    }

    const c = map.getCenter();
    setCircleCenter({ lat: c.lat(), lng: c.lng() });
  };

  const requestReload = () => {
    switch (type) {
      case 'client':
        stations.loadClientStations(circleCenter.lat, circleCenter.lng);
        break;

      case 'maintenance':
        stations.loadMaintenanceStations(circleCenter.lat, circleCenter.lng);
        break;
    }
  };

  return isLoaded ? (
    <GoogleMap
      containerStyle={containerStyle}
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={7}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onCenterChanged={onCenterChanged}
      onIdle={requestReload}
    >
      {type === 'client' && (
        <Circle
          center={circleCenter}
          options={options}
        />
      )}

      { // Markers
        stations.stationList.map(station => (
          <Marker
            key={station.id}
            title={station.name}
            position={{ lat: station.lat, lng: station.lon }}
            label={type === 'maintenance' ? station.maint_ticket_ct : undefined}
            onClick={() => addInfoWindow(
              <React.Fragment key={station.id}>
                {type === 'client' && (
                  <StationClientInfoWindow
                    station={station}
                    closeCb={() => closeInfoWindow(station.id)}
                  />
                )}
                {type === 'maintenance' && (
                  <StationMaintainerInfoWindow
                    station={station}
                    closeCb={() => closeInfoWindow(station.id)}
                  />
                )}
              </React.Fragment>
            )}
          />
        ))
      }

      { // Currently open InfoWindows
        infoWindows
      }
    </GoogleMap>
  ) : (
    <Box sx={containerStyle}>
      <CircularProgress />
    </Box>
  );
}

export const StationMap = React.memo(StationMapComponent);
