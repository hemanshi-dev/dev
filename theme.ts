import {createTheme} from "@mantine/core";
import {generateColors} from "@mantine/colors-generator";


const primaryColor = '#18133F';
const primaryShades = generateColors(primaryColor);
export const theme = createTheme({
    colors: {
        primary: [
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
            '#00008B',
        ],
    },

    primaryColor: 'primary',
    white: '#FFFFFF',
});


export const darkTheme = createTheme({
    colors: {
        primary: primaryShades,
    },
    primaryColor: 'primary',
    white: '#FFFFFF',
});