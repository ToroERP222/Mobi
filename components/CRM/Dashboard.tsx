// components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { createClient } from '@/utils/supabase/component';

interface House {
  id: number;
  address: string;
  price: string;
  descripcion: string;
  imageUrl: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  
}

interface Sale {
  id: number;
  amount: number;
  date: string;
}

interface DashboardProps {
  user: any;
}
const supabase = createClient();
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch houses
      const { data: housesData, error: housesError } = await supabase
        .from('Casas')
        .select('*')
        .eq('user_id', user.id);

      if (housesError) {
        console.error('Error fetching houses:', housesError);
      } else {
        setHouses(housesData);
      }

      // Fetch contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('Contactos') // Cambia el nombre de la tabla si es necesario
        .select('*')
        .eq('user_id', user.id);

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      } else {
        setContacts(contactsData);
      }

      // Fetch sales
      const { data: salesData, error: salesError } = await supabase
        .from('Sales') // Cambia el nombre de la tabla si es necesario
        .select('*')
        .eq('user_id', user.id);

      if (salesError) {
        console.error('Error fetching sales:', salesError);
      } else {
        setSales(salesData);
      }
    };

    fetchData();
  }, [user.id]);

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Casas</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {houses.map((house) => (
              <Box key={house.id} borderWidth="1px" borderRadius="md" p={4}>
                <Heading size="md" mb={2}>{house.address}</Heading>
                <Text mb={2}>Precio: {house.price}</Text>
                <Text mb={2}>Descripción: {house.descripcion}</Text>
                
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>Contactos</Heading>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            {contacts.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {contacts.map((contact) => (
                  <Box key={contact.id} borderWidth="1px" borderRadius="md" p={4}>
                    <Heading size="sm" mb={2}>{contact.name}</Heading>
                    <Text>Email: {contact.email}</Text>
                    <Text>Teléfono: {contact.phone}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No hay contactos.</Text>
            )}
          </Box>
        </Box>

        <Box>
          <Heading size="lg" mb={4}>Ventas</Heading>
          <Box borderWidth="1px" borderRadius="md" p={4}>
            {sales.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {sales.map((sale) => (
                  <Box key={sale.id} borderWidth="1px" borderRadius="md" p={4}>
                    <Heading size="sm" mb={2}>Venta #{sale.id}</Heading>
                    <Text>Monto: ${sale.amount}</Text>
                    <Text>Fecha: {sale.date}</Text>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No hay ventas.</Text>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard;
