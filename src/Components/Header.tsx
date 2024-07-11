import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation, useScroll } from "framer-motion";
import { Link, useRouteMatch } from "react-router-dom";

//  헤더(네비게이션)
const Nav = styled(motion.nav)`
    width:100%;
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:fixed;
    top:0;
    height:80px;
    font-size:14px;
    z-index:1;
`;

const navVariants = {
    top: {
        backgroundColor:"rgba(0, 0, 0, 0)"
    },
    scroll: {
        backgroundColor:"rgba(0, 0, 0, 1)"
    }
}

//  Header의 2개의 열
const Col = styled.div`
    display:flex;
    align-items:center;
`;

//  Home, Tv Shows item 담아둘 컴포넌트
const Items = styled.ul`
    display:flex;
    align-items:center;
`;

//  로고(모션 추가)
const Logo = styled(motion.svg)`
    margin-left:50px;
    width:100px;
    height:30px;
    path {
        stroke-width: 5px;
        stroke: black;
    }
`;

//  logoVariants 추가(두근두근)
const logoVariants = {
    normal: {
        fill:"rgba(255, 0, 0, 0)",
        scale:1,
    },
    drawing: {
        fill: "rgba(255, 0, 0, 1)",
        transition: {
            duration:1.5,
        }
    },
    active: {
        scale:[1, 0.9, 0.8, 0.9, 1, 1.1, 1.2, 1.1, 1],
        transition: {
            repeat: Infinity,
        },
    },
};

//  검색창 컴포넌트
const Search = styled(motion.span)`
    display:flex;
    position:relative;
    align-items:center;
    margin-right:40px;
    color:white;
    svg {
        height:25px;
    }
`;

const searchVariants = {
    normal: {
        scale:1,
    },
    click : {
        scale:1.3,
    }
}

//  현재 item 포인터(현재 route 표시)
const Circle = styled(motion.span)`
    position: absolute;
    width:8px;
    height:8px;
    border-radius:4px;
    bottom:-15px;
    left:0;
    right:0;
    margin:0 auto;
    background-color:${(props) => props.theme.red};
`;

const Input = styled(motion.input)`
    position:absolute;
    transform-origin: right center;
    left:-150px;
`;

//  Home, Tv Shows item 컴포넌트
const Item = styled.li`
    margin-right:20px;
    color:${(props) => props.theme.white.darker};
    transition:color 0.3s ease-in-out;
    position:relative;
    display:flex;
    justify-content:center;
    flex-direction:column;
    &:hover {
        color:${(props) => props.theme.white.lighter};
    }
`;

function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const homeMatch = useRouteMatch("/");
    const tvMatch = useRouteMatch("/tv");
    const { scrollYProgress } = useScroll();
    const navAnimation = useAnimation();
    useEffect(() => {
        scrollYProgress.onChange(() => {
            if (scrollYProgress.get() > 0.1) {
                navAnimation.start("scroll")
            } else {
                navAnimation.start("top")
            }
        });
    }, [scrollYProgress, navAnimation]);
    return (
        <Nav
        variants={navVariants}
        initial={"top"}
        animate={navAnimation}
        >
            <Col>
                <Logo 
                variants={logoVariants}
                initial="normal"
                animate="drawing"
                whileHover="active"
                xmlns="http://www.w3.org/2000/svg"
                width="1024"
                height="276.742"
                viewBox="0 0 1024 276.742"
                >
                <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
                </Logo>
                <Items>
                    <Item>
                        <Link to="/">Home {homeMatch?.isExact && <Circle layoutId="pointer"/>}</Link>
                    </Item>
                    <Item>
                        <Link to="/tv">TV Shows {tvMatch && <Circle layoutId="pointer"/>}</Link>
                    </Item>
                </Items>
            </Col>
            <Col>
            <Search 
            variants={searchVariants}
            animate={searchOpen ? "click" : "normal"}>
          <motion.svg
            onClick={() => setSearchOpen((prev) => !prev)}
            animate={{x:searchOpen ? -180 : 0}}
            transition={{type:"linear"}}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input 
          initial={false}
          animate={{scaleX:searchOpen ? 1 : 0}} 
          transition={{type:"linear"}}
          placeholder="영화, 드라마, 애니 ..." 
          />
        </Search>
            </Col>
        </Nav>
    );
}

export default Header;