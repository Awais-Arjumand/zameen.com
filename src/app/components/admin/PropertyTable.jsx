"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useMemo } from "react";

export default function PropertyTable({ apiData, filters }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    description: "",
    minPrice: "",
    maxPrice: "",
    priceUnit: "PKR",
    location: "",
    category: "",
    city: "",
    beds: "",
    Bath: "",
    buyOrRent: "",
    senderName: "",
    propertyDealerName: "",
    propertyDealerEmail: "",
    Area: "",
    areaUnit: "",
    phone: "",
    portionCategory: "",
    timeRequirement: ""
  });

  const showDeleteConfirmation = (property) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;

    const id = propertyToDelete._id;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:3000/api/user/${id}`);
      router.refresh();
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);

      setNotification({
        show: true,
        message: "Property deleted successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Delete failed:", error);
      setNotification({
        show: true,
        message: "Failed to delete property. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setFormData({
      description: property.description || "",
      minPrice: property.minPrice || "",
      maxPrice: property.maxPrice || "",
      priceUnit: property.priceUnit || "PKR",
      location: property.location || "",
      category: property.category || "",
      city: property.city || "",
      beds: property.beds || "",
      Bath: property.Bath || "",
      buyOrRent: property.buyOrRent || "",
      senderName: property.senderName || "",
      propertyDealerName: property.propertyDealerName || "",
      propertyDealerEmail: property.propertyDealerEmail || "",
      Area: property.Area || "",
      areaUnit: property.areaUnit || "",
      phone: property.phone || "",
      portionCategory: property.portionCategory || "",
      timeRequirement: property.timeRequirement || ""
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/user/${selectedProperty._id}`,
        formData
      );
      router.refresh();
      handleCloseModal();

      setNotification({
        show: true,
        message: "Property updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Update failed:", error);
      setNotification({
        show: true,
        message: "Failed to update property. Please try again.",
        type: "error",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...apiData];
    if (filters.location) {
      result = result.filter((p) =>
        p.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.city?.value) {
      result = result.filter(
        (p) => p.city?.toLowerCase() === filters.city.value.toLowerCase()
      );
    }
    if (filters.category?.value) {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === filters.category.value.toLowerCase()
      );
    }
    if (filters.purpose?.value) {
      result = result.filter(
        (p) =>
          p.buyOrRent?.toLowerCase() === filters.purpose.value.toLowerCase()
      );
    }
    if (filters.dealer) {
      result = result.filter((p) =>
        p.senderName?.toLowerCase().includes(filters.dealer.toLowerCase())
      );
    }
    if (filters.sortBy?.value === "priceAsc") {
      result.sort((a, b) => parseFloat(a.minPrice) - parseFloat(b.minPrice));
    } else if (filters.sortBy?.value === "priceDesc") {
      result.sort((a, b) => parseFloat(b.minPrice) - parseFloat(a.minPrice));
    }
    return result;
  }, [apiData, filters]);

  return (
    <div className="overflow-x-auto bg-white shadow rounded relative">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] text-left text-sm">
          <thead className="bg-[#3B404C] text-white sticky top-0 z-10">
            <tr>
              <th className="p-4 font-medium text-xs md:text-sm">Dealer Name</th>
              <th className="p-4 font-medium text-xs md:text-sm whitespace-nowrap">Message Sender Name</th>
              <th className="p-4 font-medium text-xs md:text-sm">Purpose</th>
              <th className="p-4 font-medium text-xs md:text-sm">City</th>
              <th className="p-4 font-medium text-xs md:text-sm">Location</th>
              <th className="p-4 font-medium text-xs md:text-sm">Category</th>
              <th className="p-4 font-medium text-xs md:text-sm">Portion</th>
              <th className="p-4 font-medium text-xs md:text-sm whitespace-nowrap">Time Requirement</th>
              <th className="p-4 font-medium text-xs md:text-sm">Bedrooms</th>
              <th className="p-4 font-medium text-xs md:text-sm">Bathrooms</th>
              <th className="p-4 font-medium text-xs md:text-sm whitespace-nowrap">Area Size</th>
              <th className="p-4 font-medium text-xs md:text-sm whitespace-nowrap">Phone Number</th>
              <th className="p-4 font-medium text-xs md:text-sm">Min Price</th>
              <th className="p-4 font-medium text-xs md:text-sm">Max Price</th>
              <th className="p-4 font-medium text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((property) => (
              <tr key={property._id} className="even:bg-gray-100">
                <td className="px-3 py-3 border-b text-xs md:text-sm whitespace-nowrap">
                  {property.propertyDealerName || "-"}
                </td>
                <td className="px-3 py-3 border-b text-xs md:text-sm whitespace-nowrap">
                  {property.senderName || "-"}
                </td>
                <td className="px-4 py-3 border-b">{property.buyOrRent || "-"}</td>
                <td className="px-4 py-3 border-b">{property.city || "-"}</td>
                <td className="px-4 py-3 border-b whitespace-nowrap">{property.location || "-"}</td>
                <td className="px-4 py-3 border-b">{property.category || "-"}</td>
                <td className="px-3 py-3 border-b text-xs md:text-sm text-center">
                  {property.portionCategory || "-"}
                </td>
                <td className="px-3 py-3 border-b text-xs md:text-sm text-center">
                  {property.timeRequirement || "-"}
                </td>
                <td className="px-4 py-3 border-b text-center">{property.beds || "-"}</td>
                <td className="px-4 py-3 border-b text-center">{property.Bath || "-"}</td>
                <td className="px-4 py-3 border-b text-center whitespace-nowrap">
                  {property.Area} {property.areaUnit || "-"}
                </td>
                <td className="px-4 py-3 border-b text-center whitespace-nowrap">
                  {property.phone || "-"}
                </td>
                <td className="px-4 py-3 border-b whitespace-nowrap">{property.minPrice || "-"}</td>
                <td className="px-3 py-3 border-b text-xs md:text-sm whitespace-nowrap">
                  {property.maxPrice || "-"}
                </td>
                <td className="px-4 py-3 border-b">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(property)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">Edit Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buy/Rent
                </label>
                <select
                  name="buyOrRent"
                  value={formData.buyOrRent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                >
                  <option value="Buy">Buy</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer Email
                </label>
                <input
                  type="email"
                  name="propertyDealerEmail"
                  value={formData.propertyDealerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area Unit
                </label>
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                >
                  <option value="SqFt">SqFt</option>
                  <option value="Marla">Marla</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portion Category
                </label>
                <input
                  type="text"
                  name="portionCategory"
                  value={formData.portionCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Requirement
                </label>
                <input
                  type="text"
                  name="timeRequirement"
                  value={formData.timeRequirement}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 cursor-pointer transition-all duration-300 border border-black bg-white hover:bg-black hover:text-white rounded text-sm md:text-base"
              >
                Close
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 cursor-pointer transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm md:text-base"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-md">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Confirm Deletion
            </h2>
            <p className="mb-4 md:mb-6 text-sm md:text-base">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <p className="mb-4 font-semibold text-sm md:text-base">
              "{propertyToDelete.description}" at {propertyToDelete.location}
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 cursor-pointer transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-100 rounded text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 cursor-pointer transition-all duration-300 bg-red-600 hover:bg-red-700 text-white rounded text-sm md:text-base"
                disabled={deletingId === propertyToDelete._id}
              >
                {deletingId === propertyToDelete._id
                  ? "Deleting..."
                  : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}