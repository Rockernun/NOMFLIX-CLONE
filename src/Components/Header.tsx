import styled from "styled-components";

//  헤더(네비게이션)
const Nav = styled.nav`
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    top:0;
    background-color:red;
    height:80px;
    font-size:14px;
`;

//  Header의 2개의 열
const Col = styled.div`
    display:flex;
    align-items:center;
`;

//  로고
const Logo = styled.svg`
    margin-right:50px;
`;


//  Home, Tv Shows item 담아둘 컴포넌트
const Items = styled.ul`
    display:flex;
    align-items:center;
`;

//  Home, Tv Shows item 컴포넌트
const Item = styled.li`
    margin-right:20px;
`;

function Header() {
    return (
        <Nav>
            <Col>
                <Logo />
                <Items>
                    <Item>Home</Item>
                    <Item>Tv Shows</Item>
                </Items>
            </Col>
            <Col>
            <button>search</button>
            </Col>
        </Nav>
    );
}

export default Header;