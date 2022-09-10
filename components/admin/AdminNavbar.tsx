import { AppBar, Box, Button,  Link, Toolbar, Typography } from "@mui/material"
import NextLink from "next/link"
import { useContext } from 'react';
import { UIContext } from "../../context/ui/UIContext";

export const AdminNavbar = () => {

    const {toggleMenu} = useContext(UIContext);



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
            

            <Button onClick={toggleMenu}>Menu</Button>

        </Toolbar>
    </AppBar>
  )
}
