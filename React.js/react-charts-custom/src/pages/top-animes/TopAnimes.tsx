import { useEffect } from "react";
import useRequestApi from "../../api/hooks/useRequestApi";
import ENDPOINTS from "../../api/ENDPOINTS";
import AnimesChart from "../../components/AnimesChart";
import AnimesList from "../../components/AnimesList";
import Loader from "../../components/Loader";
import styled from "styled-components";
import { COLORS } from "../../styles/Colors";

const Container = styled.div`
  background-color: ${COLORS.bodyBackground};
  padding: 30px 10px 80px;
`;

const ANIMES_LIMIT = 20;

const TopAnimes = () => {
  const [getAnimes, { response, loading }] = useRequestApi({
    path: ENDPOINTS.GET_TOP_ANIMES,
  });

  useEffect(() => {
    getAnimes({
      params: {
        limit: ANIMES_LIMIT,
      },
    });
  }, []); // eslint-disable-line

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <>
            <AnimesList data={response?.data || []} />
            <AnimesChart data={response?.data || []} />
          </>
        </Container>
      )}
    </>
  );
};

export default TopAnimes;
