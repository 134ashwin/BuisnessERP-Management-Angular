/**
 * PURPOSE / PROBLEM SOLVED: Modular React + TypeScript implementation of the Netflix Add Product Modal with form validation and API POST handler.
 * NAVBAR PAGE & DATA DESTINATION: Standalone component for 'Suppliers' & 'Supplier Products' navbar pages in React applications.
 */

import React, { useState, useEffect } from 'react';

export interface SupplierProductFormData {
  supplierName: string;
  mainSku: string;
  size?: string;
  location: string;
  status: 'Active' | 'Inactive';
  description?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (productSku: string) => void;
  initialSupplierName?: string;
  handleCreateProduct?: (formData: SupplierProductFormData) => Promise<any>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialSupplierName = '',
  handleCreateProduct
}) => {
  const [formData, setFormData] = useState<SupplierProductFormData>({
    supplierName: initialSupplierName,
    mainSku: '',
    size: '',
    location: '',
    status: 'Active',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxDescriptionLength = 250;

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        supplierName: initialSupplierName || prev.supplierName
      }));
    }
  }, [isOpen, initialSupplierName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier Name is required';
    }
    if (!formData.mainSku.trim()) {
      newErrors.mainSku = 'Main SKU is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    const payload: SupplierProductFormData = {
      ...formData,
      mainSku: formData.mainSku.toUpperCase().trim(),
      supplierName: formData.supplierName.trim(),
      location: formData.location.trim()
    };

    try {
      if (handleCreateProduct) {
        await handleCreateProduct(payload);
      } else {
        await new Promise(resolve => setTimeout(resolve, 700));
      }
      setIsSubmitting(false);
      onSuccess(payload.mainSku);
      onClose();
    } catch (err) {
      console.error('Error in handleCreateProduct:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-[#181818] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden text-white transform transition-all duration-300 animate-slide-up"
        style={{
          animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-[#1f1f1f]/50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-6 bg-[#E50914] rounded-full"></div>
            <h2 className="text-xl font-bold text-white tracking-wide">Add New Product</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Supplier Name <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                placeholder="e.g. Apex Global Logistics"
                className="w-full bg-[#333333] border border-neutral-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-neutral-500"
              />
              {errors.supplierName && <p className="mt-1 text-xs text-red-400">{errors.supplierName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Main SKU <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                value={formData.mainSku}
                onChange={(e) => setFormData({ ...formData, mainSku: e.target.value.toUpperCase() })}
                placeholder="e.g. MSKU-8820"
                className="w-full bg-[#333333] border border-neutral-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-white font-mono text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all uppercase placeholder:text-neutral-500"
              />
              {errors.mainSku && <p className="mt-1 text-xs text-red-400">{errors.mainSku}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Size Variant <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g. Standard (M) or EU 42"
                className="w-full bg-[#333333] border border-neutral-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                Location <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Warehouse A · Bay 14"
                className="w-full bg-[#333333] border border-neutral-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-white text-sm rounded-lg px-3.5 py-2.5 outline-none transition-all placeholder:text-neutral-500"
              />
              {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Status <span className="text-[#E50914]">*</span>
            </label>
            <div className="inline-flex items-center p-1 bg-[#222222] border border-neutral-700 rounded-lg gap-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Active' })}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  formData.status === 'Active' ? 'bg-emerald-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  formData.status === 'Inactive' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Description
              </label>
              <span className="text-xs text-neutral-500">
                {(formData.description || '').length} / {maxDescriptionLength}
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={maxDescriptionLength}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide product description or spec notes..."
              className="w-full bg-[#333333] border border-neutral-700 focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] text-white text-sm rounded-lg p-3 outline-none transition-all placeholder:text-neutral-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-medium text-neutral-300 hover:text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#E50914] hover:bg-[#F40612] text-white font-bold text-sm rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Saving...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
