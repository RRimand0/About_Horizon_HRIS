import { useEffect, useRef, useState } from 'react';
import { ExternalLink, MapPin, MousePointer2 } from 'lucide-react';
import { ONSITE_RADIUS_KM, SERVICE_CENTER, straightLineDistanceKm } from '../utils/onsiteDistance.js';

// Public browser key: restrict it to the exact website domains and Maps JavaScript API.
// This must NEVER be the same unrestricted credential used by PHP for server geocodin