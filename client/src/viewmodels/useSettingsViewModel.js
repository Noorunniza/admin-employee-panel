import { useState, useEffect } from 'react';
import { getStoreData, updateStoreData, uploadLogo } from '../models/settingsModel';

const useStoreViewModel = () => {
  const [storeData, setStoreData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStoreData();
        setStoreData(data);
        setFormData(data);
      } catch (error) {
        console.error('❌ Failed to fetch store data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = async (fieldToUpdate = null) => {
    try {
      const updatedData = fieldToUpdate
        ? { ...storeData, [fieldToUpdate]: formData[fieldToUpdate] }
        : formData;

      const updated = await updateStoreData(storeData._id, updatedData);
      setStoreData(updated);
      setFormData(updated);
    } catch (error) {
      console.error('❌ Failed to update store data', error);
    }
  };

  const uploadStoreLogo = async (file) => {
    try {
      const updated = await uploadLogo(storeData._id, file);
      setStoreData(updated);
      setFormData(updated);
    } catch (err) {
      console.error('❌ Logo upload failed', err);
    }
  };

  return {
    storeData,
    formData,
    loading,
    handleChange,
    saveChanges,
    uploadStoreLogo
  };
};

export default useStoreViewModel;
