import { Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import NextLink from "next/link"
import { useForm } from 'react-hook-form';
import { isEmail } from '../../utils/validations';
import tesloApi from '../../apiFolder/tesloApi';
import { ErrorOutline } from '@mui/icons-material';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next'

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const router = useRouter();
    const {loginUser} = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      getProviders().then(prov => {
        setProviders(prov);
      })
    
    }, [])
    

    const onLogin = async ({email, password}: FormData) => {

        setShowError(false);

        // const isValidLogin = await loginUser(email, password);

        // if(!isValidLogin){
        //     setShowError(true);
        //     setTimeout(() => {
        //         setShowError(false);
        //     }, 5000);
        //     return;
        // }
        
        // const destination = router.query.p?.toString() || '/';

        // router.replace(destination);

        await signIn('credentials', {email, password});

    }

  return (
    <AuthLayout title="Ingresar">
        <form onSubmit={handleSubmit(onLogin)} noValidate>
            <Box sx={{width: 350, padding: '10px 20px'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
                        <Chip label="No reconocemos ese usuario / contraseña" color="error" icon={<ErrorOutline />} className="fadeIn" 
                            sx={{marginTop:1, display: showError ? 'flex' : 'none'}} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField type='email' label="Correo" variant='filled' fullWidth {...register('email', {
                            required: 'El usuario es requerido',
                            validate: isEmail
                        })} error={!!errors.email} helperText={errors.email?.message} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Contraseña" type="password" variant='filled' fullWidth {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: {value: 8, message: 'Minimo 8 caracteres'}
                        })} error={!!errors.password} helperText={errors.password?.message} />
                    </Grid>

                    <Grid item xs={12}>
                        <Button color='info' sx={{backgroundColor: 'secondary.main', "&:hover": {backgroundColor: '#274494'}}} className='circular-btn' size='large' fullWidth type='submit'>
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={ router.query.p ? `/auth/register?p=${router.query.p}` : `/auth/register`} passHref>
                            <Link underline='always'>
                                ¿No tienes cuenta aun?
                            </Link>
                        </NextLink>
                    </Grid>

                    <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                        <Divider sx={{width: '100%', mb: 2}} />
                        {
                            Object.values(providers).map((provider: any) => {

                                if(provider.id === 'credentials') return (<div key="credentials"></div>)

                                return (
                                    <Button key={provider.id} variant="outlined" fullWidth color="primary" sx={{mb:1}} size='large' onClick={() => signIn(provider.id)}>
                                        {provider.name}
                                    </Button>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Box>
        </form>  
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
     
    const session = await getSession({req});

    const {p = '/'} = query;

    if(session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default LoginPage