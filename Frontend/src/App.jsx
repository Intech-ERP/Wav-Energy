import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import LeadForm from "./Components/LeadForm/LeadForm";
import Addressbook from "./Components/Addressbook/Addressbook";
import Login from "./Components/Login/Login";
import Layout from "./Components/Layout/Layout";
// import ColdCall from "./Components/ColdCall/ColdCall.jsx";
import Customer from "./Components/Addressbook/Customer";
import Contact from "./Components/Addressbook/Contact";
import LeadGenerate from "./Components/LeadForm/LeadGenerate";
import EnquiryType from "./Components/LeadForm/EnquiryType/EnquiryType";
import { Toaster } from "react-hot-toast";
import LeadMaster from "./Components/LeadMasters/LeadMaster";
import ColdCall from "./Components/ColdCall/ColdCall";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Layout />}>
          <Route path="cold-call" element={<ColdCall />} />
          <Route path="lead" element={<LeadForm />} />
          <Route path="address-book" element={<Addressbook />} />
          <Route path="lead-master" element={<LeadMaster />} />
          <Route path="customer" element={<Customer />} />
          <Route path="contact" element={<Contact />} />
          <Route path="generate-lead" element={<LeadGenerate />} />
          <Route path="enquiry-type" element={<EnquiryType />} />
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
