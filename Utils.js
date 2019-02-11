import moment from 'moment';
import { decode as atob, encode as btoa } from 'base-64';
import { DEFAULT_DISTANCE } from './Constants';
import service from './Service';

export function getIcon(type) {
  switch (type) {
    case 'bus':
      return 'bus';
    case 'bike':
      return 'bus';
    case 'water':
      return 'bus';
    case 'metro':
      return 'bus';
    case 'rail':
      return 'bus';
    case 'tram':
      return 'bus';
    case 'lock':
      return 'bus';
    case 'air':
      return 'bus';
    default:
      return null;
  }
}

export function getIconColor(type, subType) {
  const airportLinkTypes = ['airportLinkRail', 'airportLinkBus'];
  if (airportLinkTypes.includes(subType)) return 'red'; // COLORS.PLANE_MIDNIGHT

  switch (type) {
    case 'bus':
      return 'red'; // COLORS.BUS_MIDNIGHT;
    case 'bike':
      return 'red'; // COLORS.BICYCLE_MIDNIGHT;
    case 'water':
      return 'red'; // COLORS.FERRY_MIDNIGHT;
    case 'metro':
      return 'red'; // COLORS.SUBWAY_MIDNIGHT;
    case 'rail':
      return 'red'; // COLORS.TRAIN_MIDNIGHT;
    case 'tram':
      return 'red'; // COLORS.TRAM_MIDNIGHT;
    case 'air':
      return 'red'; // COLORS.PLANE_MIDNIGHT;
    default:
      return null;
  }
}

export function onBlur(isChecked) {
  return isChecked ? null : { opacity: 0.3 };
}

export function getPositionFromUrl(url) {
  const positionArray = url
    .split('/')[2]
    .split('@')[1]
    .split('-')
    .join('.')
    .split(/,/);
  return { latitude: positionArray[0], longitude: positionArray[1] };
}

export function getSettingsFromUrl(url) {
  const settings = url.split('/')[3];
  return settings !== ''
    ? JSON.parse(atob(settings))
    : {
      hiddenStations: [],
      hiddenStops: [],
      hiddenRoutes: [],
      distance: DEFAULT_DISTANCE,
      hiddenModes: [],
      newStations: [],
      newStops: [],
    };
}

export function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
}

function getTransportModes(departures) {
  return [...new Set(departures.map(item => item.type))];
}

export function getTransportModesByStop(stop) {
  const dep = stop.map(({ departures }) => getTransportModes(departures));
  return [...new Set([].concat(...dep))];
}

export function getTransportHeaderIcons(departures, hiddenModes) {
  const transportModes = getTransportModes(departures).filter(f => !hiddenModes.includes(f));

  return transportModes.map(mode => getIcon(mode));
}

function onFilterDepartures(groupedDepartures, hiddenModes) {
  const unHiddenDepartures = Object.values(groupedDepartures)
    .map((departures) => {
      const filteredDepartures = departures.filter(({ type }) => !hiddenModes.includes(type));
      if (filteredDepartures.length > 0) {
        return filteredDepartures;
      }
    })
    .filter(Boolean);
  return unHiddenDepartures.length > 0;
}

export function isVisible(groupedDepartures, hiddenRoutes, hiddenModes) {
  if (!onFilterDepartures(groupedDepartures, hiddenModes)) {
    return false;
  }
  const tileKeys = Object.keys(groupedDepartures);
  const visibleRoutes = tileKeys.filter(route => !hiddenRoutes.includes(route));
  return visibleRoutes.length > 0;
}

export function formatDeparture(minDiff, departureTime) {
  if (minDiff > 15) return departureTime.format('HH:mm');
  return minDiff < 1 ? 'nå' : `${minDiff.toString()} min`;
}

export function getUniqueRoutes(routes) {
  const uniqueThings = {};
  routes.forEach(({ route, type }) => {
    uniqueThings[route] = type;
  });
  return Object.entries(uniqueThings).map(([route, type]) => ({ route, type }));
}

export function transformDepartureToLineData(departure) {
  const { expectedDepartureTime, destinationDisplay, serviceJourney } = departure;
  const { line } = serviceJourney.journeyPattern;
  const departureTime = moment(expectedDepartureTime);
  const minDiff = departureTime.diff(moment(), 'minutes');
  const transportMode = line.transportMode === 'coach' ? 'bus' : line.transportMode;

  return {
    type: transportMode,
    time: formatDeparture(minDiff, departureTime),
    route: `${line.publicCode} ${destinationDisplay.frontText}`,
  };
}

export function getStopsWithUniqueStopPlaceDepartures(stops) {
  return service
    .getStopPlaceDepartures(stops.map(({ id }) => id), { includeNonBoarding: true, departures: 50 })
    .then(departures => stops.map((stop) => {
      const resultForThisStop = departures.find(({ id }) => stop.id === id);
      if (!resultForThisStop || !resultForThisStop.departures) {
        return stop;
      }

      return {
        ...stop,
        departures: getUniqueRoutes(resultForThisStop.departures.map(transformDepartureToLineData)),
      };
    }));
}

export function getStopPlacesByPositionAndDistance(position, distance = DEFAULT_DISTANCE) {
  return service.getStopPlacesByPosition(position, distance)
  .then(stopPlaces => stopPlaces.map(stop => ({
    ...stop,
    departures: [],
  })));
}

function updateHiddenList(clickedId, hiddenList) {
  let newSet = hiddenList;
  if (hiddenList.includes(clickedId)) {
    newSet = newSet.filter(id => id !== clickedId);
  } else {
    newSet.push(clickedId);
  }
  return newSet;
}

export function getSettingsHash(
  distance,
  hiddenStations,
  hiddenStops,
  hiddenRoutes,
  hiddenModes,
  newStations,
  newStops,
) {
  const savedSettings = {
    distance,
    hiddenStations,
    hiddenStops,
    hiddenRoutes,
    hiddenModes,
    newStations,
    newStops,
  };
  return btoa(JSON.stringify(savedSettings));
}

export function sortLists(list1, list2) {
  const combinedList = list1.concat(list2);
  return combinedList.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

export function updateSettingsHashStops(state, sortedStops) {
  const {
    distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStations
  } = state;
  const savedSettings = {
    distance,
    hiddenStations,
    hiddenStops,
    hiddenRoutes,
    hiddenModes,
    newStations,
    newStops: sortedStops,
  };
  return btoa(JSON.stringify(savedSettings));
}

export function updateSettingsHashStations(state, sortedStations) {
  const {
    distance, hiddenStations, hiddenStops, hiddenRoutes, hiddenModes, newStops
  } = state;
  const savedSettings = {
    distance,
    hiddenStations,
    hiddenStops,
    hiddenRoutes,
    hiddenModes,
    newStations: sortedStations,
    newStops,
  };
  return btoa(JSON.stringify(savedSettings));
}

export function updateHiddenListAndHash(clickedId, state, hiddenType) {
  const {
    hiddenStops, hiddenStations, distance, hiddenRoutes, hiddenModes, newStations, newStops
  } = state;
  let newSet = [];
  let hashedState = '';
  let hiddenLists = {};
  switch (hiddenType) {
    case 'stations':
      newSet = updateHiddenList(clickedId, hiddenStations);
      hashedState = getSettingsHash(distance, newSet, hiddenStops, hiddenRoutes, hiddenModes, newStations, newStops);
      hiddenLists = {
        hiddenStations: newSet,
        hiddenStops,
        hiddenRoutes,
        hiddenModes,
      };
      return { hiddenLists, hashedState };
    case 'stops':
      newSet = updateHiddenList(clickedId, hiddenStops);
      hashedState = getSettingsHash(distance, hiddenStations, newSet, hiddenRoutes, hiddenModes, newStations, newStops);
      hiddenLists = {
        hiddenStations,
        hiddenStops: newSet,
        hiddenRoutes,
        hiddenModes,
      };
      return { hiddenLists, hashedState };
    case 'routes':
      newSet = updateHiddenList(clickedId, hiddenRoutes);
      hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, newSet, hiddenModes, newStations, newStops);
      hiddenLists = {
        hiddenStations,
        hiddenStops,
        hiddenRoutes: newSet,
        hiddenModes,
      };
      return { hiddenLists, hashedState };
    case 'transportModes':
      newSet = updateHiddenList(clickedId, hiddenModes);
      hashedState = getSettingsHash(distance, hiddenStations, hiddenStops, hiddenRoutes, newSet, newStations, newStops);
      hiddenLists = {
        hiddenStations,
        hiddenStops,
        hiddenRoutes,
        hiddenModes: newSet,
      };
      return { hiddenLists, hashedState };

    default:
      return { hiddenLists, hashedState };
  }
}
