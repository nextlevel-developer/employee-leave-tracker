import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function RegisterForm() {
  const [form, setForm] = useState({
    organizationName: '',
    slug: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const register = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'organizationName') {
      setForm(prev => ({
        ...prev,
        organizationName: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form);
  };

  const errorMessage = register.error
    ? (register.error as any).response?.data?.error?.message || 'Registration failed'
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <Input label="Organization Name" name="organizationName" value={form.organizationName} onChange={handleChange} placeholder="Acme Corp" required />
      <Input label="Organization Slug" name="slug" value={form.slug} onChange={handleChange} placeholder="acme-corp" required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" required />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" required />
      </div>
      <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@acme.com" required />
      <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
      <Button type="submit" className="w-full" loading={register.isPending}>
        Create Organization
      </Button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
