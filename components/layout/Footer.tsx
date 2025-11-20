import {Flex, Group, Image, SimpleGrid, Text} from '@mantine/core';
import {useAtom} from "jotai/index";
import {configurationAtom} from "../../src/atoms/stateAtoms";

const links = [
    {link: '#', label: 'Contact'},
    {link: '#', label: 'Privacy'},
    {link: '#', label: 'Blog'},
    {link: '#', label: 'Store'},
    {link: '#', label: 'Careers'},
];

export function Footer() {

    const [configuration] = useAtom(configurationAtom);

    return (
        <SimpleGrid cols={2} bg="gray.2" h={configuration.footerHeight}>
            <Group>
                <Text ml={10} fz={14} fw={500}>
                    © Copyright 2024 All rights reserved By <a href={'https://devcoauctioneers.co.za/'}
                                                               target={'_blank'}>Devco
                    Auctioneers (Pty) Ltd</a>
                </Text>
            </Group>
            <Flex pr={50} align={'center'} justify={'flex-end'}>
                <Image onClick={() => {
                    window.open('https://play.google.com/store/apps/details?id=online.devco&hl=en&gl=US', '_blank')
                }} mr={140} pos={"absolute"} w={140} src={'/playstore.png'} alt={'logo'}/>
                <Image
                    onClick={() => {
                        window.open('https://apps.apple.com/za/app/devco-online/id6449440793', '_blank')
                    }}
                    h={50} src={'/applestore.png'} alt={'logo'}/>
            </Flex>

        </SimpleGrid>
    );
}