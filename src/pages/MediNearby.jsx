import React, { useState, useEffect, useRef, useCallback } from "react";
import DoctorCard from "../components/DoctorCard";
import MapComponent from "../components/MapComponent";
import { Search } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import Header from "../components/Header";

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "General Physician",
  "Orthopedic",
  "Neurologist",
  "Pharmacy",
];

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MediNearby() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [user, setUser] = useState(null);

  const mapRef = useRef(null);
  const mapSectionRef = useRef(null);

  // ✅ Fetch only doctors collection
  useEffect(() => {
    const doctorsCol = collection(db, "doctors");

    setLoading(true);
    const unsubDoctors = onSnapshot(doctorsCol, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setData(list);
      setLoading(false);
    });

    return () => unsubDoctors();
  }, []);

  // Get user location
  useEffect(() => {
    if (!userLocation) getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        () => {
          setUserLocation([27.1767, 78.0081]); // fallback
          setLocating(false);
        }
      );
    } else {
      setUserLocation([27.1767, 78.0081]);
      setLocating(false);
    }
  };

  // Filter data
  const filterData = useCallback(() => {
    let filtered = data;
    if (selectedSpecialty !== "All Specialties") {
      filtered = filtered.filter((d) => d.specialty === selectedSpecialty);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.specialty?.toLowerCase().includes(q) ||
          d.clinic?.toLowerCase().includes(q)
      );
    }
    if (userLocation) {
      const [lat, lng] = userLocation;
      filtered = filtered
        .map((d) => ({
          ...d,
          distance:
            d.lat && d.lng
              ? getDistanceFromLatLonInKm(lat, lng, d.lat, d.lng)
              : Infinity,
        }))
        .filter((d) => d.distance <= 20)
        .sort((a, b) => a.distance - b.distance);
    }
    return filtered;
  }, [data, searchQuery, selectedSpecialty, userLocation]);

  useEffect(() => {
    setFilteredData(filterData());
  }, [filterData]);

  const handleLocate = () => {
    getUserLocation();
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: window.innerWidth < 1024 ? "center" : "start",
      });
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast("Logged out successfully ✅", "success");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      showToast("Logout failed ❌", "error");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && !user) {
        setUser(currentUser);
        showToast(`Welcome back, ${currentUser.email}`, "success");
      } else if (!currentUser) {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <Header
        locating={locating}
        onLocate={handleLocate}
        onLogout={handleLogout}
      />

      {/* Search + Filter Bar */}
      <div className="container mx-auto px-4 py-4 sticky top-20 z-40">
        <div className="backdrop-blur-xl bg-white/80 border border-white/20 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search doctors, clinics, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white/60 border-2 border-gray-200/50 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-90"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-5 py-3.5 bg-white/60 border-2 border-gray-200/50 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 cursor-pointer hover:bg-white/80 font-medium text-gray-700"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-24 right-5 px-6 py-4 rounded-2xl shadow-2xl text-white font-semibold transition-all duration-500 z-50 flex items-center gap-3 ${
            toast.type === "success" 
              ? "bg-gradient-to-r from-green-500 to-emerald-600" 
              : "bg-gradient-to-r from-red-500 to-rose-600"
          } ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            toast.type === "success" ? "bg-green-200" : "bg-red-200"
          }`}></div>
          {toast.message}
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Doctor List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 mb-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Nearby Doctors and Pharmacies
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'} found within 20km
              </p>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Loading nearby doctors...</p>
                  </div>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-center">No doctors found</p>
                    <p className="text-sm text-gray-500 text-center">Try adjusting your search or filters</p>
                  </div>
                </div>
              ) : (
                filteredData.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-white/40 hover:border-blue-200 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DoctorCard
                      doctor={{ ...item, distance: item.distance?.toFixed(1) }}
                      onLocate={setSelectedItem}
                      isSelected={selectedItem?.id === item.id}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Map */}
          <div
            ref={mapSectionRef}
            className="lg:col-span-2 h-[600px] lg:h-[800px] sticky top-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/40 ring-1 ring-gray-200/50"
          >
            <MapComponent
              ref={mapRef}
              doctors={filteredData}
              selectedDoctor={selectedItem}
              userLocation={userLocation}
              fitBounds={true}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}