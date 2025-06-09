import { useForm } from '@tanstack/react-form';
import { useLogin } from '../../hooks/useAuth';
import { Button, Input } from '../ui';

export const LoginForm = ({ onSuccess }) => {
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        onSuccess?.();
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        children={(field) => (
          <Input
            label="Email"
            type="email"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            required
            autoComplete="email"
          />
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <Input
            label="Password"
            type="password"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            required
            autoComplete="current-password"
          />
        )}
      />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};