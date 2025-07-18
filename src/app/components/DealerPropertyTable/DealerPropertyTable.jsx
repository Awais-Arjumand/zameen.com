"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function DealerPropertyTable({ properties, onDelete }) {
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
      if (onDelete) {
        onDelete();
      }
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);

      // Show success notification
      setNotification({
        show: true,
        message: "Property deleted successfully!",
        type: "success",
      });

      // Hide notification after 3 seconds
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

      // Hide notification after 3 seconds
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
      minPrice: property.minPrice || property.price || "",
      maxPrice: property.maxPrice || property.price || "",
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

      // Show success notification
      setNotification({
        show: true,
        message: "Property updated successfully!",
        type: "success",
      });

      // Hide notification after 3 seconds
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

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded border border-gray-200 relative">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}
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
            <th className="px-4 py-2 border">Min Price</th>
            <th className="px-4 py-2 border">Max Price</th>
            <th className="px-4 py-2 border">Purpose</th>
            <th className="px-4 py-2 border">Sender/Dealer Name</th>
            <th className="px-4 py-2 border">Dealer Email</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr
              key={property._id}
              className="hover:bg-gray-50 transition-colors border-b"
            >
              <td className="px-4 py-2 border">{property.description}</td>
              <td className="px-4 py-2 border">{property.location}</td>
              <td className="px-4 py-2 border">{property.city}</td>
              <td className="px-4 py-2 border">{property.category}</td>
              <td className="px-4 py-2 border">{property.beds}</td>
              <td className="px-4 py-2 border">{property.Bath}</td>
              <td className="px-4 py-2 border">
                {property.Area} {property.areaUnit}
              </td>
              <td className="px-4 py-2 border">
                {property.minPrice || property.price} {property.priceUnit}
              </td>
              <td className="px-4 py-2 border">
                {property.maxPrice || property.price} {property.priceUnit}
              </td>
              <td className="px-4 py-2 border">{property.buyOrRent}</td>
              <td className="px-4 py-2 border">
                {property.senderName || property.propertyDealerName}
              </td>
              <td className="px-4 py-2 border">
                {property.propertyDealerEmail}
              </td>
              <td className="px-4 py-2 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(property)}
                    className="px-2 py-1 cursor-pointer bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(property)}
                    className={`px-2 py-1 cursor-pointer ${
                      deletingId === property._id ? "bg-gray-400" : "bg-red-500"
                    } text-white rounded text-xs`}
                    disabled={deletingId === property._id}
                  >
                    {deletingId === property._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
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
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                <select
                  name="buyOrRent"
                  value={formData.buyOrRent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  Dealer Email
                </label>
                <input
                  type="email"
                  name="propertyDealerEmail"
                  value={formData.propertyDealerEmail}
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
                <select
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="SqFt">SqFt</option>
                  <option value="Marla">Marla</option>
                </select>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && propertyToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <p className="mb-4 font-semibold">
              "{propertyToDelete.description}" at {propertyToDelete.location}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 cursor-pointer transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 cursor-pointer transition-all duration-300 bg-red-600 hover:bg-red-700 text-white rounded"
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
