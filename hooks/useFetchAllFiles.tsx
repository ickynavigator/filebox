import { IFileReturn } from '>types';
import axios from 'axios';
import useSWRImmutable, { Fetcher } from 'swr';

const fetcher: Fetcher<IFileReturn> = (url: string) =>
  axios.get(url).then(res => res.data);

interface Props {
  search?: string;
}
const useFetchAllFiles = ({ search }: Props) => {
  const { data, error } = useSWRImmutable(
    `/api/file${search ? `keyword=${search}` : ''}`,
    fetcher,
  );

  return {
    data,
    loading: !error && !data,
    error,
  };
};

export default useFetchAllFiles;
