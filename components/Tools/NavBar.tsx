'use client';

import {
  Box,
  Flex,
  Button,
  Stack,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Center,
  MenuDivider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

interface NavbarProps {
  user: User | null;
}

export default function WithSubnavigation({ user }: NavbarProps) {
  const { isOpen, onToggle } = useDisclosure();
  const supabase = createClientComponentClient();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <Box
      position="sticky"
      top={0}
      zIndex={1000} // Asegura que el navbar esté por encima de otros elementos
    >
      <Flex
        bg={'white'}
        color={'gray.600'}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={'gray.200'}
        align={'center'}
        justify={'space-between'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <CloseIcon w={3} h={3} />
              ) : (
                <HamburgerIcon w={5} h={5} />
              )
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link href="/" passHref>
            <ChakraLink
              textAlign={{ base: 'center', md: 'left' }}
              fontFamily={'heading'}
              color={'gray.800'}
              fontSize={'xl'}
              fontWeight={'bold'}
            >
              Logo
            </ChakraLink>
          </Link>
        </Flex>

        <Stack
          direction={'row'}
          spacing={4}
          alignItems={'center'}  // Ajuste aquí
        >
          {user ? (
            <Menu>
              <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                <Avatar size={'sm'} src={user.user_metadata.avatar_url || ''} />
              </MenuButton>
              <MenuList alignItems={'center'}>
                <br />
                <Center>
                  <Avatar size={'2xl'} src={user.user_metadata.avatar_url || ''} />
                </Center>
                <br />
                <Center>
                  <p>{user.email}</p>
                </Center>
                <br />
                <MenuDivider />
                <MenuItem>Your Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Login
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  as={'a'}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'pink.400'}
                  _hover={{
                    bg: 'pink.300',
                  }}
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
