// components/Login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, useToast } from '@chakra-ui/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });;

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Logged in!',
        description: 'Successfully logged in',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/');
    }
  };

  return (
    <Box p={8} maxWidth="md" mx="auto">
      <Stack spacing={4}>
        <Heading>Login</Heading>
        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
        <Text textAlign="center">
          Don't have an account? <Button variant="link" onClick={() => router.push('/register')}>Sign Up</Button>
        </Text>
      </Stack>
    </Box>
  );
}
