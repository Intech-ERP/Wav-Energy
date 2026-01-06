import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Enquiry from "./Components/Enquiry/Enquiry";
import Addressbook from "./Components/Addressbook/Addressbook";
import Login from "./Components/Login/Login";
import Layout from "./Components/Layout/Layout";
// import ColdCall from "./Components/ColdCall/ColdCall.jsx";
import Customer from "./Components/Addressbook/Customer";
import Contact from "./Components/Addressbook/Contact";
import GenerateEnquiry from "./Components/Enquiry/GenerateEnquiry";
import EnquiryType from "./Components/Enquiry/EnquiryType/EnquiryType";
import { Toaster } from "react-hot-toast";
import LeadMaster from "./Components/LeadMasters/LeadMaster";
import Lead from "./Components/Lead/Lead";
import UserRights from "./Components/UserRights/userRights";
import ProtectedRoute from "./ProtectedRoute";
import Report from "./Components/Report/Report";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route
            path="lead"
            element={
              <ProtectedRoute>
                <Lead />
              </ProtectedRoute>
            }
          />
          <Route
            path="enquiry"
            element={
              <ProtectedRoute>
                <Enquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="address-book"
            element={
              <ProtectedRoute>
                <Addressbook />
              </ProtectedRoute>
            }
          />
          <Route
            path="lead-master"
            element={
              <ProtectedRoute>
                <LeadMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="customer"
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
          <Route
            path="contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="generate-enquiry"
            element={
              <ProtectedRoute>
                <GenerateEnquiry />
              </ProtectedRoute>
            }
          />
          <Route
            path="enquiry-type"
            element={
              <ProtectedRoute>
                <EnquiryType />
              </ProtectedRoute>
            }
          />
          <Route
            path="user-rights"
            element={
              <ProtectedRoute>
                <UserRights />
              </ProtectedRoute>
            }
          />
          <Route
            path="report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: 70,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default App;
