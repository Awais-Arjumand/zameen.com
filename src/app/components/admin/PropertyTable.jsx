"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import Select from "react-select";

export default function PropertyTable({
  apiData,
  categoryOptions,
  cityOptions,
  purposeOptions,
  areaUnitOptions,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    description: "",
    image: null,
    price: "",
    priceUnit: "PKR",
    location: "",
    category: null,
    city: null,
    beds: "",
    Bath: "",
    buyOrRent: null,
    propertyDealerName: "",
    propertyDealerEmail: "", // ✅ ADDED
    Area: "",
    areaUnit: null,
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setFormData({
      description: property.description || "",
      image: null,
      price: property.price || "",
      priceUnit: property.priceUnit || "PKR",
      location: property.location || "",
      category: categoryOptions.find((opt) => opt.value === property.category) || null,
      city: cityOptions.find((opt) => opt.value === property.city) || null,
      beds: property.beds || "",
      Bath: property.Bath || "",
      buyOrRent: purposeOptions.find((opt) => opt.value === property.buyOrRent) || null,
      propertyDealerName: property.propertyDealerName || "",
      propertyDealerEmail: property.propertyDealerEmail || "", // ✅ ADDED
      Area: property.Area || "",
      areaUnit: areaUnitOptions.find((opt) => opt.value === property.areaUnit) || null,
    });

    if (property.image) {
      if (typeof property.image === "string" && property.image.startsWith("http")) {
        setImagePreview(property.image);
      } else {
        setImagePreview(`http://localhost:3000${property.image}`);
      }
    } else {
      setImagePreview(null);
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
    setImagePreview(null);
    setFormData({
      description: "",
      image: null,
      price: "",
      priceUnit: "PKR",
      location: "",
      category: null,
      city: null,
      beds: "",
      Bath: "",
      buyOrRent: null,
      propertyDealerName: "",
      propertyDealerEmail: "",
      Area: "",
      areaUnit: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });
  };

  const handleSaveChanges = async () => {
    const dataToSend = new FormData();
    dataToSend.append("description", formData.description);
    dataToSend.append("price", formData.price);
    dataToSend.append("priceUnit", formData.priceUnit);
    dataToSend.append("location", formData.location);
    dataToSend.append("category", formData.category?.value || "");
    dataToSend.append("city", formData.city?.value || "");
    dataToSend.append("beds", formData.beds);
    dataToSend.append("Bath", formData.Bath);
    dataToSend.append("buyOrRent", formData.buyOrRent?.value || "");
    dataToSend.append("propertyDealerName", formData.propertyDealerName);
    dataToSend.append("propertyDealerEmail", formData.propertyDealerEmail);
    dataToSend.append("Area", formData.Area);
    dataToSend.append("areaUnit", formData.areaUnit?.value || "");

    if (formData.image) {
      dataToSend.append("image", formData.image);
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/user/${selectedProperty._id}`,
        dataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      router.refresh();
      handleCloseModal();
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      alert("Failed to update property. Please try again.");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded border border-gray-200 relative">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">City</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Beds</th>
            <th className="px-4 py-2 border">Bath</th>
            <th className="px-4 py-2 border">Area Size</th>
            <th className="px-4 py-2 border">Area Unit</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Purpose</th>
            <th className="px-4 py-2 border">Dealer Name</th>
            <th className="px-4 py-2 border">Dealer Email</th> 
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apiData.map((property) => (
            <tr key={property._id} className="hover:bg-gray-50 transition-colors border-b">
              <td className="px-4 py-2 border">{property.description}</td>
              <td className="px-4 py-2 border">{property.location}</td>
              <td className="px-4 py-2 border">{property.city}</td>
              <td className="px-4 py-2 border">{property.category}</td>
              <td className="px-4 py-2 border">{property.beds}</td>
              <td className="px-4 py-2 border">{property.Bath}</td>
              <td className="px-4 py-2 border">{property.Area}</td>
              <td className="px-4 py-2 border">{property.areaUnit}</td>
              <td className="px-4 py-2 border">
                {property.price} {property.priceUnit}
              </td>
              <td className="px-4 py-2 border">{property.buyOrRent}</td>
              <td className="px-4 py-2 border">{property.propertyDealerName}</td>
              <td className="px-4 py-2 border">{property.propertyDealerEmail}</td> 
              <td className="px-4 py-2 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="px-2 py-1 cursor-pointer bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="px-2 py-1 cursor-pointer bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Property</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Unit
                </label>
                <select
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="PKR">PKR</option>
                  <option value="LAKH">LAKH</option>
                  <option value="CRORE">CRORE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(selected) => handleSelectChange("category", selected)}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                  options={cityOptions}
                  value={formData.city}
                  onChange={(selected) => handleSelectChange("city", selected)}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beds
                </label>
                <input
                  type="number"
                  name="beds"
                  value={formData.beds}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bath
                </label>
                <input
                  type="number"
                  name="Bath"
                  value={formData.Bath}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buy/Rent
                </label>
                <Select
                  options={purposeOptions}
                  value={formData.buyOrRent}
                  onChange={(selected) => handleSelectChange("buyOrRent", selected)}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer Name
                </label>
                <input
                  type="text"
                  name="propertyDealerName"
                  value={formData.propertyDealerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <input
                  type="text"
                  name="Area"
                  value={formData.Area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area Unit
                </label>
                <Select
                  options={areaUnitOptions}
                  value={formData.areaUnit}
                  onChange={(selected) => handleSelectChange("areaUnit", selected)}
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>

          
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-full object-contain rounded self-start"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 cursor-pointer transition-all duration-300 border border-black bg-white hover:bg-black hover:text-white rounded"
              >
                Close
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
