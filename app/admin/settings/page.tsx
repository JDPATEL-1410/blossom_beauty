import React from 'react';

export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Settings</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-3xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
              Site Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="siteName"
                id="siteName"
                defaultValue="Blossom Beauty Room"
                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
              Contact Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="contactEmail"
                id="contactEmail"
                defaultValue="info@blossombeauty.com"
                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Site Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue="Experience luxury beauty services at Blossom Beauty Room in Douglasville, GA."
                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Brief description for your website. This is used for SEO purposes.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 mr-3 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button" // Use type="submit" when hooking up logic
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
