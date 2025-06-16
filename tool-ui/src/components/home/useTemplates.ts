import { useQuery } from '@tanstack/react-query';
import { ApiClient } from '../../apiClient';

export const APPLICANT_ID_KEY = 'applicantId';

export function useTemplates() {
  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => ApiClient.getTemplates(),
  });

  return { templates };
}
