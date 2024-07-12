import { useState } from "react";
import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";

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
    grid-template-columns:repeat(6, 1fr);
    margin-bottom:5px;
    position:absolute;
    width:100%;
`;

//  Each Movie on Slider
const SliderMovie = styled(motion.div)<{bgphoto:string}>`
    background-color:white;
    background-image:url(${(props) => props.bgphoto});
    background-size:cover;
    background-position:center center;
    height:200px;
    color:red;
    font-size:64px;
    &:first-child {
        transform-origin:center left;
    }
    &:last-child {
        transform-origin:center right;
    }
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
    bottom:0;
    h4 {
        text-align:center;
        font-size:14px;
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
const offset = 6;

function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
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
                        key={movie.id}
                        variants={MovieVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{type:"tween"}}
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
        </>
        )}
        </Wrapper>
    );
}

export default Home;