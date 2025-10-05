import React from "react";
import {
  MapPin,
  Phone,
  Navigation,
  Hospital,
  Clock,
  Star,
  UserRound,
} from "lucide-react";

export default function DoctorCard({ doctor, onLocate, isSelected }) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md p-6 transition-all duration-300 border ${
        isSelected
          ? "border-blue-500 scale-[1.03] shadow-blue-100"
          : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Doctor Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg border border-blue-200 overflow-hidden">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
            <p className="text-blue-600 font-medium text-sm">
              {doctor.specialty}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-sm font-bold text-gray-900">
            {doctor.rating || "-"}
          </span>
        </div>
      </div>  

      {/* Details */}
      <div className="space-y-3 mb-5 text-sm">
        <div className="flex items-center text-gray-600">
          <Hospital className="w-4 h-4 mr-2 text-blue-500" />
          <span>{doctor.clinic || "Private Clinic"}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />
          <span>{doctor.address}</span>
        </div>

        {doctor.distance && (
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{doctor.distance} km away</span>
          </div>
        )}

        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2 text-green-500" />
          <span>{doctor.phone}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-purple-500" />
          <span>{doctor.experience} experience</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => onLocate(doctor)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
      >
        <Navigation className="w-4 h-4 mr-2" />
        Locate on Map
      </button>
    </div>
  );
}
