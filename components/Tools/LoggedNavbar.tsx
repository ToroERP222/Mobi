import React from 'react';
import { Box, Flex, IconButton, Spacer, Image } from '@chakra-ui/react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { createClient } from '@/utils/supabase/component';

interface LoggedNavBarProps {
  toggleSidebar: () => void;
}

const LoggedNavBar: React.FC<LoggedNavBarProps> = ({ toggleSidebar }) => {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <Box bg="gray.900" color="white" px={4} height="60px" boxShadow="md">
      <Flex align="center" height="100%">
        <IconButton
          aria-label="Menu"
          icon={<FaBars />}
          size="lg"
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={toggleSidebar}
          mr={4}
          display={{ base: 'inline-flex', md: 'none' }}
        />
        <Image src="/logo.png" alt="Logo" height="40px" />
        <Spacer />
        <IconButton
          aria-label="Sign Out"
          icon={<FaSignOutAlt />}
          size="lg"
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={handleSignOut}
        />
      </Flex>
    </Box>
  );
};

export default LoggedNavBar;
