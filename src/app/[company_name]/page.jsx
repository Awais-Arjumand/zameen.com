import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function CompanyPage({ params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {params.company_name.replace(/_/g, ' ')}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          This is your company dashboard.
        </p>
      </div>
    </div>
  );
}