import { useState } from "react";
import { useQuery } from "react-query";
import {
  getMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  min-height: 400vh;
  padding-bottom: 50px;
  position: absolute;
`;

//  Loading State
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//  Movie Banner
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

//  Movie Title
const Title = styled.h2`
  margin: 0;
  color: white;
  font-size: 68px;
`;

//  Movie Overview
const Overview = styled.p`
  color: white;
  font-size: 28px;
  width: 50%;
`;

//  Movie Slider Container
const SliderContainer = styled.div`
  position: relative;
  top: -350px;
  margin-top: 50px;
  padding: 0 20px;
  @media (max-width: 1200px) {
    margin-top: 80px;
  }
  @media (max-width: 768px) {
    margin-top: 60px;
  }
`;

//  Movie Slider
const Slider = styled(motion.div)`
  position: relative;
  margin-top: 20px;
  overflow: hidden;
`;

//  Movie Slider Row
const SliderRow = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 5px;
  position: relative;
  width: calc(100% + 20px);
  transform: translateX(-10px);
`;

//  Each Movie on Slider
const SliderMovie = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  height: 0;
  padding-bottom: 56.25%;
  color: red;
  font-size: 64px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
    z-index: 1;
  }
`;

// Overlay and Big Movie Components for Detail View
const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
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

const offset = 5;

function Home() {
  const { data: nowPlayingData, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: popularData } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopularMovies
  );
  const { data: topRatedData } = useQuery<IGetMoviesResult>(
    ["movies", "topRated"],
    getTopRatedMovies
  );
  const { data: upcomingData } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcomingMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const seenMovies = new Set<number>();

  const filterUniqueMovies = (data?: IGetMoviesResult) => {
    if (!data) return [];
    return data.results.filter((movie) => {
      if (seenMovies.has(movie.id)) {
        return false;
      } else {
        seenMovies.add(movie.id);
        return true;
      }
    });
  };

  const increaseIndex = () => {
    if (nowPlayingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlayingData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onMovieClicked = (movieId: number) =>
    history.push(`/movies/${movieId}`);
  const onOverLayClicked = () => history.goBack();
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    (nowPlayingData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId!
    ) ||
      popularData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId!
      ) ||
      topRatedData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId!
      ) ||
      upcomingData?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId!
      ));

  const renderSlider = (title: string, data?: IGetMoviesResult) => (
    <SliderContainer>
      <h2 style={{ color: "white", marginLeft: "20px" }}>{title}</h2>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <SliderRow
            key={index}
            initial={{ x: window.outerWidth + 5 }}
            animate={{ x: 0 }}
            exit={{ x: -window.outerWidth - 5 }}
            transition={{ type: "tween", duration: 1 }}
          >
            {filterUniqueMovies(data)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <SliderMovie
                  layoutId={movie.id + ""}
                  key={movie.id}
                  onClick={() => onMovieClicked(movie.id)}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                >
                  <h6
                    style={{
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "24px",
                    }}
                  >
                    {movie.title}
                  </h6>
                </SliderMovie>
              ))}
          </SliderRow>
        </AnimatePresence>
      </Slider>
    </SliderContainer>
  );

  return (
    <Wrapper>
      {nowPlayingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          {renderSlider("Now Playing", nowPlayingData)}
          {renderSlider("Popular Movies", popularData)}
          {renderSlider("Top Rated Movies", topRatedData)}
          {renderSlider("Upcoming Movies", upcomingData)}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <OverLay
                  onClick={onOverLayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie layoutId={bigMovieMatch.params.movieId}>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black,transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "original"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverView>{clickedMovie.overview}</BigOverView>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
