import type { HydratedFile } from '>types/File';
import axios from 'axios';
import useSWRImmutable, { Fetcher } from 'swr';

const fetcher: Fetcher<HydratedFile> = (url: string) =>
  axios.get(url).then(res => res.data);

interface Props {
  id: string;
}
const useFetchSingleFile = ({ id }: Props) => {
  const { data, error } = useSWRImmutable(`/api/file/${id}`, fetcher);

  return {
    data,
    loading: !error && !data,
    error,
  };
};

export default useFetchSingleFile;
