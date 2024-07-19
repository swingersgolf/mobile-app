import { Pressable, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

type NavButtonProps = {
    route: string;
    text: string;
    outline?: boolean; 
};

const NavButton = ({route, text, outline = false} : NavButtonProps ) => {
    return (
        <Link href={route} asChild style={ outline ? styles.outline_button : styles.button }>
            <Pressable>
                <Text style={outline ? styles.outline_text : styles.text}>{text}</Text>
            </Pressable>
        </Link>
    )
}

export default NavButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        padding: 10,
    },
    outline_button: {
        color: 'white',
        backgroundColor: 'transparent',
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
    },
    text: {
        color: 'green',
    },
    outline_text: {
        color: 'white',
    }
});
