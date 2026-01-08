
import React, { useState } from 'react';
import { VehicleInfo, Document } from '../types';

interface VehicleProfileProps {
  info: VehicleInfo;
  documents: Document[];
  onUpdateInfo: (info: VehicleInfo) => void;
  onAddDocument: (doc: Omit<Document, 'id'>) => void;
  onDeleteDocument: (id: string) => void;
}

const VehicleProfile: React.FC<VehicleProfileProps> = ({ info, documents, onUpdateInfo, onAddDocument, onDeleteDocument }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempInfo, setTempInfo] = useState(info);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = () => {
    onUpdateInfo(tempInfo);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Vehicle Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Мой Автомобиль</h3>
          <button 
            onClick={() => isEditing ? handleSaveInfo() : setIsEditing(true)}
            className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
          >
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative group aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
              {info.photo ? (
                <img src={info.photo} alt="Car" className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-400 text-sm">Нет фото</span>
              )}
              {isEditing && (
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-white text-xs font-bold">Изменить фото</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (b64) => setTempInfo({...tempInfo, photo: b64}))} />
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Марка и Модель</label>
              {isEditing ? (
                <input 
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg text-sm"
                  value={`${tempInfo.brand} ${tempInfo.model}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setTempInfo({...tempInfo, brand: parts[0] || '', model: parts.slice(1).join(' ') || ''});
                  }}
                />
              ) : (
                <p className="text-lg font-semibold text-slate-700">{info.brand} {info.model}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Год выпуска</label>
              {isEditing ? (
                <input 
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg text-sm"
                  value={tempInfo.year}
                  onChange={(e) => setTempInfo({...tempInfo, year: e.target.value})}
                />
              ) : (
                <p className="text-lg font-semibold text-slate-700">{info.year}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">Госномер</label>
              {isEditing ? (
                <input 
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg text-sm"
                  value={tempInfo.plate}
                  onChange={(e) => setTempInfo({...tempInfo, plate: e.target.value})}
                />
              ) : (
                <p className="text-lg font-semibold text-slate-700 uppercase">{info.plate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase">VIN</label>
              {isEditing ? (
                <input 
                  className="w-full mt-1 p-2 bg-slate-50 border rounded-lg text-sm"
                  value={tempInfo.vin}
                  onChange={(e) => setTempInfo({...tempInfo, vin: e.target.value})}
                />
              ) : (
                <p className="text-lg font-semibold text-slate-700 uppercase">{info.vin}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Документы</h3>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            Добавить документ
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleImageUpload(e, (b64) => {
                const title = prompt('Название документа (например: Страховка, Права)?');
                if (title) onAddDocument({ title, image: b64 });
              })} 
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="aspect-[4/3] relative">
                <img src={doc.image} alt={doc.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => onDeleteDocument(doc.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-slate-800">{doc.title}</h4>
                {doc.expiryDate && <p className="text-xs text-slate-400 mt-1">Истекает: {doc.expiryDate}</p>}
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">Нет загруженных документов</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleProfile;
