import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TeacherPage = ({ lesson }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ title: lesson.name, content: lesson.theme });
    const { t } = useTranslation();
  const editLesson = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Обработка отправки данных
    console.log(formData);
    // После отправки, можно скрыть форму
    setIsEditing(false);
  };

  return (
    <div>
      <button className="edit-lesson" onClick={editLesson}>{t('edit_lesson')}</button>

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Title" 
          />
          <textarea 
            name="content" 
            value={formData.content} 
            onChange={handleChange} 
            placeholder="Content" 
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default TeacherPage;