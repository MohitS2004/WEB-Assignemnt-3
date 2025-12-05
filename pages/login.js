import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Alert, Button, Form } from 'react-bootstrap';
import { useAtom } from 'jotai';
import PageHeader from '@/components/PageHeader';
import { authenticateUser } from '@/lib/authenticate';
import { getFavourites } from '@/lib/userData';
import { favouritesAtom } from '@/store';

const Login = () => {
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [warning, setWarning] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      userName: '',
      password: ''
    }
  });

  const updateAtom = async () => {
    setFavouritesList(await getFavourites());
  };

  const onSubmit = async (data) => {
    setWarning('');
    try {
      await authenticateUser(data.userName, data.password);
      await updateAtom();
      router.push('/');
    } catch (err) {
      setWarning(err.message);
    }
  };

  return (
    <>
      <PageHeader text="Login" subtext="Sign in to access your saved favourites." />
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        {warning && (
          <Alert variant="danger">
            {warning}
          </Alert>
        )}
        <Form.Group className="mb-3" controlId="userName">
          <Form.Label>User Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user name"
            isInvalid={!!errors.userName}
            {...register('userName', { required: 'User name is required' })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.userName?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            isInvalid={!!errors.password}
            {...register('password', { required: 'Password is required' })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
};

export default Login;
