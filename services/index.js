import EnturService from '@entur/sdk';
import { JOURNEYPLANNER_HOST, GEOCODER_HOST } from '../constants';

export default new EnturService({
  clientName: 'sanntid',
  hosts: {
    journeyplanner: JOURNEYPLANNER_HOST,
    geocoder: GEOCODER_HOST,
  },
});
