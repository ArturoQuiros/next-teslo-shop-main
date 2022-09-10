import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from 'react';
import { UIContext } from "../../context/ui/UIContext";
import { CartContext } from '../../context/cart/CartContext';

export const Navbar = () => {

    const {toggleMenu} = useContext(UIContext);
    const {numberOfItems} = useContext(CartContext);

    const {asPath, push} = useRouter();
    const path1 = '/category/men';
    const path2 = '/category/women';
    const path3 = '/category/children';

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if(searchTerm.trim().length === 0) return;

        push(`/search/${searchTerm}`);
    }

  return (
    <AppBar>
        <Toolbar>
            <NextLink href={'/'} passHref>
                <Link display='flex' alignItems='center' underline="none">
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography variant="h6" sx={{ml: 0.7}}>Shop</Typography>
                </Link>
            </NextLink>

            <Box flex='1' />

            <Box className="fadeIn" sx={{display: isSearchVisible ? 'none' : {xs: 'none', sm: 'block'}}}>
                <NextLink href={path1} passHref>
                    <Link underline="none">
                        <Button className={asPath === path1 ? 'btn1' : ''}
                            color={asPath === path1 ? 'info' : 'primary'}
                            sx={{backgroundColor: asPath === path1 ? 'primary.main' : 'info.main', "&:hover": {backgroundColor: asPath === path1 ? 'gray' : ''} }}
                        >Hombres</Button>
                    </Link>
                </NextLink>
                <NextLink href={path2} passHref>
                    <Link underline="none">
                        <Button className={asPath === path2 ? 'btn1' : ''}
                            color={asPath === path2 ? 'info' : 'primary'}
                            sx={{backgroundColor: asPath === path2 ? 'primary.main' : 'info.main', "&:hover": {backgroundColor: asPath === path2 ? 'gray' : ''} }}
                        >Mujeres</Button>
                    </Link>
                </NextLink>
                <NextLink href={path3} passHref>
                    <Link underline="none">
                        <Button className={asPath === path3 ? 'btn1' : ''}
                            color={asPath === path3 ? 'info' : 'primary'}
                            sx={{backgroundColor: asPath === path3 ? 'primary.main' : 'info.main', "&:hover": {backgroundColor: asPath === path3 ? 'gray' : ''} }}
                        >Niños</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box flex='1' />
            
            {
                isSearchVisible ? (
                    <Input
                        sx={{display: {xs: 'none', sm: 'flex'}}}
                        className="fadeIn"
                        autoFocus
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setIsSearchVisible(false)}
                                >
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                ) : (
                    <IconButton sx={{display: {xs: 'none', sm: 'flex'}}} className="fadeIn" onClick={() => setIsSearchVisible(true)}>
                        <SearchOutlined />
                    </IconButton>
                )
            }
            

            <IconButton sx={{display: {xs: 'flex', sm: 'none'}}} onClick={toggleMenu}>
                <SearchOutlined />
            </IconButton>

            <NextLink href='/cart' passHref>
                <Link underline="none">
                    <IconButton>
                        <Badge badgeContent={numberOfItems > 9 ? '+9': numberOfItems} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={toggleMenu}>Menu</Button>

        </Toolbar>
    </AppBar>
  )
}
