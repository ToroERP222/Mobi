import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, useToast } from '@chakra-ui/react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [inmobiliariaName, setInmobiliariaName] = useState('');
  const [inmobiliariaAddress, setInmobiliariaAddress] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();

  const handleRegister = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      toast({
        title: 'Error',
        description: signUpError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const user = signUpData.user;
    if (!user) {
      toast({
        title: 'Error',
        description: 'User creation failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Agregar un nuevo registro en la tabla 'profiles'
    const { error: profileError } = await supabase
      .from('Profiles')
      .insert([
        {
          user_id: user.id, // El ID debe coincidir con el user.id en Supabase
          typeofuser: 'owner', // Asignar 'owner' como tipo de usuario
        },
      ]);

    if (profileError) {
      toast({
        title: 'Error',
        description: profileError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Guardar el userId para usarlo en la creación de la inmobiliaria
    setUserId(user.id);

    // Cambiar el estado para mostrar el formulario de registro de inmobiliaria
    setRegisterSuccess(true);
  };

  const handleInmobiliariaRegister = async () => {
    if (!userId) return;

    const { data: inmobiliariaData, error: inmobiliariaError } = await supabase
      .from('Inmobiliarias')
      .insert([
        {
          name: inmobiliariaName,
          address: inmobiliariaAddress,
          owner_user_id: userId,
        },
      ])
      .select();
      // Retornar la data insertada para obtener el ID de la inmobiliaria

    if (inmobiliariaError) {
      toast({
        title: 'Error',
        description: inmobiliariaError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Actualizar la tabla 'profiles' con el ID de la inmobiliaria
    const { error: profileUpdateError } = await supabase
      .from('Profiles')
      .update({
        inmobiliaria_id: inmobiliariaData[0].id,
      })
      .eq('user_id', userId);

    if (profileUpdateError) {
      toast({
        title: 'Error',
        description: profileUpdateError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Inmobiliaria Registered!',
      description: 'Successfully registered the inmobiliaria',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Redirigir al dashboard o a otra página después de registrar la inmobiliaria
    router.push('/login');
  };

  return (
    <Box p={8} maxWidth="md" mx="auto">
      <Stack spacing={4}>
        {!registerSuccess ? (
          <>
            <Heading>Register</Heading>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button colorScheme="blue" onClick={handleRegister}>Register</Button>
            <Text textAlign="center">
              Already have an account? <Button variant="link" onClick={() => router.push('/login')}>Login</Button>
            </Text>
          </>
        ) : (
          <>
            <Heading>Register Inmobiliaria</Heading>
            <FormControl id="inmobiliariaName">
              <FormLabel>Inmobiliaria Name</FormLabel>
              <Input type="text" value={inmobiliariaName} onChange={(e) => setInmobiliariaName(e.target.value)} />
            </FormControl>
            <FormControl id="inmobiliariaAddress">
              <FormLabel>Inmobiliaria Address</FormLabel>
              <Input type="text" value={inmobiliariaAddress} onChange={(e) => setInmobiliariaAddress(e.target.value)} />
            </FormControl>
            <Button colorScheme="blue" onClick={handleInmobiliariaRegister}>Register Inmobiliaria</Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
