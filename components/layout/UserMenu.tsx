import {Group, Menu, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import {IconChevronDown, IconLogout, IconSettings, IconUser} from "@tabler/icons-react";
import {useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import cx from 'clsx';
import classes from './UserMenu.module.css';
import {useAtom} from "jotai";
import {userAtom} from "../../src/atoms/userAtoms";
import {useSignOut} from "../../src/hooks/useSignOut";


export function UserMenu() {
    const [user] = useAtom(userAtom);
    const theme = useMantineTheme();
    const [opened, {toggle}] = useDisclosure(false);
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const signOut = useSignOut();

    const handleLogout = () => {
        signOut(); // Perform sign-out
        window.location.href = '/auth/Login'; // Redirect to login page
    };
    return <Menu
        width={260}
        position="bottom-end"
        transitionProps={{transition: 'pop-top-right'}}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal
    >
        <Menu.Target>
            <UnstyledButton
                className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
            >
                <Group gap={7}>
                    <IconUser color={theme.colors.blue[6]} size={20} stroke={1.5}/>
                    <Text fw={500} size="sm" lh={1} mr={3}>
                        {user?.username}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5}/>
                </Group>
            </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>

            <Menu.Item leftSection={<IconSettings size={16} stroke={1.5}/>}>
                Account settings
            </Menu.Item>
            <Menu.Item onClick={handleLogout} leftSection={<IconLogout size={16} stroke={1.5}/>}>Logout</Menu.Item>

        </Menu.Dropdown>
    </Menu>
}