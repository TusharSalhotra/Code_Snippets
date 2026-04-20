import styled from "styled-components";
import AnimeCard from "./AnimeCard";

const MainWrapper = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

export type AnimeCardTypes = {
  title: string;
  images: any;
  rank: number;
  aired: any;
  rating: string;
  year: number;
  airing: boolean;
  mal_id: number;
};

type Props = {
  data: AnimeCardTypes[];
};

const AnimesList = (props: Props): JSX.Element => {
  return (
    <MainWrapper>
      {props.data.map((anime: AnimeCardTypes) => (
        <AnimeCard key={anime.mal_id} {...anime} />
      ))}
    </MainWrapper>
  );
};

export default AnimesList;
