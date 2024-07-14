import { useLocation } from "react-router-dom";

function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");  //  검색어(내가 검색한 그 string 그대로)를 받아오자.
    console.log(keyword);
    return null;
}

export default Search;