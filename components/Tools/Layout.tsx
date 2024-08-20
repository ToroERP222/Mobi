import { ReactNode, useState } from 'react';
import { Box, useColorModeValue, Flex, useBreakpointValue } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from './NavBar';
import Footer from './Footer';
import Sidebar from './Sidebar'; // Asegúrate de importar tu Sidebar
import type { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
}

const Layout = ({ children, user }: LayoutProps) => {
  const bg = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="Your page description" />
        <meta name="keywords" content="keyword1, keyword2, keyword3" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Box bg={bg} color={color} minH="100vh">
        <Navbar user={user} />
        <Flex>
          {user && (
            <Box
              as="nav"
              position="fixed"
              left={0}
              top="60px"
              h="100vh"
              bg="gray.800"
              color="white"
              w={isSidebarOpen ? "202px" : "60px"}
              transition="width 0.2s"
              onMouseEnter={() => setSidebarOpen(true)}
              onMouseLeave={() => setSidebarOpen(false)}
              zIndex={10}
            >
              <Sidebar />
            </Box>
          )}
          <Box
            flex="1"
            ml={user ? (isSidebarOpen ? "240px" : "60px") : "0"}
            p={4}
            transition="margin-left 0.2s"
            overflowX="hidden"
          >
            {children}
          </Box>
        </Flex>
        <Footer />
      </Box>
    </>
  );
};

export default Layout;
