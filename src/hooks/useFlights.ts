import { useEffect, useState } from 'react';

export function useFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Implementation
  }, []);

  return { flights, loading };
}
