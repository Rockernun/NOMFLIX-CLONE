import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import { IGetPopularTv, getTvShow } from "../api";

const Wrapper = styled.div`
  background: black;
  height: 200vh;
`;

//  Loading State
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//  First Tv Show(대형)
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

//  First Tv Show Title
const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 68px;
`;

//  First Tv Show Overview
const Overview = styled.p`
  color: white;
  font-size: 28px;
  width: 50%;
`;

//  Tv Shows Slider
const Slider = styled(motion.div)`
  position: relative;
  top: -200px;
`;

//  Tv Shows Slider Row(행)
const SliderRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

//  Each Tv Shows on Slider
const SliderTvShows = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 0;
  padding-bottom: 56.25%;
  color: red;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

//  Overlay Tv Show
const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigTvShow = styled(motion.div)`
  position: fixed;
  width: 60vw;
  height: 70vh;
  background-color: ${(props) => props.theme.black.lighter};
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 15px;
  overflow: hidden;
  margin: auto;
`;

const BigCover = styled.div`
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
  text-align: center;
  font-size: 28px;
`;

const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const TvShowVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -40,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
  },
};

const SliderTvShowInfo = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  h4 {
    text-align: center;
    font-size: 12px;
    margin: 0;
  }
`;

const TvShowInfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween,",
    },
  },
};

const offset = 5;

function Tv() {
  const { data, isLoading } = useQuery<IGetPopularTv>(
    ["tv", "Popular"],
    getTvShow
  );
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const history = useHistory();
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onTvShowClicked = (tvId: number) => history.push(`/tv/${tvId}`);
  const onOverLayClicked = () => history.goBack();
  const clickedTvShows =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId!);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].original_name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderRow
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <SliderTvShows
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={TvShowVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onTvShowClicked(tv.id)}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <SliderTvShowInfo variants={TvShowInfoVariants}>
                        <h4>{tv.original_name}</h4>
                      </SliderTvShowInfo>
                    </SliderTvShows>
                  ))}
              </SliderRow>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <OverLay
                  onClick={onOverLayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTvShow layoutId={bigTvMatch.params.tvId}>
                  {clickedTvShows && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black,transparent), url(${makeImagePath(
                            clickedTvShows.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTvShows.original_name}</BigTitle>
                      <BigOverView>{clickedTvShows.overview}</BigOverView>
                    </>
                  )}
                </BigTvShow>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
