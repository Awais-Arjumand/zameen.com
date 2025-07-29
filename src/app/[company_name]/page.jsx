import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function CompanyPage({ params }) {
  const session = await getServerSession(authOptions);
  
  // Debug logs (after await)
  console.log('Session data:', session);
  console.log('URL params:', params);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Verify the company name matches the session
  const companyNameFromSession = session.user?.companyName || '';
  const companyNameFromParams = params.company_name || '';

  if (companyNameFromSession && companyNameFromParams !== companyNameFromSession) {
    // Redirect to correct company URL if mismatch
    redirect(`/${companyNameFromSession}`);
  }

  const displayCompanyName = (companyNameFromParams || companyNameFromSession || 'default').replace(/_/g, ' ');

  return (
    <div className="min-h-screen bg-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to {displayCompanyName}
        </h1>
        
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <p className="text-lg font-medium text-gray-700">
            Logged in as: 
            <span className="text-blue-600 ml-2">
              {session.user?.name || session.user?.fullName || 'User'}
            </span>
          </p>
          <p className="text-gray-600 mt-2">
            Company: {displayCompanyName}
          </p>
          <p className="text-gray-600 mt-2">
            Phone: {session.user?.phone || 'Not available'}
          </p>
        </div>

        <p className="mt-4 text-lg text-gray-600">
          This is your company dashboard.
        </p>
      </div>
    </div>
  );
}