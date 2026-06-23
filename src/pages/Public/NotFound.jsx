import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
      <Card className="border-red-200/50 bg-red-50/20 shadow-lg">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/10">
            <AlertCircle className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-govBlue font-sans">404 - Page Not Located</h2>
            <p className="text-xs text-govMatte-muted">The requested URL path does not exist on the National Grievance Monitoring grid.</p>
          </div>

          <div className="pt-4 border-t border-govMatte-border/60">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-govBlue text-white hover:bg-govBlue-light shadow transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Home</span>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
