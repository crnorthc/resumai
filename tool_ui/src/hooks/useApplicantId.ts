import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ApiClient } from '../apiClient';

export const APPLICANT_ID_KEY = 'applicantId';

export function useApplicantId() {
  const [applicantId, setApplicantId] = useState<string | null>(() => {
    return localStorage.getItem(APPLICANT_ID_KEY);
  });

  const { data } = useQuery({
    queryKey: ['createApplicant'],
    queryFn: async () => ApiClient.createApplicant(),
    enabled: !applicantId,
    retry: false,
  });

  useEffect(() => {
    if (data && !applicantId) {
      localStorage.setItem(APPLICANT_ID_KEY, data);
      setApplicantId(data);
    }
  }, [data, applicantId]);

  return applicantId;
}
