import {Anchor, Button, Checkbox, Image, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {useState} from 'react';
import {useForm} from '@mantine/form';
import {useRouter} from 'next/router';
import classes from './Login.module.css';
import {useInitializeApp} from "../../src/hooks/useInitializeApp";

export function LoginComponent() {
    const router = useRouter();
    const {loginUser, initializeApp} = useInitializeApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);
    const [stepText, setStepText] = useState('Welcome to Devco...'); // Initial message

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        setError(null);
        setLoading(true);

        loginUser(values.email, values.password, 'devco_app')
            .then(() => {
                setShowAnimation(true); // Trigger animation
                startTextRotation(); // Begin rotating text messages
                return initializeApp(); // Run initializeApp
            })
            .then(() => {
                router.push('/UpcomingAuctions'); // Redirect to home on success
            })
            .catch((err) => {
                setError(err.message); // Handle errors
                setShowAnimation(false); // Reset animation if something fails
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const startTextRotation = () => {
        const messages = [
            'Loading your profile...',
            'Preparing auctions and lots...',
        ];
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < messages.length - 1) {
                setStepText(messages[currentIndex]);
                currentIndex += 1;
            } else {
                setStepText(messages[messages.length - 1]); // Keep the last message
                clearInterval(interval); // Stop further updates
            }
        }, 2000); // Change message every 2 seconds
    };

    return (
        <div className={classes.wrapper}>
            {!showAnimation ? (
                <Paper className={classes.form} radius={0} p={30}>
                    <Image src="/logo.png" alt="Logo" width={10}/>

                    <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                        Welcome to Devco
                    </Title>

                    <TextInput
                        label="Email address"
                        placeholder="hello@gmail.com"
                        size="md"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        mt="md"
                        size="md"
                        {...form.getInputProps('password')}
                    />
                    <Checkbox
                        label="Keep me logged in"
                        mt="xl"
                        size="md"
                        {...form.getInputProps('rememberMe', {type: 'checkbox'})}
                    />
                    {error && (
                        <Text color="red" size="sm" mt="sm">
                            {error}
                        </Text>
                    )}
                    <Button
                        fullWidth
                        mt="xl"
                        size="md"
                        loading={loading}
                        onClick={() => form.onSubmit(handleSubmit)()}
                    >
                        Login
                    </Button>

                    <Text ta="center" mt="md">
                        Don&apos;t have an account?{' '}
                        <Anchor<'a'> href="#" fw={700} onClick={(event) => event.preventDefault()}>
                            Register
                        </Anchor>
                    </Text>
                </Paper>
            ) : (
                <div className={classes.animationWrapper}>
                    <img src="/logo.png" alt="Logo animation" className={classes.shakeImage}/>
                    <Text size="lg" mt="lg">
                        {stepText}
                    </Text>
                </div>
            )}
        </div>
    );
}
