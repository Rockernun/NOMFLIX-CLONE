import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import {styled} from "styled-components";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    background:black;
`;

//  Loading State
const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

//  First Movie(대형)
const Banner = styled.div<{bgPhoto:string}>`
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    padding:50px;
    background-image:linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
    background-size: cover;
`;

//  First Movie Title
const Title = styled.h2`
    color:white;
    font-size:68px;
`;

//  First Movie Overview 
const Overview = styled.p`
    color:white;
    font-size:32px;
    width:50%;
`;

function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    console.log(data, isLoading);
    return (
        <Wrapper>
            {isLoading ? (
            <Loader>Loading...</Loader>
        ) : (
        <>
            <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <Overview>{data?.results[0].overview}</Overview>
            </Banner>
        </>
        )}
        </Wrapper>
    );
}

export default Home;