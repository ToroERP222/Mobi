// components/Login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, useToast } from '@chakra-ui/react';
import Layout from '@/components/Tools/Layout';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClient();
  const [error, setError] = useState('');
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/');
  };
  

  return (
    <Layout  user={null}>
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
    </Layout>
  );
}
