'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react';

export default function AuthDiagnostics() {

  const { user } = useAuth();


  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [checking, setChecking] = useState(true);



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const dbAuth0Id = "google-oauth2|117557498277627571885";
  const tokenSub = tokenInfo?.sub || "";
  const matches = dbAuth0Id === tokenSub;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Auth0 Diagnostics</h1>

        {/* Match Status */}
        <div className={`p-6 rounded-xl mb-8 ${matches ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          <div className="flex items-center gap-3 mb-3">
            {matches ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
            <h2 className={`text-xl font-bold ${matches ? 'text-green-900' : 'text-red-900'}`}>
              {matches ? 'Auth0 ID Matches! ✅' : 'Auth0 ID Mismatch ❌'}
            </h2>
          </div>
          <p className={matches ? 'text-green-700' : 'text-red-700'}>
            {matches 
              ? 'Your token matches the database. The 401 error is coming from something else.'
              : 'Your token does not match the database. This is causing the 401 error.'}
          </p>
        </div>

        {/* Database Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Database auth0Id
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm break-all">
            {dbAuth0Id}
          </div>
          <button
            onClick={() => copyToClipboard(dbAuth0Id)}
            className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2 hover:bg-blue-200"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>

        {/* Token Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Token auth0Id (sub claim)
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm break-all mb-4">
            {tokenSub}
          </div>
          <button
            onClick={() => copyToClipboard(tokenSub)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg flex items-center gap-2 hover:bg-purple-200"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>

          <div className="mt-6 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">Email:</p>
              <p className="text-sm text-gray-600">{tokenInfo?.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Audience:</p>
              <p className="text-sm text-gray-600 break-all">{tokenInfo?.aud}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Issuer:</p>
              <p className="text-sm text-gray-600 break-all">{tokenInfo?.iss}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Expires:</p>
              <p className="text-sm text-gray-600">{tokenInfo?.exp}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Full Token (first 50 chars):</p>
            <div className="bg-gray-50 p-3 rounded-lg font-mono text-xs break-all">
              {tokenInfo?.token}
            </div>
            <button
              onClick={() => copyToClipboard(tokenInfo?.fullToken)}
              className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy Full Token
            </button>
          </div>
        </div>

        {/* Solution */}
        {!matches && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">🔧 How to Fix</h3>
            <div className="space-y-3 text-sm text-yellow-800">
              <p><strong>Option 1: Update Database (Recommended)</strong></p>
              <div className="bg-white p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`db.users.updateOne(
  { email: "olawaleayowande@gmail.com" },
  { $set: { auth0Id: "${tokenSub}" } }
)`}
              </div>

              <p className="mt-4"><strong>Option 2: Delete & Re-register</strong></p>
              <div className="bg-white p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`db.users.deleteOne({ email: "olawaleayowande@gmail.com" })`}
              </div>
              <p className="text-xs">Then register again in the app</p>
            </div>
          </div>
        )}

        {matches && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">✅ Auth0 ID is Correct</h3>
            <p className="text-sm text-green-800 mb-3">
              The auth0Id matches! The 401 error is likely due to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-green-800">
              <li>Backend middleware not updated yet</li>
              <li>Backend not restarted after changes</li>
              <li>Wrong Auth0 audience in backend .env</li>
              <li>Token expired (try logging out and back in)</li>
            </ul>
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm font-semibold mb-2">Quick Fixes:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Update backend middleware with authenticateForRegistration</li>
                <li>Restart backend server</li>
                <li>Try logging out and logging back in</li>
                <li>Check backend console for auth errors</li>
              </ol>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}