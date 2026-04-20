import { useState } from "react";
import styled from "styled-components";
import { COLORS } from "../styles/Colors";
import { AnimeCardTypes } from "./AnimesList";

const formatDate = (dateStr: string) => {
  const dateObj: Date = new Date(dateStr);
  return dateObj.toDateString();
};

const AnimeCard = ({
  images,
  rank,
  title,
  aired,
  rating,
  airing,
}: AnimeCardTypes) => {
  const [display, setDisplay] = useState(false);
  const os = getMobileOS();

  return (
    <CardWrap
      onMouseDown={() => {
        if (os === "Other") {
          setDisplay(true);
        }
      }}
      onMouseUp={() => {
        if (os === "Other") {
          setDisplay(false);
        }
      }}
      onMouseOut={() => {
        if (os === "Other") {
          setDisplay(false);
        }
      }}
    >
      <Card
        onClick={() => {
          if (os !== "Other") {
            setDisplay((old) => !old);
          }
        }}
        display={display}
      >
        <Rank>{rank}</Rank>
        <ImageCover>
          <img alt={title} src={images.jpg.image_url} />
        </ImageCover>
        <CardDescription>
          <CardTitle display={display}>{title}</CardTitle>
          <HiddenData display={display}>
            <p>
              <Bold>Release:</Bold> {formatDate(aired.from)}
            </p>
            <p>
              <Bold>Lastest:</Bold>{" "}
              {!aired.to || airing ? "now" : formatDate(aired.to)}
            </p>
            <p>
              <Bold>Rating:</Bold> {rating}
            </p>
          </HiddenData>
        </CardDescription>
      </Card>
    </CardWrap>
  );
};

const CardWrap = styled.div`
  width: 200px;
  height: 300px;
  position: relative;
`;
const Card = styled.div<any>`
  width: 200px;
  height: 300px;
  box-shadow: 0 0 10px #0000001e;
  position: relative;
  border-radius: 9px;
  background-color: ${COLORS.white};
  transition: all 0.3s;
  z-index: 1;

  ${(props: { display: boolean }) =>
    props.display
      ? `
    z-index: 99;
    width: 300px;
    height: 420px;
    position: absolute;
    top: 0;
    left: -50px;
    padding: 1px;
    box-shadow: 0 0 15px #0000001e;

    img {
      width: 300px !important;
    }
  `
      : null}
`;

const Rank = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  background: ${COLORS.white};
  border-radius: 0 9px 0 0;
`;
const ImageCover = styled.div`
  width: 100%;
  height: 250px;
  img {
    width: 200px;
    height: 100%;
    object-fit: cover;
    border-radius: 9px 9px 0 0;
    transition: all 0.3s;
  }
`;
const CardDescription = styled.div`
  padding: 0 8px 10px;
`;
const CardTitle = styled.div<any>`
  display: flex;
  height: 32px;
  padding: 5px 0;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${(props: { display: boolean }) =>
    props.display
      ? `
      height: 50px;
      -webkit-line-clamp: 6;
    `
      : null}
`;
const HiddenData = styled.div<any>`
  opacity: 0;
  transition: all 0.3s;

  ${(props: any) =>
    props.display
      ? `
      opacity: 1;
    `
      : null}

  p {
    margin: 0;
    text-align: left;
    line-height: 28px;
  }
`;
const Bold = styled.span`
  font-weight: 600;
`;

const getMobileOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return "Android";
  } else if (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "iOS";
  }
  return "Other";
};

export default AnimeCard;
