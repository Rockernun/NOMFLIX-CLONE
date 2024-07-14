import { useState } from "react";
import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
    background:black;
    height:200vh;
`;

//  Loading State
const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

//  First Movie(대형)
const Banner = styled.div<{bgphoto:string}>`
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:50px;
    background-image:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgphoto});
    background-size: cover;
`;

//  First Movie Title
const Title = styled.h2`
    margin:0;
    color:white;
    font-size:68px;
`;

//  First Movie Overview 
const Overview = styled.p`
    color:white;
    font-size:28px;
    width:50%;
`;

//  Movie Slider
const Slider = styled(motion.div)`
    position:relative;
    top:-200px;
`;

//  Movie Slider Row(행)
const SliderRow = styled(motion.div)`
    display:grid;
    gap:5px;
    grid-template-columns:repeat(5, 1fr);
    margin-bottom:5px;
    position:absolute;
    width:100%;
`;

//  Each Movie on Slider
const SliderMovie = styled(motion.div)<{bgphoto:string}>`
    background-color:white;
    background-image:url(${(props) => props.bgphoto});
    background-size:contain;
    background-position:center;
    background-repeat: no-repeat;
    height:0;
    padding-bottom: 56.25%;
    color:red;
    font-size:64px;
    cursor:pointer; 
    &:first-child {
        transform-origin:center left;
    }
    &:last-child {
        transform-origin:center right;
    }
`;

//  Overlay Movie
const OverLay = styled(motion.div)`
    position:fixed;
    top:0;
    width:100%;
    height:100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity:0;
`;

const BigMovie = styled(motion.div)`
    position:fixed; 
    width:60vw; 
    height:70vh;
    background-color:${(props) => props.theme.black.lighter}; 
    top:0;
    bottom:0;
    left:0;
    right:0; 
    border-radius:15px;
    overflow:hidden;
    margin:auto;
`;

const BigCover = styled.div`
    width:100%;
    height:400px;
    background-size:cover;
    background-position:center;
`;

const BigTitle = styled.h2`
    color:${(props)=> props.theme.white.lighter};
    padding:20px;
    position:relative;
    top:-80px;
    text-align:center;
    font-size:28px;
`;

const BigOverView = styled.p`
    padding:20px;
    position:relative;
    top:-80px;
    color: ${(props) => props.theme.white.lighter};
`;

const MovieVariants = {
    normal:{
        scale:1,
    },
    hover:{
        scale:1.3,
        y:-40,
        transition:{
            delay:0.3,
            duration:0.3,
            type:"tween",
        },
    },
};

const SliderMovieInfo = styled(motion.div)`
    background-color:${(props) => props.theme.black.lighter};
    opacity:0;
    position:absolute;
    width:100%;
    height:30px;
    bottom:0;
    display:flex;
    align-items: center; 
    justify-content: center; 
    h4 {
        text-align:center;
        font-size:12px;
        margin:0;
    }
`;

const MovieInfoVariants = {
    hover: {
        opacity:1,
        transition: {
            delay:0.3,
            duration:0.3,
            type:"tween,"
        },
    },
} 

const rowVariants = {
    hidden: {
        x:window.outerWidth + 5,
    },
    visible: {
        x:0,
    },
    exit: {
        x:-window.outerWidth - 5,
    }
}

//  한번에 보여줄 영화 개수
const offset = 5;

function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId");
    console.log(bigMovieMatch);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onMovieClicked = (movieId:number) => history.push(`/movies/${movieId}`);
    const onOverLayClicked = () => history.goBack();
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);
    console.log(clickedMovie);
    return (
        <Wrapper>
            {isLoading ? (
            <Loader>Loading...</Loader>
        ) : (
        <>
            <Banner 
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <Overview>{data?.results[0].overview}</Overview>
            </Banner>
            <Slider>
                <AnimatePresence 
                initial={false}
                onExitComplete={toggleLeaving}
                >
                    <SliderRow 
                    key={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{type:"tween", duration:1}}
                    >
                        {data?.results.slice(1).slice(offset*index, offset*index+offset)
                        .map((movie) => 
                        <SliderMovie 
                        layoutId={movie.id + ""}
                        key={movie.id}
                        variants={MovieVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{type:"tween"}}
                        onClick={() => onMovieClicked(movie.id)}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")} 
                        >
                            <SliderMovieInfo
                            variants={MovieInfoVariants}
                            >
                                <h4>{movie.title}</h4>    
                            </SliderMovieInfo>    
                        </SliderMovie>
                    )}
                    </SliderRow>
                </AnimatePresence>
            </Slider>
            <AnimatePresence>
                {bigMovieMatch ? (
                <>
                <OverLay onClick={onOverLayClicked} exit={{opacity:0}} animate={{opacity:1}}/>
                <BigMovie
                layoutId={bigMovieMatch.params.movieId}>
                    {clickedMovie && (
                        <>
                            <BigCover 
                            style={{
                                backgroundImage: `linear-gradient(to top, black,transparent), url(${makeImagePath(
                                    clickedMovie.backdrop_path,
                                    "w500"
                                )})`
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