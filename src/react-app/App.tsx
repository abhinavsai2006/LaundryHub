import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from '@/react-app/contexts/AuthContext';
import { DataProvider } from '@/react-app/contexts/DataContext';
import { ToastProvider } from '@/react-app/contexts/ToastContext';
import ProtectedRoute from '@/react-app/components/ProtectedRoute';
import Navbar from '@/react-app/components/Navbar';
import MobileNav from '@/react-app/components/MobileNav';
import ScrollToTop from '@/react-app/components/ScrollToTop';

import Login from '@/react-app/pages/Login';
import LandingPage from '@/react-app/pages/LandingPage';
import GoogleRegistration from '@/react-app/pages/GoogleRegistration';
import StudentRegistration from '@/react-app/pages/auth/StudentRegistration';
import OperatorRegistration from '@/react-app/pages/auth/OperatorRegistration';
import AdminRegistration from '@/react-app/pages/auth/AdminRegistration';

import AdminDashboard from '@/react-app/pages/admin/Dashboard';
import LaundryAnalytics from '@/react-app/pages/admin/LaundryAnalytics';
import Announcements from '@/react-app/pages/admin/Announcements';
import Machines from '@/react-app/pages/admin/Machines';
import AddMachine from '@/react-app/pages/admin/AddMachine';
import LostFound from '@/react-app/pages/admin/LostFound';
import LostFoundDetails from '@/react-app/pages/admin/LostFoundDetails';
import Reports from '@/react-app/pages/admin/Reports';
import Settings from '@/react-app/pages/admin/Settings';
import Operators from '@/react-app/pages/admin/Operators';
import Students from '@/react-app/pages/admin/Students';
import StudentDetails from '@/react-app/pages/admin/StudentDetails';
import QRCodes from '@/react-app/pages/admin/QRCodes';
import QRDetails from '@/react-app/pages/admin/QRDetails';
import AdminAlerts from '@/react-app/pages/admin/AdminAlerts';
import AlertDetails from '@/react-app/pages/admin/AlertDetails';
import LaundrySessions from '@/react-app/pages/admin/LaundrySessions';
import SessionDetails from '@/react-app/pages/admin/SessionDetails';
import RoleManagement from '@/react-app/pages/admin/RoleManagement';
import AddEditRole from '@/react-app/pages/admin/AddEditRole';
import TimeSlotGovernance from '@/react-app/pages/admin/TimeSlotGovernance';
import RuleEnforcement from '@/react-app/pages/admin/RuleEnforcement';
import CreateRule from '@/react-app/pages/admin/CreateRule';
import IncidentManagement from '@/react-app/pages/admin/IncidentManagement';
import ComplaintDetails from '@/react-app/pages/admin/ComplaintDetails';

import OperatorDashboard from '@/react-app/pages/operator/Dashboard';
import ScanQR from '@/react-app/pages/operator/ScanQR';
import AssignQR from '@/react-app/pages/operator/AssignQR';
import OperatorMachines from '@/react-app/pages/operator/Machines';
import ManageOrders from '@/react-app/pages/operator/ManageOrders';
import OrderDetailsPage from '@/react-app/pages/operator/OrderDetailsPage';
import OperatorLostFound from '@/react-app/pages/operator/LostFound';
import OperatorLostFoundDetails from '@/react-app/pages/operator/LostFoundDetails';
import AddLostItem from '@/react-app/pages/operator/AddLostItem';
import TicketResponsePage from '@/react-app/pages/operator/TicketResponsePage';

import StudentDashboard from '@/react-app/pages/student/Dashboard';
import SubmitLaundry from '@/react-app/pages/student/SubmitLaundry';
import LinkQR from '@/react-app/pages/student/LinkQR';
import History from '@/react-app/pages/student/History';
import OrderDetails from '@/react-app/pages/student/OrderDetails';
import HelpSupport from '@/react-app/pages/student/HelpSupport';
import StudentProfile from '@/react-app/pages/student/Profile';import ReportLostItem from '@/react-app/pages/student/ReportLostItem';import CameraScannerPage from '@/react-app/pages/shared/CameraScannerPage';import StudentSettings from '@/react-app/pages/student/Settings';
import StudentLostFound from '@/react-app/pages/student/LostFound';
import OperatorProfile from '@/react-app/pages/operator/Profile';
import AnomalyReporting from '@/react-app/pages/operator/AnomalyReporting';
import OperatorHelpSupport from '@/react-app/pages/operator/HelpSupport';
import DigitalSignature from '@/react-app/pages/operator/DigitalSignature';
import BagLabelReplacement from '@/react-app/pages/operator/BagLabelReplacement';
import ManualReceipt from '@/react-app/pages/operator/ManualReceipt';

function HomePage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <Navigate to={`/${user?.role}`} replace />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="pb-20 md:pb-0">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/complete-profile" element={<GoogleRegistration />} />
        <Route path="/register/student" element={<StudentRegistration />} />
        <Route path="/register/operator" element={<OperatorRegistration />} />
        <Route path="/register/admin" element={<AdminRegistration />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/operators"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Operators />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/qr-codes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <QRCodes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/qr-codes/details"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <QRDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LaundryAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Announcements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/machines"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Machines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/machines/add"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddMachine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lost-found"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LostFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lost-found/details"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LostFoundDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts/details"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AlertDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LaundrySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sessions/details"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SessionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RoleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles/add"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddEditRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/roles/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddEditRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/time-slots"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TimeSlotGovernance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rules"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RuleEnforcement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rules/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CreateRule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incidents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <IncidentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incidents/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Operator Routes */}
        <Route
          path="/operator"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/scan"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <ScanQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/assign"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <AssignQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/machines"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorMachines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/orders"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/orders/:orderId"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/lost-found"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorLostFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/lost-found/:id"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorLostFoundDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/lost-found/add"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <AddLostItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/profile"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/help"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <OperatorHelpSupport />
            </ProtectedRoute>
          }
        />
        <Route          path="/operator/help/:ticketId"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <TicketResponsePage />
            </ProtectedRoute>
          }
        />
        <Route          path="/operator/anomaly-reporting"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <AnomalyReporting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/digital-signature"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <DigitalSignature />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/bag-label-replacement"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <BagLabelReplacement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/operator/manual-receipt"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <ManualReceipt />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submit"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <SubmitLaundry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/link-qr"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <LinkQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/history/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/help"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <HelpSupport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lost-found"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLostFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/lost-found/report"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ReportLostItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentSettings />
            </ProtectedRoute>
          }
        />

        {/* Shared Camera Scanner Routes */}
        <Route
          path="/operator/scan/camera"
          element={
            <ProtectedRoute allowedRoles={['operator']}>
              <CameraScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/link-qr/camera"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CameraScannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submit/camera"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CameraScannerPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isAuthenticated && <MobileNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
