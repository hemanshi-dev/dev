import {Button, Checkbox, Divider, Flex, Grid, Group, PasswordInput, Stack, Text, TextInput} from "@mantine/core";
import {useForm, yupResolver} from "@mantine/form";
import * as yup from 'yup';
import {signUp} from "../../src/api";
import {showNotification} from "@mantine/notifications";
import {useRouter} from "next/router";

export default function SignUpForm() {
    const router = useRouter();
    const schema = yup.object().shape({
        first_name: yup.string().min(3, 'Name should have at least 3 letters'),
        last_name: yup.string().min(3, 'Last Name should have at least 3 letters'),
        email: yup.string().email('Email is required'),
        password: yup.string().min(4, 'Password should have at least 4 characters'),
        password_confirmation: yup.string().required('Password confirmation is required'),
    });
    const form = useForm<
        {
            first_name: string,
            last_name: string,
            email: string,
            password: string,
            password_confirmation: string,
            check_agreement: boolean,
        }>({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            check_agreement: false
        },
        validate: yupResolver(schema),
    });


    const handleSubmit = () => {
        form.validate();
        console.log(form.errors)
        if (form.isValid()) {
            signUp({...form.values, username: form.values.email}).then((res) => {
                if (res.data.validation_errors) {
                    showNotification({
                        title: 'Error',
                        message: Object.entries(res.data.validation_errors).toString(),
                        color: 'red'
                    })
                } else {
                    showNotification({
                        title: 'Success',
                        message: 'User created successfully',
                        color: 'green'
                    })
                    router.push('/auth/Login')
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    return (
        <Grid>
            <Grid.Col span={12}>

                <Stack>
                    <Text c={'primary.9'} fw={800} fz={15}>User Information</Text>
                    <Divider/>
                    <TextInput {...form.getInputProps('first_name')} label={'First Name'} placeholder={'First Name'}
                               required/>
                    <TextInput {...form.getInputProps('last_name')} label={'Last Name'} placeholder={'Last Name'}
                               required/>
                    <TextInput {...form.getInputProps('email')} label={'Email'} placeholder={'Email'}
                               required/>
                    <PasswordInput {...form.getInputProps('password')} label={'Password'} placeholder={'Password'}
                                   required/>
                    <PasswordInput {...form.getInputProps('password_confirmation')} label={'Confirm Password'}
                                   placeholder={'Confirm Password'} required/>
                </Stack>
            </Grid.Col>
            <Grid.Col span={12}>
                <Stack>
                    <Divider/>
                    <Text c={'dimmed'} fz={14}>By checking below you agree.</Text>
                    <Group pl={20}>
                        <Checkbox {...form.getInputProps('check_agreement')}
                                  label="I have read and agree to the T&C's"/>
                    </Group>
                    <Flex justify={'flex-end'}>
                        <Button disabled={!form.values.check_agreement} onClick={() => {
                            console.log('wamamama')
                            handleSubmit()
                        }}>Submit</Button>
                    </Flex>
                </Stack>
            </Grid.Col>

        </Grid>
    );
}