import { Pressable, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Colors from '@/constants/Colors';

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
        backgroundColor: Colors.light.accent,
        paddingVertical: 15,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 9999,
    },
    outline_button: {
        color: Colors.light.backgroundPrimary,
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.light.accent,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 9999,
    },
    text: {
        color: Colors.light.backgroundPrimary,
        fontSize: 20,
    },
    outline_text: {
        color: Colors.light.accent,
        fontSize: 20,
    }
});
