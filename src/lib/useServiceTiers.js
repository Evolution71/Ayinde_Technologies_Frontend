import { useEffect, useState } from 'react';
import { api } from '../api';
import { SERVICE_CATALOG, applyDbPrices } from './servicePlans';

// Maps the page's service key to the value the backend stores in service_tiers.
const API_TYPE = {
  website: 'website',
  application: 'applications',
  premium: 'premium',
  consultation: 'consultation',
};

// Returns the tiers for a service with prices from the database.
// Until the request finishes (or if it fails) the fallback catalog is used.
export default function useServiceTiers(serviceKey) {
  const [tiers, setTiers] = useState(() => SERVICE_CATALOG[serviceKey].tiers);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let live = true;
    setStatus('loading');
    api
      .getServiceTiers(API_TYPE[serviceKey])
      .then((res) => {
        if (!live) return;
        setTiers(applyDbPrices(serviceKey, res?.tiers || []));
        setStatus('ready');
      })
      .catch(() => {
        if (live) setStatus('error');
      });
    return () => {
      live = false;
    };
  }, [serviceKey]);

  return { tiers, status };
}
