import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Box,
  Stack,
  Text,
  Heading,
  Image,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { createClient } from '@/utils/supabase/component';

interface Casa {
  id: number;
  created_at: string;
  user_id: string;
  address: string;
  price: string;
  descripcion: string;
  imageUrl: string; // This will be used to store the image name
}

const supabase = createClient();

const CasasComponent = ({ casas: initialCasas, userId, isOwner }: { casas: Casa[], userId: string, isOwner: boolean }) => {
  const [casas, setCasas] = useState<Casa[]>(initialCasas);
  const [newCasa, setNewCasa] = useState<Partial<Casa>>({
    address: '',
    price: '',
    descripcion: '',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCasa({ ...newCasa, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) {
      toast({
        title: 'Error',
        description: 'Please select an image.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }

    const fileExt = selectedImage.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    try {
      const { error: uploadError } = await supabase.storage.from('Casas').upload(filePath, selectedImage, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) {
        throw uploadError;
      }

      // Return only the file name
      return fileName;
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to upload image: ${error}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!isOwner) {
      toast({
        title: 'Access Denied',
        description: 'Only users with the role of "owner" can add houses.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!newCasa.address || !newCasa.price || !newCasa.descripcion || !selectedImage) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Upload image and get the file name
    const imageName = await uploadImage();
    
    if (imageName) {
      // Save the new casa with image name
      const { data, error } = await supabase
        .from('Casas')
        .insert([{ ...newCasa, user_id: userId, imageUrl: imageName }]);

      setIsLoading(false);

      if (error) {
        toast({
          title: 'Error',
          description: `Failed to add house: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (Array.isArray(data)) {
        setCasas(prevCasas => [...prevCasas, ...data]);
        onClose();
        toast({
          title: 'Success',
          description: 'House added successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'No data received after adding the house.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Casas</h1>
      <div className="casas-container">
        {casas.map(casa => (
          <Box
            key={casa.id}
            maxW={'445px'}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            mb={6}
          >
            <Link href={`/property/${casa.id}`}>
              <Box
                position="relative"
                h={'210px'}
                bg={'gray.100'}
                mt={-6}
                mx={-6}
                mb={6}
                overflow="hidden"
                _hover={{ transform: 'scale(1.05)' }}
              >
                <Image
                  src={casa.imageUrl}
                  alt={`Casa en ${casa.address}`}
                  objectFit={'cover'}
                  boxSize={'100%'}
                />
              </Box>
            </Link>
            <Stack>
              <Text
                color={'green.500'}
                textTransform={'uppercase'}
                fontWeight={800}
                fontSize={'sm'}
                letterSpacing={1.1}
              >
                Property ID: {casa.id}
              </Text>
              <Heading
                color={useColorModeValue('gray.700', 'white')}
                fontSize={'2xl'}
                fontFamily={'body'}
              >
                {casa.address}
              </Heading>
              <Text color={'gray.500'}>Location: {casa.descripcion}</Text>
              <Text color={'gray.500'}>Price: {casa.price}</Text>
              <Text color={'gray.500'}>Operation: {casa.price}</Text>
            </Stack>
            <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
              <Box flex={1}></Box>
              <Box>
                <Button onClick={() => console.log(`Agendar Cita for ${casa.id}`)}>Agendar Cita</Button>
              </Box>
            </Stack>
          </Box>
        ))}
      </div>
      {isOwner && (
        <div>
          <Button colorScheme="teal" onClick={onOpen}>
            Add House
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New House</ModalHeader>
              <ModalBody>
                <FormControl mb="4">
                  <FormLabel>Address</FormLabel>
                  <Input name="address" onChange={handleInputChange} />
                </FormControl>
                <FormControl mb="4">
                  <FormLabel>Description</FormLabel>
                  <Input name="descripcion" onChange={handleInputChange} />
                </FormControl>
                <FormControl mb="4">
                  <FormLabel>Price</FormLabel>
                  <Input name="price" onChange={handleInputChange} />
                </FormControl>
                <FormControl mb="4">
                  <FormLabel>Image</FormLabel>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </FormControl>
                {selectedImage && (
                  <Box mt={4}>
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected preview" style={{ maxWidth: '100%' }} />
                  </Box>
                )}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
                  Save
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default CasasComponent;
