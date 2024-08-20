// pages/casas.tsx
import { GetServerSideProps } from 'next';
import { createClient } from '@/utils/supabase/server-props';
import CasasComponent from '@/components/CRM/Casas';
import Layout from '@/components/Tools/Layout';
import { User } from '@supabase/supabase-js';

interface CasasPageProps {
  casas: any[];
  isOwner: boolean;
  user: User | null; // Permitir que user sea null
}

export default function CasasPage({ casas, isOwner, user }: CasasPageProps) {
  if (!user) {
    return (
      <Layout user={user}>
        <p>Usuario no autenticado. Por favor, inicie sesión.</p>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <CasasComponent casas={casas} userId={user.id} isOwner={isOwner} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createClient(context);

  // Obtener el usuario autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Verificar si el usuario es un propietario buscando en la tabla "profiles"
  const { data: profile, error: profileError } = await supabase
    .from('Profiles')
    .select('typeofuser')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return {
      props: {
        casas: [],
        isOwner: false,
        user,
      },
    };
  }

  const isOwner = profile.typeofuser === 'owner';

  // Obtener datos de las casas
  const { data: casasData, error: casasError } = await supabase
    .from('Casas')
    .select('*');

  if (casasError) {
    return {
      props: {
        casas: [],
        isOwner,
        user,
      },
    };
  }

  // Generate signed URLs for each image
  const casasWithImageUrls = await Promise.all(casasData.map(async (casa: any) => {
    if (casa.imageUrl) {
      const { data, error } = await supabase.storage.from('Casas').createSignedUrl(casa.imageUrl, 60 * 60); // URL valid for 1 hour
      if (error) {
        console.error('Error creating signed URL:', error);
        return {
          ...casa,
          imageUrl: '', // Handle missing image URL or use a placeholder image
        };
      }
      return {
        ...casa,
        imageUrl: data.signedUrl,
      };
    }
    return {
      ...casa,
      imageUrl: '', // Handle cases where there is no image URL
    };
  }));

  return {
    props: {
      casas: casasWithImageUrls || [],
      isOwner,
      user,
    },
  };
};
