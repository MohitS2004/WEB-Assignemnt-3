import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Alert, Button, Form } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import { registerUser } from '@/lib/authenticate';

const Register = () => {
  const router = useRouter();
  const [warning, setWarning] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      userName: '',
      password: '',
      password2: ''
    }
  });

  const onSubmit = async (data) => {
    setWarning('');
    try {
      await registerUser(data.userName, data.password, data.password2);
      router.push('/login');
    } catch (err) {
      setWarning(err.message);
    }
  };

  return (
    <>
      <PageHeader text="Register" subtext="Create an account to save your favourites." />
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
            placeholder="Choose a user name"
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
        <Form.Group className="mb-3" controlId="password2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter password"
            isInvalid={!!errors.password2}
            {...register('password2', { required: 'Please confirm your password' })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password2?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Register</Button>
      </Form>
    </>
  );
};

export default Register;
