// pages/index.tsx
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Layout from '@/components/Tools/Layout';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import CallToAction from '@/components/Landing/CallToAction';
import Dashboard from '@/components/CRM/Dashboard'; // Asume que tienes un componente Dashboard
import { GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server-props';
import { User } from '@supabase/supabase-js';
import NavBar from '@/components/Tools/NavBar';
import Footer from '@/components/Tools/Footer';
import Sidebar from '@/components/Tools/Sidebar';

interface HomeProps {
  user: User | null;
}

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <>
     
        {user ? (
           <Layout  user={user}>
            
          <Dashboard user={user} />
          </Layout>
          
        ) : (
          <>
          <NavBar user={user}/>
            <Hero />
            <Features />
            <CallToAction />
            <Footer/>
          
          </>
        )}
      
    </>
  );
};

// Obtener la sesión del usuario en el lado del servidor
export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createClient(context);
  const { data: user, error: userError } = await supabase.auth.getUser();
  console.log(user)
  if (userError) {
    console.error('Error fetching user:', userError);
    return {
      props: {
        user: null,
      },
    };
  }

  return {
    props: {
      user: user.user || null,
    },
  };
};

export default Home;
